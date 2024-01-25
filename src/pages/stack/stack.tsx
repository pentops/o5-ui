import React from 'react';
import { useStack } from '@/data/api';
import { useParams } from 'react-router-dom';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getStackEventType, O5DeployerV1StackEvent, stackEventTypeLabels, stackStatusLabels } from '@/data/types';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { match, P } from 'ts-pattern';

const eventColumns: ColumnDef<O5DeployerV1StackEvent>[] = [
  getRowExpander(),
  {
    header: 'ID',
    accessorFn: (row) => row.metadata?.eventId,
    cell: ({ getValue }) => {
      return <UUID canCopy short uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Type',
    accessorFn: (row) => {
      const type = getStackEventType(row);
      return row.event ? stackEventTypeLabels[type] : '';
    },
  },
  {
    header: 'Timestamp',
    accessorFn: (row) => row.metadata?.timestamp,
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
  },
];

function renderSubRow({ row }: TableRow<O5DeployerV1StackEvent>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ triggered: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Application Name" renderWhenEmpty="-" value={e.triggered.applicationName} />
            <NutritionFact label="Environment Name" renderWhenEmpty="-" value={e.triggered.applicationName} />
            <NutritionFact
              label="Deployment"
              renderWhenEmpty="-"
              value={
                e.triggered.deployment?.deploymentId ? (
                  <UUID to={`/deployment/${e.triggered.deployment.deploymentId}`} uuid={e.triggered.deployment.deploymentId} />
                ) : undefined
              }
            />
            <NutritionFact label="Deployment Version" renderWhenEmpty="-" value={e.triggered.deployment?.version} />
          </>
        ))
        .with({ deploymentCompleted: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact
              label="Deployment"
              renderWhenEmpty="-"
              value={
                e.deploymentCompleted.deployment?.deploymentId ? (
                  <UUID to={`/deployment/${e.deploymentCompleted.deployment.deploymentId}`} uuid={e.deploymentCompleted.deployment.deploymentId} />
                ) : undefined
              }
            />
            <NutritionFact label="Deployment Version" renderWhenEmpty="-" value={e.deploymentCompleted.deployment?.version} />
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
            <NutritionFact label="Deployment Version" renderWhenEmpty="-" value={e.deploymentFailed.deployment?.version} />
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

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Stack: {stackId ? <UUID uuid={stackId} /> : <Skeleton />}</h1>
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact isLoading={isLoading} label="Application Name" renderWhenEmpty="-" value={data?.state?.applicationName} />
            <NutritionFact isLoading={isLoading} label="Environment Name" renderWhenEmpty="-" value={data?.state?.environmentName} />
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
              value={data?.state?.queuedDeployments?.map((d) => (
                <UUID short key={d.deploymentId} to={`/deployment/${d.deploymentId}`} uuid={d.deploymentId} />
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
              data={data?.events || []}
              renderSubComponent={renderSubRow}
              showSkeleton={Boolean(data === undefined || isLoading || error)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
