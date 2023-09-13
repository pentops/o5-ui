import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table.tsx';
import { O5DempeV1CapturedMessage } from '@/data/types';
import { useListMessages } from '@/data/api';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';

const columns: ColumnDef<O5DempeV1CapturedMessage>[] = [
  {
    header: 'Infra ID',
    accessorKey: 'infraId',
  },
  {
    header: 'Message ID',
    accessorKey: 'messageId',
  },
  {
    header: 'Queue',
    accessorKey: 'queueName',
  },
  {
    header: 'gRPC Name',
    accessorKey: 'grpcName',
  },
  {
    header: 'Rejected At',
    accessorKey: 'rejectedTimestamp',
  },
  {
    header: 'Sent At',
    accessorKey: 'initialSentTimestamp',
  },
  {
    header: () => {
      return <div className="block w-[65px]" />;
    },
    id: 'actions',
    accessorKey: 'messageId',
    cell: ({ getValue }) => {
      return <ActionActivator messageId={getValue<string>()} />;
    },
  },
];

function DeadLetterManagement() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListMessages();
  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.messages) {
        return [...acc, ...page.messages];
      }

      return acc;
    }, [] as O5DempeV1CapturedMessage[]);
  }, [data?.pages]);

  return (
    <div>
      <h1 className="text-2xl pb-4">Dead Letter Management</h1>
      <DataTable columns={columns} data={flatData} pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }} showSkeleton={isLoading} />
    </div>
  );
}

export default DeadLetterManagement;
