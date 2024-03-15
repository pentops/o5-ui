import React, { useMemo } from 'react';
import { useListStacks } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { O5DeployerV1StackState, stackStatusLabels } from '@/data/types';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { useTableState } from '@/components/data-table/state.ts';

const columns: CustomColumnDef<O5DeployerV1StackState>[] = [
  {
    header: 'ID',
    accessorKey: 'stackId',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/stack/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'App',
    accessorKey: 'applicationName',
  },
  {
    header: 'Environment',
    accessorKey: 'environmentName',
  },
  {
    header: 'Status',
    id: 'status',
    accessorFn: (row) => stackStatusLabels[row.status!] || '',
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.entries(stackStatusLabels).map(([value, label]) => ({ value, label })),
        },
      },
    },
  },
  {
    header: 'Current Deployment',
    accessorFn: (row) => row.currentDeployment?.deploymentId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'Current Deployment Version',
    accessorFn: (row) => row.currentDeployment?.version,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'Queued Deployments',
    accessorFn: (row) => row.queuedDeployments?.map((d) => d.deploymentId || '-'),
    cell: ({ row }) =>
      row.original.queuedDeployments?.map((d, i) => (
        <React.Fragment key={d.deploymentId}>
          <UUID canCopy short to={`/deployment/${d.deploymentId}`} uuid={d.deploymentId} />
          {i !== row.original.queuedDeployments!.length - 1 && ', '}
        </React.Fragment>
      )),
  },
];

export function StackManagement() {
  const { sortValues, setSortValues, setFilterValues, filterValues, psmQuery } = useTableState();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListStacks({ query: psmQuery });
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
    }, [] as O5DeployerV1StackState[]);
  }, [data?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Stack Management</h1>
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        controlledColumnSort={sortValues}
        data={flatData}
        filterValues={filterValues}
        onColumnSort={setSortValues}
        onFilter={setFilterValues}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        showSkeleton={Boolean(data === undefined || isLoading || error)}
      />
    </div>
  );
}
