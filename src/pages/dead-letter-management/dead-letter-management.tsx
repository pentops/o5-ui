import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table.tsx';
import { O5DanteV1DeadMessageState } from '@/data/types';
import { useListMessages } from '@/data/api';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deadMessageProblemLabels, getDeadMessageProblem } from '@/data/types/ui/dante.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { getRowSelect } from '@/components/data-table/row-select/row-select.tsx';

const columns: ColumnDef<O5DanteV1DeadMessageState>[] = [
  getRowSelect(true),
  {
    header: 'Message ID',
    accessorFn: (row) => row.messageId,
    cell: ({ getValue }) => {
      return <UUID canCopy short to={getValue<string>()} uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Infra ID',
    accessorFn: (row) => row.currentSpec?.infraMessageId,
    cell: ({ getValue }) => {
      return <UUID canCopy short uuid={getValue<string>()} />;
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
  },
  {
    header: () => {
      return <div className="block w-[65px]" />;
    },
    id: 'actions',
    accessorFn: (row) => row.messageId,
    cell: ({ getValue }) => {
      return <ActionActivator messageId={getValue<string>()} />;
    },
  },
];

function DeadLetterManagement() {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListMessages();
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
        <h1 className="text-2xl pb-4">Dead Letter Management</h1>
      </div>

      <DataTable
        columns={columns}
        data={flatData}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        showSkeleton={Boolean(isLoading || error)}
      />
    </div>
  );
}

export default DeadLetterManagement;
