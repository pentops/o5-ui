import React, { useMemo } from 'react';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { deadMessageStatusLabels, O5DanteV1DeadMessageState } from '@/data/types';
import { useListMessages } from '@/data/api';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deadMessageProblemLabels, getDeadMessageProblem } from '@/data/types/ui/dante.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useTableState } from '@/components/data-table/state.ts';

const columns: CustomColumnDef<O5DanteV1DeadMessageState>[] = [
  {
    header: 'Message ID',
    accessorFn: (row) => row.messageId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/dead-letter/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'Infra ID',
    accessorFn: (row) => row.currentSpec?.infraMessageId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short uuid={value} /> : null;
    },
  },
  {
    header: 'Status',
    id: 'status',
    accessorFn: (row) => deadMessageStatusLabels[row.status!] || '',
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.entries(deadMessageStatusLabels).map(([value, label]) => ({ value, label })),
        },
      },
    },
  },
  {
    header: 'Queue',
    accessorFn: (row) => row.currentSpec?.queueName,
  },
  {
    header: 'gRPC Name',
    accessorFn: (row) => row.currentSpec?.grpcName,
  },
  {
    header: 'Problem',
    accessorFn: (row) => deadMessageProblemLabels[getDeadMessageProblem(row.currentSpec)],
  },
  {
    header: 'Created At',
    id: 'currentSpec.createdAt',
    enableSorting: true,
    align: 'right',
    accessorFn: (row) => row.currentSpec?.createdAt,
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
    id: 'actions',
    align: 'right',
    accessorFn: (row) => row.messageId,
    cell: ({ getValue }) => {
      return <ActionActivator messageId={getValue<string>()} />;
    },
  },
];

function DeadLetterManagement() {
  const { sortValues, setSortValues, setFilterValues, filterValues, psmQuery } = useTableState();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListMessages({ query: psmQuery });
  useErrorHandler(error, 'Failed to load dead letter messages');
  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.messages) {
        return [...acc, ...page.messages];
      }

      return acc;
    }, [] as O5DanteV1DeadMessageState[]);
  }, [data?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Dead Letter Management</h1>
      </div>

      <DataTable
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

export default DeadLetterManagement;
