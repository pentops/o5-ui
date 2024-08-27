import React, { useMemo } from 'react';
import { TFunction } from 'i18next';
import { useErrorHandler } from '@/lib/error.ts';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { buildEnvironmentCustomVariables } from '@/pages/environment/build-facts.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { UpsertEnvironmentDialog } from '@/pages/environment/upsert-environment-dialog/upsert-environment-dialog.tsx';
import { RocketIcon } from '@radix-ui/react-icons';
import { TableRowType } from '@/components/data-table/body.tsx';
import {
  O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsRequest,
  O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsSearchableFields,
  O5AwsDeployerV1EnvironmentState,
} from '@/data/types';
import { useO5AwsDeployerV1EnvironmentQueryServiceListEnvironments } from '@/data/api/hooks/generated';
import { useTranslation } from 'react-i18next';

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
      header: 'Status',
      align: 'right',
      id: 'status',
      size: 120,
      minSize: 120,
      maxSize: 150,
      accessorFn: (row) => (row.status ? t(`awsDeployer:enum.O5AwsDeployerV1EnvironmentStatus.${row.status}`) : ''),
      // filter: {
      //   type: {
      //     select: {
      //       isMultiple: true,
      //       options: Object.entries(environmentStatusLabels).map(([value, label]) => ({ value, label })),
      //     },
      //   },
      // },
    },
  ];
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1EnvironmentState>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Full Name" renderWhenEmpty="-" value={row.original.data?.config?.fullName} />
      <NutritionFact label="CORS Origins" renderWhenEmpty="-" value={row.original.data?.config?.corsOrigins?.join('\n')} />
      <NutritionFact label="Trust JWKS" renderWhenEmpty="-" value={row.original.data?.config?.trustJwks?.join('\n')} />

      {/*<h4>Provider</h4>*/}
      {/*{buildEnvironmentProvider(row.original.config?.provider)}*/}

      <h4>Variables</h4>
      {buildEnvironmentCustomVariables(row.original.data?.config?.vars)}
    </div>
  );
}

function getSearchableFields(t: TFunction) {
  return [
    {
      value: O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsSearchableFields.DataConfigFullName,
      label: t(
        `awsDeployer:enum.O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsSearchableFields.${O5AwsDeployerV1EnvironmentQueryServiceListEnvironmentsSearchableFields.DataConfigFullName}`,
      ),
    },
  ];
}

export function EnvironmentManagement() {
  const { t } = useTranslation('awsDeployer');
  const columns = useMemo(() => getColumns(t), [t]);
  const searchableFields = useMemo(() => getSearchableFields(t), [t]);
  const initialSearchFields = useMemo(() => searchableFields.map((field) => field.value), [searchableFields]);
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
