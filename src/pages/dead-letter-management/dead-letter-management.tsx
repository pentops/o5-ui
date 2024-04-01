import React, { useMemo } from 'react';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { DeadMessageProblem, deadMessageStatusLabels, O5DanteV1DeadMessageState, O5DanteV1Urgency, urgencyLabels } from '@/data/types';
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
import { TableRowType } from '@/components/data-table/body.tsx';

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
    header: 'Urgency',
    minSize: 120,
    size: 120,
    maxSize: 150,
    id: 'currentSpec.problem.type.invariantViolation.urgency',
    accessorFn: (row) => urgencyLabels[row.currentSpec?.problem?.type?.invariantViolation?.urgency as O5DanteV1Urgency] || '',
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.entries(urgencyLabels).map(([value, label]) => ({ value, label })),
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
    id: 'currentSpec.problem.type',
    accessorFn: (row) => deadMessageProblemLabels[getDeadMessageProblem(row.currentSpec)],
    size: 225,
    maxSize: 225,
    minSize: 225,
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.values(DeadMessageProblem).map((value) => ({ label: deadMessageProblemLabels[value], value })),
        },
      },
    },
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

function renderSubRow({ row }: TableRowType<O5DanteV1DeadMessageState>) {
  return (
    <div className="flex flex-col gap-4">
      {buildDeadMessageProblemFacts(row.original.currentSpec?.problem)}

      <h3 className="text-lg">Payload</h3>
      <CodeEditor disabled value={formatJSONString(row.original?.currentSpec?.payload?.json || '')} />
    </div>
  );
}

const searchableFields = [
  { value: 'currentSpec.queueName', label: 'Queue Name' },
  { value: 'currentSpec.grpcName', label: 'gRPC Name' },
  { value: 'currentSpec.payload.json', label: 'Payload' },
  { value: 'currentSpec.problem.type.invariantViolation.description', label: 'Invariant Violation Description' },
  { value: 'currentSpec.problem.type.invariantViolation.error.json', label: 'Invariant Violation Error' },
  { value: 'currentSpec.problem.type.unhandledError.error', label: 'Unhandled Error' },
];

function DeadLetterManagement() {
  const { sortValues, setSortValues, setFilterValues, filterValues, searchValue, setSearchValue, searchFields, setSearchFields, psmQuery } =
    useTableState();
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

export default DeadLetterManagement;
