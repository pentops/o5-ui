import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table.tsx';
import { O5DempeV1CapturedMessage } from '@/data/types';
import { useListMessages } from '@/data/api';

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
    <Card>
      <CardHeader>
        <CardTitle>Dead Letter Management</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={flatData} pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }} showSkeleton={isLoading} />
      </CardContent>
    </Card>
  );
}

export default DeadLetterManagement;
