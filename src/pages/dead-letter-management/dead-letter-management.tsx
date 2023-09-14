import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table.tsx';
import { O5DempeV1CapturedMessage } from '@/data/types';
import { useListMessages } from '@/data/api';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deadMessageProblemLabels, getDeadMessageProblem } from '@/data/types/ui/dempe.ts';
import { useErrorHandler } from '@/lib/error.ts';

const columns: ColumnDef<O5DempeV1CapturedMessage>[] = [
  {
    header: 'Message ID',
    accessorKey: 'messageId',
    cell: ({ getValue }) => {
      return <UUID canCopy short to={getValue<string>()} uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Infra ID',
    accessorKey: 'infraId',
    cell: ({ getValue }) => {
      return <UUID canCopy short uuid={getValue<string>()} />;
    },
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
    header: 'Problem',
    accessorFn: (row) => deadMessageProblemLabels[getDeadMessageProblem(row.cause)],
  },
  {
    header: 'Rejected At',
    accessorKey: 'rejectedTimestamp',
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
    header: 'Sent At',
    accessorKey: 'initialSentTimestamp',
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
    accessorKey: 'messageId',
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
    }, [] as O5DempeV1CapturedMessage[]);
  }, [data?.pages]);

  return (
    <div>
      <h1 className="text-2xl pb-4">Dead Letter Management</h1>
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
