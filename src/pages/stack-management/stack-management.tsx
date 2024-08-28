import React, { useMemo } from 'react';
import { RocketIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '@/lib/error.ts';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { UpsertStackDialog } from '@/pages/stack/upsert-stack-dialog/upsert-stack-dialog.tsx';
import { TableRowType } from '@/components/data-table/body.tsx';
import { O5AwsDeployerV1StackQueryServiceListStacksRequest, O5AwsDeployerV1StackState } from '@/data/types';
import { useO5AwsDeployerV1StackQueryServiceListStacks } from '@/data/api/hooks/generated';
import { getO5AwsDeployerV1StackQueryServiceListStacksSearchFields } from '@/data/table-config/generated';

function getColumns(t: TFunction): CustomColumnDef<O5AwsDeployerV1StackState>[] {
  return [
    getRowExpander(),
    {
      header: 'ID',
      accessorKey: 'stackId',
      id: 'stackId',
      size: 110,
      minSize: 110,
      maxSize: 110,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short to={`/stack/${value}`} uuid={value} /> : null;
      },
    },
    {
      header: 'Name',
      id: 'data.stackName',
      accessorKey: 'data.stackName',
      size: 120,
      minSize: 120,
      maxSize: 140,
    },
    {
      header: 'App',
      id: 'data.applicationName',
      accessorKey: 'data.applicationName',
      size: 120,
      minSize: 120,
      maxSize: 140,
    },
    {
      header: 'Environment',
      id: 'data.environmentName',
      accessorKey: 'data.environmentName',
      size: 120,
      minSize: 120,
      maxSize: 140,
      cell: ({ getValue, row }) => {
        const value = getValue<string>();
        return value && row.original.environmentId ? <Link to={`/environment/${row.original.environmentId}`}>{value}</Link> : value;
      },
    },
    {
      header: 'Status',
      id: 'status',
      accessorFn: (row) => (row.status ? t(`awsDeployer:enum.O5AwsDeployerV1StackStatus.${row.status}`) : ''),
      size: 120,
      minSize: 120,
      maxSize: 150,
      // filter: {
      //   type: {
      //     select: {
      //       isMultiple: true,
      //       options: Object.entries(stackStatusLabels).map(([value, label]) => ({ value, label })),
      //     },
      //   },
      // },
    },
    {
      header: 'Current Deployment',
      id: 'data.currentDeployment.deploymentId',
      size: 150,
      minSize: 150,
      maxSize: 200,
      accessorFn: (row) => row.data?.currentDeployment?.deploymentId,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
      },
    },
    {
      header: 'Current Deployment Version',
      id: 'data.currentDeployment.version',
      size: 200,
      minSize: 200,
      maxSize: 200,
      accessorFn: (row) => row.data?.currentDeployment?.version,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
      },
    },
    {
      header: 'Queued Deployments',
      id: 'data.queuedDeployments.deploymentId',
      minSize: 160,
      size: 160,
      align: 'right',
      accessorFn: (row) => row.data?.queuedDeployments?.map((d) => d.deploymentId || '-'),
      cell: ({ row }) =>
        row.original.data?.queuedDeployments?.map((d, i) => (
          <div key={d.deploymentId}>
            <UUID canCopy short to={`/deployment/${d.deploymentId}`} uuid={d.deploymentId} />
            {i !== (row.original.data?.queuedDeployments?.length || 0) - 1 && ', '}
          </div>
        )),
    },
  ];
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1StackState>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact
        label="Environment ID"
        renderWhenEmpty="-"
        value={
          row.original.environmentId ? (
            <UUID canCopy short to={`/environment/${row.original.environmentId}`} uuid={row.original.environmentId} />
          ) : undefined
        }
      />

      {/*{buildCodeSourceFact(row.original.config?.codeSource)}*/}
    </div>
  );
}

export function StackManagement() {
  const { t } = useTranslation('awsDeployer');
  const columns = useMemo(() => getColumns(t), [t]);
  const searchableFields = useMemo(() => getO5AwsDeployerV1StackQueryServiceListStacksSearchFields(t), [t]);
  const initialSearchFields = useMemo(() => searchableFields.map((field) => field.id), [searchableFields]);
  const { sortValues, setSortValues, setFilterValues, filterValues, searchValue, setSearchValue, searchFields, setSearchFields, psmQuery } =
    useTableState<O5AwsDeployerV1StackQueryServiceListStacksRequest['query']>({ initialSearchFields });
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useO5AwsDeployerV1StackQueryServiceListStacks({
    query: psmQuery,
  });
  useErrorHandler(error, 'Failed to load stacks');

  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.stacks) {
        return [...acc, ...page.stacks];
      }

      return acc;
    }, [] as O5AwsDeployerV1StackState[]);
  }, [data?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Stack Management</h1>
        <UpsertStackDialog activator={<RocketIcon aria-hidden />} />
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        controlledColumnSort={sortValues}
        data={flatData}
        filterValues={filterValues}
        onSearch={setSearchValue}
        onSearchFieldChange={setSearchFields}
        onColumnSort={setSortValues}
        onFilter={setFilterValues}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        renderSubComponent={renderSubRow}
        searchValue={searchValue}
        searchFields={searchableFields}
        searchFieldSelections={searchFields}
        showSkeleton={Boolean(data === undefined || isLoading || error)}
      />
    </div>
  );
}
