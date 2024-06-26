import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useEnvironment, useListEnvironmentEvents } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import {
  EnvironmentEventType,
  environmentEventTypeLabels,
  environmentStatusLabels,
  getEnvironmentEventType,
  O5DeployerV1EnvironmentEvent,
} from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { match, P } from 'ts-pattern';
import { buildEnvironmentCustomVariables, buildEnvironmentProvider } from '@/pages/environment/build-facts.tsx';
import { UpsertEnvironmentDialog } from '@/pages/environment/upsert-environment-dialog/upsert-environment-dialog.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { TableRowType } from '@/components/data-table/body.tsx';

const eventColumns: CustomColumnDef<O5DeployerV1EnvironmentEvent>[] = [
  getRowExpander(),
  {
    header: 'ID',
    id: 'metadata.eventId',
    accessorFn: (row) => row.metadata?.eventId,
    size: 110,
    minSize: 110,
    maxSize: 110,
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
    accessorFn: (row) => environmentEventTypeLabels[getEnvironmentEventType(row.event)],
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.values(EnvironmentEventType).map((value) => ({ label: environmentEventTypeLabels[value], value })),
        },
      },
    },
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

function renderSubRow({ row }: TableRowType<O5DeployerV1EnvironmentEvent>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ configured: P.not(P.nullish) }, (e) => {
          return (
            <>
              <NutritionFact vertical label="Full Name" renderWhenEmpty="-" value={e.configured.config?.fullName} />
              <NutritionFact vertical label="CORS Origins" renderWhenEmpty="-" value={e.configured.config?.corsOrigins?.join('\n')} />
              <NutritionFact vertical label="Trust JWKS" renderWhenEmpty="-" value={e.configured.config?.trustJwks?.join('\n')} />

              {e.configured.config?.provider && (
                <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-start gap-1" type="button">
                      <CaretDownIcon />
                      <h4 className="text-lg">Provider</h4>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>{buildEnvironmentProvider(e.configured.config.provider)}</CollapsibleContent>
                </Collapsible>
              )}

              <h4>Variables</h4>
              {buildEnvironmentCustomVariables(e.configured.config?.vars)}
            </>
          );
        })
        .otherwise(() => null)}
    </div>
  );
}

export function Environment() {
  const { environmentId } = useParams();
  const { data, error, isLoading } = useEnvironment({ environmentId });
  useErrorHandler(error, 'Failed to load environment');

  const { sortValues, setSortValues, filterValues, setFilterValues, psmQuery } = useTableState();
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsAreLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useListEnvironmentEvents({ environmentId, query: psmQuery });
  useErrorHandler(eventsError, 'Failed to load environment events');
  const flattenedEvents = useMemo(() => {
    if (!eventsData?.pages) {
      return [];
    }

    return eventsData.pages.reduce((acc, page) => {
      if (page?.events) {
        return [...acc, ...page.events];
      }

      return acc;
    }, [] as O5DeployerV1EnvironmentEvent[]);
  }, [eventsData?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Environment: {environmentId ? <UUID canCopy uuid={environmentId} /> : <Skeleton />}</h1>
        {environmentId && <UpsertEnvironmentDialog environmentId={environmentId} />}
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={data?.state?.status ? environmentStatusLabels[data.state.status] : null}
            />
          </CardContent>
        </Card>

        <div className="flex-grow h-fit basis-5/6 flex flex-col gap-4">
          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Config</CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <NutritionFact renderWhenEmpty="-" label="Full Name" value={data?.state?.config?.fullName} />
                <NutritionFact renderWhenEmpty="-" label="CORS Origins" value={data?.state?.config?.corsOrigins?.join('\n')} />
                <NutritionFact renderWhenEmpty="-" label="Trust JWKS" value={data?.state?.config?.trustJwks?.join('\n')} />

                {data?.state?.config?.provider && (
                  <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-start gap-1" type="button">
                        <CaretDownIcon />
                        <h4 className="text-lg">Provider</h4>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>{buildEnvironmentProvider(data.state.config.provider)}</CollapsibleContent>
                  </Collapsible>
                )}

                <h4>Variables</h4>
                {buildEnvironmentCustomVariables(data?.state?.config?.vars)}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Events</CardHeader>
            <CardContent>
              <DataTable
                getRowCanExpand
                columns={eventColumns}
                controlledColumnSort={sortValues}
                data={flattenedEvents || []}
                filterValues={filterValues}
                onColumnSort={setSortValues}
                onFilter={setFilterValues}
                pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
                renderSubComponent={renderSubRow}
                showSkeleton={Boolean(flattenedEvents === undefined || eventsAreLoading || eventsError)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
