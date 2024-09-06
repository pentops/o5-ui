import React, { useMemo, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { match, P } from 'ts-pattern';
import { useParams } from 'react-router-dom';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { DataTable } from '@/components/data-table/data-table.tsx';
import {
  getOneOfType,
  O5DanteV1DeadMessageEvent,
  O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest,
  O5DanteV1DeadMessageQueryServiceListDeadMessageEventsSortableFields,
} from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { TableRowType } from '@/components/data-table/body.tsx';
import {
  useO5DanteV1DeadMessageQueryServiceGetDeadMessage,
  useO5DanteV1DeadMessageQueryServiceListDeadMessageEvents,
} from '@/data/api/hooks/generated';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { extendColumnsWithPSMFeatures } from '@/components/data-table/util.ts';
import { O5_DANTE_V1_DEAD_MESSAGE_QUERY_SERVICE_LIST_DEAD_MESSAGE_EVENTS_DEFAULT_SORTS } from '@/data/table-config/generated';
import { DeadMessage } from '@/pages/dead-letter/dead-message/dead-message.tsx';
import { DeadMessageVersion } from '@/pages/dead-letter/dead-message/dead-message-version.tsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { J5EventMetadata } from '@/components/j5/j5-event-metadata.tsx';

function getEventColumns(t: TFunction) {
  return extendColumnsWithPSMFeatures<
    O5DanteV1DeadMessageEvent,
    O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest['query']
  >(
    [
      getRowExpander(),
      {
        header: 'ID',
        id: 'metadata.eventId',
        size: 110,
        minSize: 110,
        maxSize: 110,
        accessorFn: (row) => row.metadata?.eventId,
        cell: ({ getValue }) => {
          const eventId = getValue<string>();
          return eventId ? <UUID canCopy short uuid={eventId} /> : null;
        },
      },
      {
        header: 'Type',
        id: 'event',
        size: 120,
        minSize: 100,
        maxSize: 150,
        accessorFn: (row) => {
          const oneOfType = getOneOfType(row.event);
          return oneOfType ? t(`dante:oneOf.O5DanteV1DeadMessageEventType.${oneOfType}`) : undefined;
        },
      },
      {
        header: 'Timestamp',
        id: 'metadata.timestamp',
        align: 'right',
        accessorFn: (row) => row.metadata?.timestamp,
        enableSorting: true,
        cell: ({ getValue }) => {
          const value = getValue<string>();

          return value ? (
            <DateFormat
              day="2-digit"
              hour="numeric"
              minute="2-digit"
              second="numeric"
              month="2-digit"
              timeZoneName="short"
              year="numeric"
              value={value}
            />
          ) : null;
        },
      },
    ],
    [],
    Object.values(O5DanteV1DeadMessageQueryServiceListDeadMessageEventsSortableFields),
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSubRowRenderer(_decodeBase64: boolean, _setDecodeBase64: (value: boolean) => void) {
  return function renderSubRow({ row }: TableRowType<O5DanteV1DeadMessageEvent>) {
    return (
      <div className="flex flex-col gap-4">
        <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-start gap-1" type="button">
              <CaretDownIcon />
              <h4 className="text-lg">Metadata</h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <J5EventMetadata metadata={row.original.metadata} isLoading={false} />
          </CollapsibleContent>
        </Collapsible>

        {match(row.original.event)
          .with({ notified: P.not(P.nullish) }, (e) => <DeadMessage vertical deadMessage={e.notified.notification} heading="Notification" />)
          .with({ updated: P.not(P.nullish) }, (e) => <DeadMessageVersion version={e.updated.spec} heading="Dead Message" />)
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
  const { t } = useTranslation('dante');
  const eventColumns = useMemo(() => getEventColumns(t), [t]);
  const [decodeBase64, setDecodeBase64] = useState(false);
  const renderSubRow = useMemo(() => getSubRowRenderer(decodeBase64, setDecodeBase64), [decodeBase64]);
  const { data, error, isLoading } = useO5DanteV1DeadMessageQueryServiceGetDeadMessage(messageId ? { messageId } : undefined);
  useErrorHandler(error, 'Failed to load dead letter message');

  const { sortValues, setSortValues, filterValues, setFilterValues, psmQuery } = useTableState<
    O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest['query']
  >({ initialSort: O5_DANTE_V1_DEAD_MESSAGE_QUERY_SERVICE_LIST_DEAD_MESSAGE_EVENTS_DEFAULT_SORTS });
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
            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={data?.message?.status ? <TranslatedText i18nKey={`dante:enum.O5DanteV1MessageStatus.${data.message.status}`} /> : null}
            />

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

            <NutritionFact
              isLoading={isLoading}
              label="Updated At"
              renderWhenEmpty="-"
              value={
                data?.message?.metadata?.updatedAt ? (
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={data.message.metadata.updatedAt}
                  />
                ) : null
              }
            />

            <NutritionFact isLoading={isLoading} label="Last Sequence" renderWhenEmpty="-" value={data?.message?.metadata?.lastSequence} />
          </CardContent>
        </Card>
        <div className="flex-grow h-fit basis-5/6 flex flex-col gap-4 overflow-auto">
          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Notification</CardHeader>
            <CardContent className="flex flex-col gap-4">
              <DeadMessage deadMessage={data?.message?.data?.notification} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Current Version</CardHeader>
            <CardContent className="flex flex-col gap-4">
              <DeadMessageVersion version={data?.message?.data?.currentVersion} isLoading={isLoading} />
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
