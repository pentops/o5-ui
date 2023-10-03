'use client';

import React, { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, OnChangeFn, Row, RowSelectionState, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useIntersectionObserverAction } from '@/lib/intersection-observer.ts';

const LOADING_ROWS = 20;

export type TableRow<T> = { row: Row<T> };

function allRowsCanExpand() {
  return true;
}

function getTableData<TData>(data: TData[] | undefined, showSkeleton?: boolean): TData[] {
  if (showSkeleton) {
    return new Array(LOADING_ROWS).fill({}) as TData[];
  }

  return data || [];
}

function getTableColumns<TData, TValue>(columns: ColumnDef<TData, TValue>[], showSkeleton?: boolean): ColumnDef<TData, TValue>[] {
  if (showSkeleton) {
    return columns.map((column, i) => ({
      ...column,
      id: `${column.id || i}-skeleton`,
      cell: () => <Skeleton className="h-4 w-full" />,
    }));
  }

  return columns;
}

interface TablePagination {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => Promise<any>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowCanExpand?: true | ((row: Row<TData>) => boolean);
  onRowSelect?: OnChangeFn<RowSelectionState>;
  pagination?: TablePagination;
  renderSubComponent?: (props: TableRow<TData>) => React.ReactElement;
  rowSelections?: RowSelectionState;
  showSkeleton?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowCanExpand,
  onRowSelect,
  pagination,
  renderSubComponent,
  rowSelections,
  showSkeleton,
}: DataTableProps<TData, TValue>) {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = pagination || {};
  const [setObservedItemRef] = useIntersectionObserverAction(fetchNextPage, {
    disabled: showSkeleton || !hasNextPage || isFetchingNextPage || !fetchNextPage,
  });
  const tableData = useMemo(() => getTableData(data, showSkeleton), [data, showSkeleton]);
  const tableColumns = useMemo(() => getTableColumns(columns, showSkeleton), [columns, showSkeleton]);
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    enableExpanding: Boolean(getRowCanExpand && renderSubComponent),
    getRowCanExpand: getRowCanExpand === true ? allRowsCanExpand : getRowCanExpand,
    enableRowSelection: onRowSelect && !showSkeleton,
    onRowSelectionChange: onRowSelect,
    state: { rowSelection: rowSelections || {} },
  });

  return (
    <div className="rounded-md border overflow-auto h-100 w-100">
      <Table className="relative">
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead style={{ maxWidth: header.column.columnDef.maxSize }} key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell style={{ maxWidth: cell.column.columnDef.maxSize }} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {renderSubComponent && row.getIsExpanded() && (
                  <TableRow data-state="expanded">
                    <TableCell className="px-3" colSpan={columns.length}>
                      {renderSubComponent({ row })}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tfoot ref={setObservedItemRef} />
      </Table>
    </div>
  );
}
