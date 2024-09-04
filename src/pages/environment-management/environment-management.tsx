import React, { useMemo } from 'react';
import { TFunction } from 'i18next';
import { useErrorHandler } from '@/lib/error.ts';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { UpsertEnvironmentDialog } from '@/pages/environment/upsert-environment-dialog/upsert-environment-dialog.tsx';
import { RocketIcon } from '@radix-ui/react-icons';
import { TableRowType } from '@/components/data-table/body.tsx';
import { O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsRequest, O5AwsDeployerV1EnvironmentState } from '@/data/types';
import { useO5AwsDeployerV1EnvironmentQueryServiceListEnvironments } from '@/data/api/hooks/generated';
import { useTranslation } from 'react-i18next';
import { getO5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsSearchFields } from '@/data/table-config/generated';
import { EnvironmentSpec } from '@/pages/environment/spec/environment-spec.tsx';
import { J5StateMetadata } from '@/components/j5/j5-state-metadata.tsx';

function getColumns(t: TFunction): CustomColumnDef<O5AwsDeployerV1EnvironmentState>[] {
  return [
    getRowExpander(),
    {
      header: 'ID',
      id: 'environmentId',
      accessorKey: 'environmentId',
      size: 110,
      minSize: 110,
      maxSize: 110,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short to={`/environment/${value}`} uuid={value} /> : null;
      },
    },
    {
      header: 'Full Name',
      id: 'data.config.fullName',
      size: 150,
      minSize: 150,
      accessorFn: (row) => row.data?.config?.fullName,
    },
    {
      header: 'Cluster ID',
      id: 'clusterId',
      accessorKey: 'clusterId',
      size: 110,
      minSize: 110,
      maxSize: 110,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short uuid={value} /> : null;
      },
    },
    {
      header: 'Status',
      align: 'right',
      id: 'status',
      size: 120,
      minSize: 120,
      maxSize: 150,
      accessorFn: (row) => (row.status ? t(`awsDeployer:enum.O5AwsDeployerV1EnvironmentStatus.${row.status}`) : ''),
    },
  ];
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1EnvironmentState>) {
  return (
    <div className="flex flex-col gap-4">
      <J5StateMetadata vertical heading="Metadata" metadata={row.original.metadata} />

      <EnvironmentSpec vertical heading="Config" spec={row.original.data?.config} />
    </div>
  );
}

export function EnvironmentManagement() {
  const { t } = useTranslation('awsDeployer');
  const columns = useMemo(() => getColumns(t), [t]);
  const searchableFields = useMemo(() => getO5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsSearchFields(t), [t]);
  const initialSearchFields = useMemo(() => searchableFields.map((field) => field.id), [searchableFields]);
  const { sortValues, setSortValues, psmQuery, setFilterValues, filterValues, searchValue, setSearchValue, searchFields, setSearchFields } =
    useTableState<O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsRequest['query']>({ initialSearchFields });
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useO5AwsDeployerV1EnvironmentQueryServiceListEnvironments({
    query: psmQuery,
  });
  useErrorHandler(error, 'Failed to load environments');

  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.environments) {
        return [...acc, ...page.environments];
      }

      return acc;
    }, [] as O5AwsDeployerV1EnvironmentState[]);
  }, [data?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Environment Management</h1>
        <UpsertEnvironmentDialog activator={<RocketIcon aria-hidden />} />
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        controlledColumnSort={sortValues}
        data={flatData}
        filterValues={filterValues}
        onColumnSort={setSortValues}
        onFilter={setFilterValues}
        onSearch={setSearchValue}
        onSearchFieldChange={setSearchFields}
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
