import React, { useMemo } from 'react';
import { useListStackEvents, useStack } from '@/data/api';
import { Link, useParams } from 'react-router-dom';
import { match, P } from 'ts-pattern';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getStackEventType, O5AwsDeployerV1StackEvent, StackEventType, stackEventTypeLabels, stackStatusLabels } from '@/data/types';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UpsertStackDialog } from '@/pages/stack/upsert-stack-dialog/upsert-stack-dialog.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { buildCodeSourceFact } from '@/pages/stack/build-facts.tsx';
import { TableRowType } from '@/components/data-table/body.tsx';

const eventColumns: CustomColumnDef<O5AwsDeployerV1StackEvent>[] = [
  getRowExpander(),
  {
    header: 'ID',
    id: 'metadata.eventId',
    size: 110,
    minSize: 110,
    maxSize: 110,
    accessorFn: (row) => row.metadata?.eventId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short uuid={value} /> : null;
    },
  },
  {
    header: 'Type',
    id: 'event.type',
    size: 175,
    minSize: 175,
    maxSize: 175,
    accessorFn: (row) => {
      const type = getStackEventType(row);
      return row.event ? stackEventTypeLabels[type] : '';
    },
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.values(StackEventType).map((value) => ({ label: stackEventTypeLabels[value], value })),
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

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1StackEvent>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact label="Actor" value="-" />

      {/* TODO: add missing events */}
      {match(row.original.event)
        .with({ configured: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Application Name" renderWhenEmpty="-" value={e.configured.applicationName} />
            <NutritionFact
              label="Environment"
              renderWhenEmpty="-"
              value={
                e.configured.environmentName ? (
                  e.configured.environmentId ? (
                    <span>
                      <Link to={`/environment/${e.configured.environmentId}`}>{e.configured.environmentName}</Link> (
                      <UUID canCopy to={`/environment/${e.configured.environmentId}`} uuid={e.configured.environmentId} />)
                    </span>
                  ) : (
                    e.configured.environmentName
                  )
                ) : e.configured.environmentId ? (
                  <UUID canCopy to={`/environment/${e.configured.environmentId}`} uuid={e.configured.environmentId} />
                ) : undefined
              }
            />
          </>
        ))
        .with({ deploymentCompleted: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact
              label="Deployment"
              renderWhenEmpty="-"
              value={
                e.deploymentCompleted.deployment?.deploymentId ? (
                  <UUID
                    canCopy
                    to={`/deployment/${e.deploymentCompleted.deployment.deploymentId}`}
                    uuid={e.deploymentCompleted.deployment.deploymentId}
                  />
                ) : undefined
              }
            />
            <NutritionFact
              label="Deployment Version"
              renderWhenEmpty="-"
              value={e.deploymentCompleted.deployment?.version ? <UUID canCopy uuid={e.deploymentCompleted.deployment.version} /> : undefined}
            />
          </>
        ))
        .with({ deploymentFailed: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Failure Reason" renderWhenEmpty="-" value={e.deploymentFailed.error} />
            <NutritionFact
              label="Deployment"
              renderWhenEmpty="-"
              value={
                e.deploymentFailed.deployment?.deploymentId ? (
                  <UUID to={`/deployment/${e.deploymentFailed.deployment.deploymentId}`} uuid={e.deploymentFailed.deployment.deploymentId} />
                ) : undefined
              }
            />
            <NutritionFact
              label="Deployment Version"
              renderWhenEmpty="-"
              value={e.deploymentFailed.deployment?.version ? <UUID canCopy uuid={e.deploymentFailed.deployment.version} /> : undefined}
            />
          </>
        ))
        .otherwise(() => null)}
    </div>
  );
}

export function Stack() {
  const { stackId } = useParams();
  const { data, isLoading, error } = useStack({ stackId });
  useErrorHandler(error, 'Failed to load stack');

  const { sortValues, setSortValues, filterValues, setFilterValues, psmQuery } = useTableState();
  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListStackEvents({ stackId, query: psmQuery });
  useErrorHandler(eventsError, 'Failed to load stack events');
  const flattenedEvents = useMemo(() => {
    if (!eventsData?.pages) {
      return [];
    }

    return eventsData.pages.reduce((acc, page) => {
      if (page?.events) {
        return [...acc, ...page.events];
      }

      return acc;
    }, [] as O5AwsDeployerV1StackEvent[]);
  }, [eventsData?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Stack: {stackId ? <UUID canCopy uuid={stackId} /> : <Skeleton />}</h1>
        {stackId && <UpsertStackDialog stackId={stackId} />}
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact isLoading={isLoading} label="Application Name" renderWhenEmpty="-" value={data?.state?.applicationName} />

            <NutritionFact
              isLoading={isLoading}
              label="Environment"
              renderWhenEmpty="-"
              value={
                data?.state?.environmentId ? (
                  <Link to={`/environment/${data.state.environmentId}`}>{data?.state?.environmentName || data?.state?.environmentId}</Link>
                ) : (
                  data?.state?.environmentName
                )
              }
            />

            {buildCodeSourceFact(data?.state?.config?.codeSource, isLoading)}

            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={data?.state?.status ? stackStatusLabels[data.state.status] : undefined}
            />

            <NutritionFact
              isLoading={isLoading}
              label="Current Deployment"
              renderWhenEmpty="-"
              value={
                data?.state?.currentDeployment?.deploymentId ? (
                  <UUID short to={`/deployment/${data.state.currentDeployment.deploymentId}`} uuid={data.state.currentDeployment.deploymentId} />
                ) : undefined
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Current Deployment Version"
              renderWhenEmpty="-"
              value={data?.state?.currentDeployment?.version ? <UUID short uuid={data.state.currentDeployment.version} /> : undefined}
            />

            <NutritionFact
              isLoading={isLoading}
              label="Queued Deployments"
              renderWhenEmpty="-"
              value={data?.state?.queuedDeployments?.map((d, i) => (
                <React.Fragment key={d.deploymentId}>
                  <UUID short to={`/deployment/${d.deploymentId}`} uuid={d.deploymentId} />
                  {i !== (data?.state?.queuedDeployments?.length ?? 0) - 1 && <br />}
                </React.Fragment>
              ))}
            />
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
              // onColumnSort={setSortValues}
              onFilter={setFilterValues}
              pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
              renderSubComponent={renderSubRow}
              showSkeleton={Boolean(eventsData === undefined || eventsAreLoading || eventsError)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
