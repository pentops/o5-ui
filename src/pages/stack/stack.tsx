import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { match, P } from 'ts-pattern';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import {
  getOneOfType,
  O5AwsDeployerV1StackEvent,
  O5AwsDeployerV1StackQueryServiceListStackEventsRequest,
  O5AwsDeployerV1StackQueryServiceListStackEventsSortableFields,
} from '@/data/types';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UpsertStackDialog } from '@/pages/stack/upsert-stack-dialog/upsert-stack-dialog.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { TableRowType } from '@/components/data-table/body.tsx';
import { TFunction } from 'i18next';
import { useO5AwsDeployerV1StackQueryServiceGetStack, useO5AwsDeployerV1StackQueryServiceListStackEvents } from '@/data/api/hooks/generated';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { useTranslation } from 'react-i18next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { J5EventMetadata } from '@/components/j5/j5-event-metadata.tsx';
import { O5_AWS_DEPLOYER_V1_STACK_QUERY_SERVICE_LIST_STACK_EVENTS_DEFAULT_SORTS } from '@/data/table-config/generated';
import { extendColumnsWithPSMFeatures } from '@/components/data-table/util.ts';

function getEventColumns(t: TFunction): CustomColumnDef<O5AwsDeployerV1StackEvent>[] {
  return extendColumnsWithPSMFeatures<O5AwsDeployerV1StackEvent, O5AwsDeployerV1StackQueryServiceListStackEventsRequest['query']>(
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
        size: 175,
        minSize: 175,
        maxSize: 175,
        accessorFn: (row) => {
          const eventType = getOneOfType(row.event);
          return eventType ? t(`awsDeployer:oneOf.O5AwsDeployerV1StackEventType.${eventType}`) : '';
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
    Object.values(O5AwsDeployerV1StackQueryServiceListStackEventsSortableFields),
  );
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1StackEvent>) {
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
              label="Deployment ID"
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
            <NutritionFact label="Deployment Version" renderWhenEmpty="-" value={e.deploymentCompleted.deployment?.version} />
          </>
        ))
        .with({ deploymentFailed: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Error" renderWhenEmpty="-" value={e.deploymentFailed.error} />
            <NutritionFact
              label="Deployment ID"
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
        .with({ deploymentRequested: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Application Name" renderWhenEmpty="-" value={e.deploymentRequested.applicationName} />
            <NutritionFact
              label="Environment"
              renderWhenEmpty="-"
              value={
                e.deploymentRequested.environmentName ? (
                  e.deploymentRequested.environmentId ? (
                    <span>
                      <Link to={`/environment/${e.deploymentRequested.environmentId}`}>{e.deploymentRequested.environmentName}</Link> (
                      <UUID canCopy to={`/environment/${e.deploymentRequested.environmentId}`} uuid={e.deploymentRequested.environmentId} />)
                    </span>
                  ) : (
                    e.deploymentRequested.environmentName
                  )
                ) : e.deploymentRequested.environmentId ? (
                  <UUID canCopy to={`/environment/${e.deploymentRequested.environmentId}`} uuid={e.deploymentRequested.environmentId} />
                ) : undefined
              }
            />

            <NutritionFact
              label="Deployment ID"
              renderWhenEmpty="-"
              value={
                e.deploymentRequested.deployment?.deploymentId ? (
                  <UUID to={`/deployment/${e.deploymentRequested.deployment.deploymentId}`} uuid={e.deploymentRequested.deployment.deploymentId} />
                ) : undefined
              }
            />
            <NutritionFact label="Deployment Version" renderWhenEmpty="-" value={e.deploymentRequested.deployment?.version} />
          </>
        ))
        .with({ runDeployment: P.not(P.nullish) }, (e) => (
          <NutritionFact
            label="Deployment ID"
            renderWhenEmpty="-"
            value={
              e.runDeployment.deploymentId ? (
                <UUID to={`/deployment/${e.runDeployment.deploymentId}`} uuid={e.runDeployment.deploymentId} />
              ) : undefined
            }
          />
        ))
        .otherwise(() => null)}
    </div>
  );
}

export function Stack() {
  const { stackId } = useParams();
  const { t } = useTranslation('awsDeployer');
  const eventColumns = useMemo(() => getEventColumns(t), [t]);
  const { data, isLoading, error } = useO5AwsDeployerV1StackQueryServiceGetStack(stackId ? { stackId } : undefined);
  useErrorHandler(error, 'Failed to load stack');

  const { sortValues, filterValues, setFilterValues, setSortValues, psmQuery } = useTableState<
    O5AwsDeployerV1StackQueryServiceListStackEventsRequest['query']
  >({
    initialSort: O5_AWS_DEPLOYER_V1_STACK_QUERY_SERVICE_LIST_STACK_EVENTS_DEFAULT_SORTS,
  });
  const {
    data: eventsData,
    isLoading: eventsAreLoading,
    error: eventsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useO5AwsDeployerV1StackQueryServiceListStackEvents(stackId ? { stackId, query: psmQuery } : undefined);
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
            <NutritionFact isLoading={isLoading} label="Application Name" renderWhenEmpty="-" value={data?.state?.data?.applicationName} />

            <NutritionFact
              isLoading={isLoading}
              label="Environment"
              renderWhenEmpty="-"
              value={
                data?.state?.environmentId ? (
                  <Link to={`/environment/${data.state.environmentId}`}>{data?.state?.data?.environmentName || data?.state?.environmentId}</Link>
                ) : (
                  data?.state?.data?.environmentName
                )
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={
                data?.state?.status ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1StackStatus.${data.state.status}`} /> : undefined
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Current Deployment"
              renderWhenEmpty="-"
              value={
                data?.state?.data?.currentDeployment?.deploymentId ? (
                  <UUID
                    short
                    to={`/deployment/${data.state.data.currentDeployment.deploymentId}`}
                    uuid={data.state.data.currentDeployment.deploymentId}
                  />
                ) : undefined
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Current Deployment Version"
              renderWhenEmpty="-"
              value={data?.state?.data?.currentDeployment?.version ? <UUID short uuid={data.state.data.currentDeployment.version} /> : undefined}
            />

            <NutritionFact
              isLoading={isLoading}
              label="Queued Deployments"
              renderWhenEmpty="-"
              value={data?.state?.data?.queuedDeployments?.map((d, i) => (
                <React.Fragment key={d.deploymentId}>
                  <UUID short to={`/deployment/${d.deploymentId}`} uuid={d.deploymentId} />
                  {i !== (data?.state?.data?.queuedDeployments?.length ?? 0) - 1 && <br />}
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
  );
}
