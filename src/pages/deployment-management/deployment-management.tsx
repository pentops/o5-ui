import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useListDeployments } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { O5DeployerV1DeploymentState, O5DeployerV1DeploymentStatus } from '@/data/types';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deploymentStatusLabels } from '@/data/types/ui/deployer.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { buildDeploymentSpecFacts, buildDeploymentStepFacts } from '@/pages/deployment/build-facts.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { TableRowType } from '@/components/data-table/body.tsx';

const columns: CustomColumnDef<O5DeployerV1DeploymentState>[] = [
  getRowExpander(),
  {
    header: 'ID',
    accessorKey: 'deploymentId',
    id: 'deploymentId',
    size: 110,
    minSize: 110,
    maxSize: 110,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'App',
    id: 'spec.appName',
    size: 120,
    minSize: 120,
    maxSize: 140,
    accessorFn: (row) => row.spec?.appName || '',
  },
  {
    header: 'Environment',
    id: 'spec.environmentName',
    size: 120,
    minSize: 120,
    maxSize: 140,
    accessorFn: (row) => row.spec?.environmentName || '',
    cell: ({ getValue, row }) => {
      const value = getValue<string>();
      return row.original.spec?.environmentId ? <Link to={`/environment/${row.original.spec.environmentId}`}>{value}</Link> : value;
    },
  },
  {
    header: 'Version',
    id: 'spec.version',
    size: 110,
    minSize: 110,
    maxSize: 110,
    accessorFn: (row) => row.spec?.version || '',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short uuid={value} /> : null;
    },
  },
  {
    header: 'Status',
    id: 'status',
    size: 120,
    minSize: 120,
    maxSize: 150,
    accessorFn: (row) => deploymentStatusLabels[row.status!] || '',
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.entries(deploymentStatusLabels).map(([value, label]) => ({ value, label })),
        },
      },
    },
  },
  {
    header: 'Stack',
    accessorKey: 'stackName',
    id: 'stackName',
    cell: ({ getValue, row }) => {
      const value = getValue<string>();
      return row.original.stackId ? <Link to={`/stack/${row.original.stackId}`}>{value}</Link> : value;
    },
  },
  {
    header: 'Created At',
    id: 'createdAt',
    accessorKey: 'createdAt',
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
  {
    header: () => {
      return <div className="block w-[65px]" />;
    },
    align: 'right',
    id: 'actions',
    size: 65,
    minSize: 65,
    maxSize: 65,
    accessorFn: (row) => row.deploymentId,
    cell: ({ getValue, row }) => {
      const value = getValue<string>();

      return (
        <div className="flex items-center justify-end gap-2">
          <TriggerDeploymentDialog deploymentId={value} />
          {![O5DeployerV1DeploymentStatus.Done, O5DeployerV1DeploymentStatus.Failed, O5DeployerV1DeploymentStatus.Terminated].includes(
            row.original.status!,
          ) && <ConfirmTerminateDeploymentAlert deploymentId={value} />}
        </div>
      );
    },
  },
];

const searchableFields = [
  { value: 'spec.appName', label: 'App' },
  { value: 'spec.environmentName', label: 'Environment' },
  { value: 'spec.version', label: 'Version' },
  { value: 'spec.templateUrl', label: 'Template URL' },
];

function renderSubRow({ row }: TableRowType<O5DeployerV1DeploymentState>) {
  return (
    <div className="flex flex-col gap-4">
      {buildDeploymentSpecFacts(row.original.spec)}
      {buildDeploymentStepFacts(row.original.steps)}
    </div>
  );
}

function DeploymentManagement() {
  const { sortValues, setSortValues, setFilterValues, filterValues, searchValue, setSearchValue, searchFields, setSearchFields, psmQuery } =
    useTableState();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListDeployments({ query: psmQuery });
  useErrorHandler(error, 'Failed to load deployments');
  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.deployments) {
        return [...acc, ...page.deployments];
      }

      return acc;
    }, [] as O5DeployerV1DeploymentState[]);
  }, [data?.pages]);

  return (
    <div className="w-full overflow-auto">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Deployment Management</h1>
        <TriggerDeploymentDialog />
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

export default DeploymentManagement;
