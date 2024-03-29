import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDeployment, useListDeploymentEvents } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import {
  DeploymentEventType,
  deploymentEventTypeLabels,
  deploymentStepOutputTypeLabels,
  deploymentStepStatusLabels,
  getDeploymentEventType,
  getDeploymentStepOutputType,
  O5DeployerV1DeploymentEvent,
  O5DeployerV1DeploymentStatus,
} from '@/data/types';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { match, P } from 'ts-pattern';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { buildDeploymentSpecFacts, buildDeploymentStepFacts } from '@/pages/deployment/build-facts.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { TableRowType } from '@/components/data-table/body.tsx';

const eventColumns: CustomColumnDef<O5DeployerV1DeploymentEvent>[] = [
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
    minSize: 120,
    maxSize: 150,
    accessorFn: (row) => {
      const type = getDeploymentEventType(row);
      return row.event ? deploymentEventTypeLabels[type] : '';
    },
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.values(DeploymentEventType).map((value) => ({ label: deploymentEventTypeLabels[value], value })),
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

function renderSubRow({ row }: TableRowType<O5DeployerV1DeploymentEvent>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ created: P.not(P.nullish) }, (e) => buildDeploymentSpecFacts(e.created.spec))
        .with({ error: P.not(P.nullish) }, (e) => <NutritionFact renderWhenEmpty="-" label="Error" value={e.error?.error} />)
        .with({ stackAvailable: P.not(P.nullish) }, (e) => buildCFStackOutput(e.stackAvailable.stackOutput))
        .with({ stackWaitFailure: P.not(P.nullish) }, (e) => <NutritionFact renderWhenEmpty="-" label="Error" value={e.stackWaitFailure.error} />)
        .with({ stepResult: P.not(P.nullish) }, (e) => (
          <>
            <div className="grid grid-cols-3 gap-2">
              <NutritionFact renderWhenEmpty="-" label="Step ID" value={<UUID canCopy short uuid={e.stepResult.stepId} />} />
              <NutritionFact renderWhenEmpty="-" label="Status" value={deploymentStepStatusLabels[e.stepResult.status!]} />
              <NutritionFact renderWhenEmpty="-" label="Error" value={e.stepResult.error} />
            </div>

            {e.stepResult.output && (
              <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-start gap-1" type="button">
                    <CaretDownIcon />
                    <h4 className="text-lg">Output</h4>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <h5>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(e.stepResult.output)]}</h5>

                  {match(e.stepResult.output?.type)
                    .with({ cfStatus: P.not(P.nullish) }, (o) => buildCFStackOutput(o.cfStatus.output))
                    .otherwise(() => null)}
                </CollapsibleContent>
              </Collapsible>
            )}
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
  const { data, error } = useDeployment({ deploymentId });
  useErrorHandler(error, 'Failed to load deployment');

  const eventTableState = useTableState();
  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListDeploymentEvents({ deploymentId, query: eventTableState.psmQuery });
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

      <div className="flex-grow h-fit flex flex-col gap-4">
        <Card className="flex-grow h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="flex flex-col gap-2">
            {buildDeploymentSpecFacts(data?.state?.spec)}
            {buildDeploymentStepFacts(data?.state?.steps)}
          </CardContent>
        </Card>

        <Card className="flex-grow h-fit">
          <CardHeader className="text-lg font-semibold">Events</CardHeader>
          <CardContent>
            <DataTable
              getRowCanExpand
              columns={eventColumns}
              controlledColumnSort={eventTableState.sortValues}
              data={flattenedEvents}
              filterValues={eventTableState.filterValues}
              onColumnSort={eventTableState.setSortValues}
              onFilter={eventTableState.setFilterValues}
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
