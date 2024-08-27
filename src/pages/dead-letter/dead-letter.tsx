import React, { useMemo, useState } from 'react';
import { match, P } from 'ts-pattern';
import { useParams } from 'react-router-dom';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { O5DanteV1DeadMessageEvent, O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest } from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { TableRowType } from '@/components/data-table/body.tsx';
import { MagicWandIcon } from '@radix-ui/react-icons';
import {
  useO5DanteV1DeadMessageQueryServiceGetDeadMessage,
  useO5DanteV1DeadMessageQueryServiceListDeadMessageEvents,
} from '@/data/api/hooks/generated';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';

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
  // {
  //   header: 'Type',
  //   id: 'event.type',
  //   size: 120,
  //   minSize: 100,
  //   maxSize: 150,
  //   accessorFn: (row) => deadMessageEventTypeLabels[getDeadMessageEventType(row.event)],
  //   filter: {
  //     type: {
  //       select: {
  //         isMultiple: true,
  //         options: Object.values(DeadMessageEventType).map((value) => ({ label: deadMessageEventTypeLabels[value], value })),
  //       },
  //     },
  //   },
  // },
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

function getSubRowRenderer(decodeBase64: boolean, setDecodeBase64: (value: boolean) => void) {
  return function renderSubRow({ row }: TableRowType<O5DanteV1DeadMessageEvent>) {
    // const problemType = getDeadMessageProblem(row.original.event?.type?.created?.spec);

    return (
      <div className="flex flex-col gap-4">
        <NutritionFact vertical label="Actor" value="-" />

        {match(row.original.event)
          .with({ updated: P.not(P.nullish) }, (e) => {
            const hasBase64Strings = false;

            // try {
            //   if (e.updated.spec?.payload?.json) {
            //     const parsed = JSON.parse(e.updated.spec.payload.json);
            //     hasBase64Strings = getBase64StringObjectPaths(parsed).length > 0;
            //   }
            // } catch {}

            return (
              <>
                <NutritionFact
                  vertical
                  label="Version ID"
                  renderWhenEmpty="-"
                  value={e.updated.spec?.versionId ? <UUID canCopy short uuid={e.updated.spec?.versionId} /> : undefined}
                />
                {/*<NutritionFact vertical label="Queue Name" renderWhenEmpty="-" value={e.updated.spec?.queueName} />*/}
                {/*<NutritionFact vertical label="gRPC Name" renderWhenEmpty="-" value={e.updated.spec?.grpcName} />*/}
                {/*<NutritionFact*/}
                {/*  vertical*/}
                {/*  label="Infa Message ID"*/}
                {/*  renderWhenEmpty="-"*/}
                {/*  value={e.updated.spec?.infraMessageId ? <UUID canCopy short uuid={e.updated.spec?.infraMessageId} /> : undefined}*/}
                {/*/>*/}
                <NutritionFact
                  vertical
                  label="Timestamp"
                  renderWhenEmpty="-"
                  value={
                    e.updated.spec?.message?.timestamp ? (
                      <DateFormat
                        day="2-digit"
                        hour="numeric"
                        minute="2-digit"
                        second="numeric"
                        month="2-digit"
                        timeZoneName="short"
                        year="numeric"
                        value={e.updated.spec.message.timestamp}
                      />
                    ) : undefined
                  }
                />

                {/*<NutritionFact*/}
                {/*  label="Problem"*/}
                {/*  renderWhenEmpty="-"*/}
                {/*  value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}*/}
                {/*/>*/}

                {/*{buildDeadMessageProblemFacts(e.updated.spec?.problem)}*/}

                {/*<NutritionFact*/}
                {/*  vertical*/}
                {/*  label="JSON"*/}
                {/*  renderWhenEmpty="-"*/}
                {/*  value={<CodeEditor disabled value={formatJSONString(e.updated.spec?.payload?.json || '', decodeBase64)} />}*/}
                {/*/>*/}

                {hasBase64Strings && (
                  <button
                    className="bg-background border border-r-2 hover:bg-slate-900 text-white font-bold py-1 px-2 rounded flex gap-2 items-center text-sm w-fit"
                    onClick={() => {
                      setDecodeBase64(!decodeBase64);
                    }}
                    type="button"
                  >
                    <MagicWandIcon />
                    {decodeBase64 ? 'Encode' : 'Decode'}
                  </button>
                )}
              </>
            );
          })
          .with({ rejected: P.not(P.nullish) }, (e) => {
            return <NutritionFact vertical label="Reason" value={e.rejected.reason} />;
          })
          .otherwise(() => null)}
      </div>
    );
  };
}

