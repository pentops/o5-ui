import React, { useMemo } from 'react';
import { useListStacks } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { O5DeployerV1StackState, stackStatusLabels } from '@/data/types';
import { CustomColumnDef, DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { buildCodeSourceFact } from '@/pages/stack/build-facts.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

const columns: CustomColumnDef<O5DeployerV1StackState>[] = [
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
    header: 'App',
    id: 'applicationName',
    accessorKey: 'applicationName',
    size: 120,
    minSize: 120,
    maxSize: 140,
  },
  {
    header: 'Environment',
    id: 'environmentName',
    accessorKey: 'environmentName',
    size: 120,
    minSize: 120,
    maxSize: 140,
  },
  {
    header: 'Status',
    id: 'status',
    accessorFn: (row) => stackStatusLabels[row.status!] || '',
    size: 120,
    minSize: 120,
    maxSize: 150,
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
    id: 'currentDeployment.deploymentId',
    size: 150,
    minSize: 150,
    maxSize: 200,
    accessorFn: (row) => row.currentDeployment?.deploymentId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'Current Deployment Version',
    id: 'currentDeployment.version',
    size: 150,
    minSize: 150,
    maxSize: 200,
    accessorFn: (row) => row.currentDeployment?.version,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'Queued Deployments',
    id: 'queuedDeployments.deploymentId',
    align: 'right',
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

function renderSubRow({ row }: TableRow<O5DeployerV1StackState>) {
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

      {buildCodeSourceFact(row.original.config?.codeSource)}
    </div>
  );
}

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
        renderSubComponent={renderSubRow}
        showSkeleton={Boolean(data === undefined || isLoading || error)}
      />
    </div>
  );
}
