import React, { useMemo } from 'react';
import { CustomColumnDef, DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { deadMessageStatusLabels, O5DanteV1DeadMessageState } from '@/data/types';
import { useListMessages } from '@/data/api';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deadMessageProblemLabels, getDeadMessageProblem } from '@/data/types/ui/dante.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useTableState } from '@/components/data-table/state.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { formatJSONString } from '@/lib/json.ts';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { buildDeadMessageProblemFacts } from '@/pages/dead-letter/build-facts.tsx';

const columns: CustomColumnDef<O5DanteV1DeadMessageState>[] = [
  getRowExpander(),
  {
    header: 'Message ID',
    id: 'messageId',
    minSize: 110,
    size: 110,
    maxSize: 110,
    accessorFn: (row) => row.messageId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/dead-letter/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'Infra ID',
    id: 'currentSpec.infraId',
    minSize: 110,
    size: 110,
    maxSize: 110,
    accessorFn: (row) => row.currentSpec?.infraMessageId,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short uuid={value} /> : null;
    },
  },
  {
    header: 'Status',
    minSize: 120,
    size: 120,
    maxSize: 150,
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
    id: 'currentSpec.queueName',
    accessorFn: (row) => row.currentSpec?.queueName,
  },
  {
    header: 'gRPC Name',
    id: 'currentSpec.grpcName',
    accessorFn: (row) => row.currentSpec?.grpcName,
    size: 225,
    maxSize: 225,
    minSize: 225,
  },
  {
    header: 'Problem',
    id: 'currentSpec.problem',
    accessorFn: (row) => deadMessageProblemLabels[getDeadMessageProblem(row.currentSpec)],
    size: 225,
    maxSize: 225,
    minSize: 225,
  },
  {
    header: 'Created At',
    id: 'currentSpec.createdAt',
    enableSorting: true,
    size: 225,
    maxSize: 225,
    minSize: 225,
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
      return <div className="block w-[40px]" />;
    },
    size: 75,
    minSize: 75,
    maxSize: 75,
    id: 'actions',
    align: 'right',
    accessorFn: (row) => row.messageId,
    cell: ({ getValue }) => {
      return <ActionActivator messageId={getValue<string>()} />;
    },
  },
];

function renderSubRow({ row }: TableRow<O5DanteV1DeadMessageState>) {
  return (
    <div className="flex flex-col gap-4">
      {buildDeadMessageProblemFacts(row.original.currentSpec?.problem)}

      <h3 className="text-lg">Payload</h3>
      <CodeEditor disabled value={formatJSONString(row.original?.currentSpec?.payload?.json || '')} />
    </div>
  );
}

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

export default DeadLetterManagement;
