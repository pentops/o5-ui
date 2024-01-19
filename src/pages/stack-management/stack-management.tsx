import React, { useMemo } from 'react';
import { useListStacks } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { O5DeployerV1StackState, stackStatusLabels } from '@/data/types';
import { DataTable } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from '@/components/uuid/uuid.tsx';

const columns: ColumnDef<O5DeployerV1StackState>[] = [
  {
    header: 'ID',
    accessorKey: 'stackId',
    cell: ({ getValue }) => {
      return <UUID canCopy short to={getValue<string>()} uuid={getValue<string>()} />;
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
    accessorFn: (row) => stackStatusLabels[row.status!] || '',
  },
  {
    header: 'Current Deployment',
    accessorFn: (row) => row.currentDeployment?.deploymentId,
    cell: ({ getValue }) => {
      return <UUID canCopy short to={getValue<string>()} uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Current Deployment Version',
    accessorFn: (row) => row.currentDeployment?.version,
  },
  {
    header: 'Queued Deployments',
    accessorFn: (row) => row.queuedDeployments?.map((d) => `${d.deploymentId} (${d.version})`).join(', ') || '-',
  },
];

export function StackManagement() {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListStacks();
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
        <h1 className="text-2xl pb-4">Stack Management</h1>
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        data={flatData}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        showSkeleton={Boolean(isLoading || error)}
      />
    </div>
  );
}
