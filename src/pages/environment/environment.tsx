import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { match, P } from 'ts-pattern';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { UpsertEnvironmentDialog } from '@/pages/environment/upsert-environment-dialog/upsert-environment-dialog.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { TableRowType } from '@/components/data-table/body.tsx';
import {
  getOneOfType,
  O5AwsDeployerV1EnvironmentEvent,
  O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsRequest,
  O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsSortableFields,
} from '@/data/types';
import {
  useO5AwsDeployerV1EnvironmentQueryServiceGetEnvironment,
  useO5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEvents,
} from '@/data/api/hooks/generated';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { EnvironmentSpec } from '@/pages/environment/spec/environment-spec.tsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { J5EventMetadata } from '@/components/j5/j5-event-metadata.tsx';
import { J5StateMetadata } from '@/components/j5/j5-state-metadata.tsx';
import { extendColumnsWithPSMFeatures } from '@/components/data-table/util.ts';
import { getO5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsSearchFields } from '@/data/table-config/generated';

function getEventColumns(t: TFunction): CustomColumnDef<O5AwsDeployerV1EnvironmentEvent>[] {
  return extendColumnsWithPSMFeatures<O5AwsDeployerV1EnvironmentEvent, O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsRequest['query']>(
    [
      getRowExpander(),
      {
        header: 'ID',
        id: 'metadata.eventId',
        accessorFn: (row) => row.metadata?.eventId,
        size: 110,
        minSize: 110,
        maxSize: 110,
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return value ? <UUID canCopy short uuid={value} /> : null;
        },
      },
      {
        header: 'Type',
        id: 'event',
        size: 120,
        minSize: 100,
        maxSize: 150,
        accessorFn: (row) => {
          const eventType = getOneOfType(row.event);
          return eventType ? t(`awsDeployer:oneOf.O5AwsDeployerV1EnvironmentEventType.${eventType}`) : null;
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
    Object.values(O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsSortableFields),
  );
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1EnvironmentEvent>) {
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
        .with({ configured: P.not(P.nullish) }, (e) => {
          return <EnvironmentSpec vertical heading="Config" spec={e.configured.config} />;
        })
        .otherwise(() => null)}
    </div>
  );
}

export function Environment() {
  const { environmentId } = useParams();
  const { t } = useTranslation('awsDeployer');
  const { data, error, isLoading } = useO5AwsDeployerV1EnvironmentQueryServiceGetEnvironment(environmentId ? { environmentId } : undefined);
  useErrorHandler(error, 'Failed to load environment');

  const searchableFields = useMemo(() => getO5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsSearchFields(t), [t]);
  const initialSearchFields = useMemo(() => searchableFields.map((field) => field.id), [searchableFields]);
  const { sortValues, setSortValues, filterValues, setFilterValues, searchValue, setSearchValue, searchFields, setSearchFields, psmQuery } =
    useTableState<O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEventsRequest['query']>({ initialSearchFields });
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsAreLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useO5AwsDeployerV1EnvironmentQueryServiceListEnvironmentEvents(environmentId ? { environmentId, query: psmQuery } : undefined);
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
    }, [] as O5AwsDeployerV1EnvironmentEvent[]);
  }, [eventsData?.pages]);

  const eventColumns = useMemo(() => getEventColumns(t), [t]);

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
            <J5StateMetadata vertical isLoading={isLoading} metadata={data?.state?.metadata} heading="Metadata" />

            <NutritionFact
              isLoading={isLoading}
              label="Status"
              renderWhenEmpty="-"
              value={
                data?.state?.status ? (
                  <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1EnvironmentStatus.${data.state.status}`} />
                ) : undefined
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Cluster ID"
              value={data?.state?.clusterId ? <UUID canCopy short uuid={data.state.clusterId} /> : undefined}
            />
          </CardContent>
        </Card>

        <div className="flex-grow h-fit basis-5/6 flex flex-col gap-4">
          <Card className="flex-grow h-fit">
            <CardHeader className="text-lg font-semibold">Config</CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <EnvironmentSpec vertical isLoading={isLoading} spec={data?.state?.data?.config} />
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
                searchFields={searchableFields}
                searchFieldSelections={searchFields}
                onSearch={setSearchValue}
                searchValue={searchValue}
                onSearchFieldChange={setSearchFields}
                showSkeleton={Boolean(flattenedEvents === undefined || eventsAreLoading || eventsError)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
