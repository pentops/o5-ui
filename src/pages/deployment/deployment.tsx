import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDeployment, useListDeploymentEvents } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import {
  deploymentEventTypeLabels,
  deploymentStepOutputTypeLabels,
  deploymentStepStatusLabels,
  getDeploymentEventType,
  getDeploymentStepOutputType,
  O5DeployerV1DeploymentEvent,
  O5DeployerV1DeploymentStatus,
} from '@/data/types';
import { ColumnDef } from '@tanstack/react-table';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { match, P } from 'ts-pattern';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { buildDeploymentSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';

const eventColumns: ColumnDef<O5DeployerV1DeploymentEvent>[] = [
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
      const type = getDeploymentEventType(row);
      return row.event ? deploymentEventTypeLabels[type] : '';
    },
  },
  {
    header: 'Timestamp',
    id: 'metadata.timestamp',
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
  },
];

function renderSubRow({ row }: TableRow<O5DeployerV1DeploymentEvent>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ created: P.not(P.nullish) }, (e) => buildDeploymentSpecFacts(e.created.spec))
        .with({ error: P.not(P.nullish) }, (e) => <NutritionFact label="Error" value={e.error?.error} />)
        .with({ stackAvailable: P.not(P.nullish) }, (e) => buildCFStackOutput(e.stackAvailable.stackOutput))
        .with({ stackWaitFailure: P.not(P.nullish) }, (e) => <NutritionFact label="Error" value={e.stackWaitFailure.error} />)
        .with({ stepResult: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Step ID" value={<UUID short uuid={e.stepResult.stepId} />} />
            <NutritionFact label="Status" value={deploymentStepStatusLabels[e.stepResult.status!]} />
            <NutritionFact label="Error" value={e.stepResult.error} />

            <h4>Output</h4>

            <h5>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(e.stepResult.output)]}</h5>

            {match(e.stepResult.output?.type)
              .with({ cfStatus: P.not(P.nullish) }, (o) => buildCFStackOutput(o.cfStatus.output))
              .otherwise(() => null)}
          </>
        ))
        .otherwise(() => null)}
    </div>
  );
}

function canTerminateDeployment(status: O5DeployerV1DeploymentStatus | undefined) {
  if (!status) {
    return false;
  }

  return ![O5DeployerV1DeploymentStatus.Done, O5DeployerV1DeploymentStatus.Failed, O5DeployerV1DeploymentStatus.Terminated].includes(status);
}

export function Deployment() {
  const { deploymentId } = useParams();
  const { data, isLoading, error } = useDeployment({ deploymentId });
  useErrorHandler(error, 'Failed to load deployment');
  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListDeploymentEvents({ deploymentId });
  useErrorHandler(eventsError, 'Failed to load deployment events');
  const flattenedEvents = useMemo(() => {
    if (!eventsData?.pages) {
      return [];
    }

    return eventsData.pages.reduce((acc, page) => {
      if (page?.events) {
        return [...acc, ...page.events];
      }

      return acc;
    }, [] as O5DeployerV1DeploymentEvent[]);
  }, [eventsData?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Deployment: {deploymentId ? <UUID uuid={deploymentId} /> : <Skeleton />}</h1>
        {deploymentId && (
          <div className="flex items-center justify-end gap-2">
            <TriggerDeploymentDialog deploymentId={deploymentId} />
            {canTerminateDeployment(data?.state?.status) && <ConfirmTerminateDeploymentAlert deploymentId={deploymentId} />}
          </div>
        )}
      </div>

      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact
              isLoading={isLoading}
              label="Stack"
              renderWhenEmpty="-"
              value={data?.state?.stackName ? <Link to={`/stack/${data.state.stackId}`}>{data.state.stackName}</Link> : undefined}
            />
          </CardContent>
        </Card>

        <Card className="flex-grow h-fit basis-5/6">
          <CardHeader className="text-lg font-semibold">Events</CardHeader>
          <CardContent>
            <DataTable
              getRowCanExpand
              columns={eventColumns}
              data={flattenedEvents}
              pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
              renderSubComponent={renderSubRow}
              showSkeleton={Boolean(flattenedEvents === undefined || eventsAreLoading || error)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