export function DeadLetter() {
  const { messageId } = useParams();
  const [decodeBase64, setDecodeBase64] = useState(false);
  const renderSubRow = useMemo(() => getSubRowRenderer(decodeBase64, setDecodeBase64), [decodeBase64]);
  const { data, error, isLoading } = useO5DanteV1DeadMessageQueryServiceGetDeadMessage(messageId ? { messageId } : undefined);
  useErrorHandler(error, 'Failed to load dead letter message');
  const hasBase64Strings = useMemo(() => {
    // try {
    //   if (data?.message?.currentSpec?.payload?.json) {
    //     const parsed = JSON.parse(data.message.currentSpec.payload.json);
    //     return getBase64StringObjectPaths(parsed).length > 0;
    //   }
    // } catch {}

    return false;
  }, [data]);

  const { sortValues, setSortValues, filterValues, setFilterValues, psmQuery } =
    useTableState<O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest['query']>();
  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useO5DanteV1DeadMessageQueryServiceListDeadMessageEvents(messageId ? { messageId, query: psmQuery } : undefined);
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

  // const problemType = getDeadMessageProblem(data?.message?.currentSpec);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Dead Letter: {messageId ? <UUID canCopy uuid={messageId} /> : <Skeleton />}</h1>
        {messageId && <ActionActivator messageId={messageId} />}
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            {/*<NutritionFact*/}
            {/*  isLoading={isLoading}*/}
            {/*  label="Infra Message ID"*/}
            {/*  renderWhenEmpty="-"*/}
            {/*  value={data?.message?.currentSpec?.infraMessageId ? <UUID canCopy short uuid={data.message.currentSpec.infraMessageId} /> : null}*/}
            {/*/>*/}
            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={data?.message?.status ? <TranslatedText i18nKey={`dante:enum.O5DanteV1MessageStatus.${data.message.status}`} /> : null}
            />
            <NutritionFact isLoading={isLoading} label="Queue" renderWhenEmpty="-" value={data?.message.data?.currentVersion?.sqsMessage?.queueUrl} />
            {/*<NutritionFact isLoading={isLoading} label="gRPC Name" renderWhenEmpty="-" value={data?.message?.data?.currentVersion?.message?.} />*/}
            <NutritionFact
              isLoading={isLoading}
              label="Created At"
              renderWhenEmpty="-"
              value={
                data?.message?.metadata?.createdAt ? (
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={data.message.metadata.createdAt}
                  />
                ) : null
              }
            />

            {/*<NutritionFact*/}
            {/*  isLoading={isLoading}*/}
            {/*  label="Problem"*/}
            {/*  renderWhenEmpty="-"*/}
            {/*  value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}*/}
            {/*/>*/}

            {/*{buildDeadMessageProblemFacts(data?.message?.currentSpec?.problem)}*/}
          </CardContent>
        </Card>
        <div className="flex-grow h-fit basis-5/6 flex flex-col gap-4 overflow-auto">
          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Payload</CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/*<CodeEditor disabled value={formatJSONString(data?.message?.currentSpec?.payload?.json || '', decodeBase64)} />*/}
              {hasBase64Strings && (
                <button
                  className="bg-background border border-r-2 hover:bg-slate-900 text-white font-bold py-1 px-2 rounded flex gap-2 items-center text-sm w-fit"
                  onClick={() => {
                    setDecodeBase64((prevState) => !prevState);
                  }}
                  type="button"
                >
                  <MagicWandIcon />
                  {decodeBase64 ? 'Encode' : 'Decode'}
                </button>
              )}
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
