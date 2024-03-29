import React, { useMemo } from 'react';
import { match, P } from 'ts-pattern';
import { useParams } from 'react-router-dom';
import { useListMessageEvents, useMessage } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { deadMessageEventTypeLabels, deadMessageStatusLabels, getDeadMessageEventType, O5DanteV1DeadMessageEvent } from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { DeadMessageProblem, deadMessageProblemLabels, getDeadMessageProblem } from '@/data/types/ui/dante.ts';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { formatJSONString } from '@/lib/json.ts';
import { useTableState } from '@/components/data-table/state.ts';
import { buildDeadMessageProblemFacts } from './build-facts';
import { TableRowType } from '@/components/data-table/body.tsx';

const eventColumns: CustomColumnDef<O5DanteV1DeadMessageEvent, any>[] = [
  getRowExpander(),
  {
    header: 'ID',
    id: 'metadata.eventId',
    size: 110,
    minSize: 110,
    maxSize: 110,
    accessorFn: (row) => row.metadata?.eventId,
    cell: ({ getValue }) => {
      return <UUID canCopy short uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Type',
    id: 'event.type',
    size: 120,
    minSize: 100,
    maxSize: 150,
    accessorFn: (row) => deadMessageEventTypeLabels[getDeadMessageEventType(row.event)],
  },
  {
    header: 'Timestamp',
    id: 'metadata.timestamp',
    align: 'right',
    accessorFn: (row) => row.metadata?.timestamp,
    enableSorting: true,
    cell: ({ getValue }) => {
      return (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={getValue<string>()}
        />
      );
    },
    filter: {
      type: {
        date: {
          isFlexible: true,
          exactLabel: 'Pick a date',
          startLabel: 'Min',
          endLabel: 'Max',
        },
      },
    },
  },
];

function renderSubRow({ row }: TableRowType<O5DanteV1DeadMessageEvent>) {
  const problemType = getDeadMessageProblem(row.original.event?.type?.created?.spec);

  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ updated: P.not(P.nullish) }, (e) => {
          return (
            <>
              <NutritionFact vertical label="Version ID" value={e.updated.spec?.versionId ? <UUID uuid={e.updated.spec?.versionId} /> : undefined} />
              <NutritionFact vertical label="Queue Name" value={e.updated.spec?.queueName} />
              <NutritionFact vertical label="gRPC Name" value={e.updated.spec?.grpcName} />
              <NutritionFact
                vertical
                label="Infa Message ID"
                value={e.updated.spec?.infraMessageId ? <UUID uuid={e.updated.spec?.infraMessageId} /> : undefined}
              />
              <NutritionFact
                vertical
                label="Created At"
                value={
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={e.updated.spec?.createdAt}
                  />
                }
              />

              <NutritionFact
                label="Problem"
                renderWhenEmpty="-"
                value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}
              />

              {buildDeadMessageProblemFacts(e.updated.spec?.problem)}

              <NutritionFact vertical label="JSON" value={<CodeEditor disabled value={formatJSONString(e.updated.spec?.payload?.json || '')} />} />
            </>
          );
        })
        .with({ created: P.not(P.nullish) }, (e) => {
          return (
            <>
              <NutritionFact vertical label="Version ID" value={<UUID uuid={e.created.spec?.versionId} />} />
              <NutritionFact vertical label="Queue Name" value={e.created.spec?.queueName} />
              <NutritionFact vertical label="gRPC Name" value={e.created.spec?.grpcName} />
              <NutritionFact vertical label="Infa Message ID" value={<UUID uuid={e.created.spec?.infraMessageId} />} />
              <NutritionFact
                vertical
                label="Created At"
                value={
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={e.created.spec?.createdAt}
                  />
                }
              />

              <NutritionFact
                label="Problem"
                renderWhenEmpty="-"
                value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}
              />

              {buildDeadMessageProblemFacts(e.created.spec?.problem)}

              <NutritionFact vertical label="JSON" value={<CodeEditor disabled value={formatJSONString(e.created.spec?.payload?.json || '')} />} />
            </>
          );
        })
        .with({ rejected: P.not(P.nullish) }, (e) => {
          return <NutritionFact vertical label="Reason" value={e.rejected.reason} />;
        })
        .otherwise(() => null)}
    </div>
  );
}

export function DeadLetter() {
  const { messageId } = useParams();
  const { data, error, isLoading } = useMessage({ messageId });
  useErrorHandler(error, 'Failed to load dead letter message');

  const { sortValues, setSortValues, filterValues, setFilterValues, psmQuery } = useTableState();
  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListMessageEvents({ messageId, query: psmQuery });
  useErrorHandler(eventsError, 'Failed to load message events');
  const flattenedEvents = useMemo(() => {
    if (!eventsData?.pages) {
      return [];
    }

    return eventsData.pages.reduce((acc, page) => {
      if (page?.events) {
        return [...acc, ...page.events];
      }

      return acc;
    }, [] as O5DanteV1DeadMessageEvent[]);
  }, [eventsData?.pages]);

  const problemType = getDeadMessageProblem(data?.message?.currentSpec);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Dead Letter: {messageId ? <UUID uuid={messageId} /> : <Skeleton />}</h1>
        {messageId && <ActionActivator messageId={messageId} />}
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact
              isLoading={isLoading}
              label="Infra Message ID"
              renderWhenEmpty="-"
              value={data?.message?.currentSpec?.infraMessageId ? <UUID canCopy short uuid={data.message.currentSpec.infraMessageId} /> : null}
            />
            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={data?.message?.status ? deadMessageStatusLabels[data.message.status] : null}
            />
            <NutritionFact isLoading={isLoading} label="Queue Name" renderWhenEmpty="-" value={data?.message?.currentSpec?.queueName} />
            <NutritionFact isLoading={isLoading} label="gRPC Name" renderWhenEmpty="-" value={data?.message?.currentSpec?.grpcName} />
            <NutritionFact
              isLoading={isLoading}
              label="Created At"
              renderWhenEmpty="-"
              value={
                data?.message?.currentSpec?.createdAt ? (
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={data.message.currentSpec.createdAt}
                  />
                ) : null
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Problem"
              renderWhenEmpty="-"
              value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}
            />

            {buildDeadMessageProblemFacts(data?.message?.currentSpec?.problem)}
          </CardContent>
        </Card>
        <div className="flex-grow h-fit basis-5/6 flex flex-col gap-4">
          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Payload</CardHeader>
            <CardContent>
              <CodeEditor disabled value={formatJSONString(data?.message?.currentSpec?.payload?.json || '')} />
            </CardContent>
          </Card>

          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Events</CardHeader>
            <CardContent>
              <DataTable
                getRowCanExpand
                columns={eventColumns}
                controlledColumnSort={sortValues}
                data={flattenedEvents}
                filterValues={filterValues}
                onColumnSort={setSortValues}
                onFilter={setFilterValues}
                pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
                renderSubComponent={renderSubRow}
                showSkeleton={Boolean(eventsData === undefined || eventsAreLoading || eventsError)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
