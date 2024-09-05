import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import {
  getOneOfType,
  O5AwsDeployerV1DeploymentEvent,
  O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsFilterableFields,
  O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsRequest,
  O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsSortableFields,
  O5AwsDeployerV1DeploymentStatus,
} from '@/data/types';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { match, P } from 'ts-pattern';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { buildDeploymentSpecFacts, buildDeploymentStepFacts } from '@/pages/deployment/build-facts.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { TableRowType } from '@/components/data-table/body.tsx';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import {
  useO5AwsDeployerV1DeploymentQueryServiceGetDeployment,
  useO5AwsDeployerV1DeploymentQueryServiceListDeploymentEvents,
} from '@/data/api/hooks/generated';
import { StackOutput } from '@/pages/stack/stack-output.tsx';
import { StepOutput } from '@/pages/deployment/step/step-output.tsx';
import { DeploymentSpec } from '@/pages/deployment/spec/deployment-spec.tsx';
import { DeploymentStep } from '@/pages/deployment/step/deployment-step.tsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { J5EventMetadata } from '@/components/j5/j5-event-metadata.tsx';
import { TFunction } from 'i18next';
import { extendColumnsWithPSMFeatures } from '@/components/data-table/util.ts';
import { useTranslation } from 'react-i18next';
import {
  getO5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsFilters,
  O5_AWS_DEPLOYER_V1_DEPLOYMENT_QUERY_SERVICE_LIST_DEPLOYMENT_EVENTS_DEFAULT_SORTS,
} from '@/data/table-config/generated';
import { BaseTableFilter } from '@pentops/react-table-state-psm';

function getEventColumns(
  t: TFunction,
  filters: BaseTableFilter<O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsFilterableFields>[],
): CustomColumnDef<O5AwsDeployerV1DeploymentEvent>[] {
  return extendColumnsWithPSMFeatures<O5AwsDeployerV1DeploymentEvent, O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsRequest['query']>(
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
          const value = getValue<string>();
          return value ? <UUID canCopy short uuid={value} /> : null;
        },
      },
      {
        header: 'Type',
        id: 'event',
        size: 120,
        minSize: 120,
        maxSize: 150,
        accessorFn: (row) => {
          const eventType = getOneOfType(row.event);
          return eventType ? t(`awsDeployer:oneOf.O5AwsDeployerV1DeploymentEventType.${eventType}`) : '';
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
    filters,
    Object.values(O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsSortableFields),
  );
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1DeploymentEvent>) {
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
        .with({ created: P.not(P.nullish) }, (e) => (
          <>
            <DeploymentSpec heading="Spec" spec={e.created.spec} />

            {e.created.request && (
              <>
                <span>Request</span>
                <NutritionFact vertical label="Context" value={e.created.request?.context} />
                <NutritionFact vertical label="Reply To" value={e.created.request?.replyTo} />
              </>
            )}
          </>
        ))
        .with({ triggered: P.not(P.nullish) }, () => null)
        .with({ stackWait: P.not(P.nullish) }, () => null)
        .with({ stackWaitFailure: P.not(P.nullish) }, (e) => <NutritionFact vertical label="Error" value={e.stackWaitFailure.error} />)
        .with({ stackAvailable: P.not(P.nullish) }, (e) => <StackOutput output={e.stackAvailable.stackOutput} />)
        .with({ runSteps: P.not(P.nullish) }, (e) => e.runSteps.steps?.map((step, index) => <DeploymentStep key={step.id || index} step={step} />))
        .with({ stepResult: P.not(P.nullish) }, (e) => (
          <>
            <div className="grid grid-cols-2 gap-2">
              <NutritionFact
                vertical
                renderWhenEmpty="-"
                label="Step ID"
                value={e.stepResult.stepId ? <UUID canCopy short uuid={e.stepResult.stepId} /> : undefined}
              />

              <NutritionFact
                vertical
                renderWhenEmpty="-"
                label="Status"
                value={
                  e.stepResult.status ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1StepStatus.${e.stepResult.status}`} /> : undefined
                }
              />
            </div>

            <NutritionFact vertical renderWhenEmpty="-" label="Error" value={e.stepResult.error} />

            <StepOutput vertical output={e.stepResult.output} />
          </>
        ))
        .with({ runStep: P.not(P.nullish) }, (e) => (
          <NutritionFact
            vertical
            renderWhenEmpty="-"
            label="Step ID"
            value={e.runStep.stepId ? <UUID canCopy short uuid={e.runStep.stepId} /> : undefined}
          />
        ))
        .with({ error: P.not(P.nullish) }, (e) => <NutritionFact vertical renderWhenEmpty="-" label="Error" value={e.error.error} />)
        .with({ done: P.not(P.nullish) }, () => null)
        .with({ terminated: P.not(P.nullish) }, () => null)
        .otherwise(() => null)}
    </div>
  );
}

function canTerminateDeployment(status: O5AwsDeployerV1DeploymentStatus | undefined) {
  if (!status) {
    return false;
  }

  return ![O5AwsDeployerV1DeploymentStatus.Done, O5AwsDeployerV1DeploymentStatus.Failed, O5AwsDeployerV1DeploymentStatus.Terminated].includes(status);
}

export function Deployment() {
  const { deploymentId } = useParams();
  const { t } = useTranslation('awsDeployer');
  const filters = useMemo(() => getO5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsFilters(t), [t]);
  const { data, error, isPending } = useO5AwsDeployerV1DeploymentQueryServiceGetDeployment(deploymentId ? { deploymentId } : undefined);
  useErrorHandler(error, 'Failed to load deployment');

  const eventTableState = useTableState<O5AwsDeployerV1DeploymentQueryServiceListDeploymentEventsRequest['query']>({
    initialSort: O5_AWS_DEPLOYER_V1_DEPLOYMENT_QUERY_SERVICE_LIST_DEPLOYMENT_EVENTS_DEFAULT_SORTS,
    filterFields: filters,
  });

  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useO5AwsDeployerV1DeploymentQueryServiceListDeploymentEvents(deploymentId ? { deploymentId, query: eventTableState.psmQuery } : undefined);
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
    }, [] as O5AwsDeployerV1DeploymentEvent[]);
  }, [eventsData?.pages]);
  const eventColumns = useMemo(() => getEventColumns(t, filters), [t, filters]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Deployment: {deploymentId ? <UUID canCopy uuid={deploymentId} /> : <Skeleton />}</h1>
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
            <NutritionFact
              isLoading={isPending}
              renderWhenEmpty="-"
              label="Stack"
              value={
                data?.state?.stackId ? (
                  <Link to={`/stack/${data.state.stackId}`}>{data?.state?.data?.spec?.cfStackName || data.state.stackId}</Link>
                ) : (
                  data?.state?.data?.spec?.cfStackName
                )
              }
            />
            <NutritionFact
              isLoading={isPending}
              renderWhenEmpty="-"
              label="Status"
              value={
                data?.state?.status ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1DeploymentStatus.${data.state.status}`} /> : undefined
              }
            />
            <NutritionFact
              isLoading={isPending}
              renderWhenEmpty="-"
              label="Created At"
              value={data?.state?.metadata?.createdAt ? <DateFormat value={data.state.metadata.createdAt} /> : undefined}
            />
          </CardContent>

          <CardContent className="flex flex-col gap-2">
            {buildDeploymentSpecFacts(data?.state?.data?.spec, [], isPending)}
            {buildDeploymentStepFacts(data?.state?.data?.steps)}
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
