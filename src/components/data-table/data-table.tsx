'use client';

import React, { useMemo, useState } from 'react';
import { TriangleUpIcon, TriangleDownIcon, CaretSortIcon, MixerVerticalIcon } from '@radix-ui/react-icons';
import { ColumnDef, flexRender, getCoreRowModel, OnChangeFn, Row, RowSelectionState, SortingState, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useIntersectionObserverAction } from '@/lib/intersection-observer.ts';
import { TableFilter as TableFilterType, TableFilterValueType } from '@/components/data-table/state.ts';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { TableFilter } from './filter/table-filter';
import { cn } from '@/lib/utils.ts';

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
      id: `${column.id || i}`,
      cell: () => <Skeleton className="h-4 w-full" />,
    }));
  }

  return columns;
}

export type CustomColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  align?: 'left' | 'right' | 'center';
  filter?: TableFilterType;
};

const DEFAULT_COLUMN_DEF = {
  enableSorting: false,
} as const;

interface TablePagination {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => Promise<any>;
}

interface DataTableProps<TData extends Object, TValue> {
  columns: CustomColumnDef<TData, TValue>[];
  controlledColumnSort?: SortingState;
  data: TData[];
  filterValues?: Record<string, TableFilterValueType>;
  getRowCanExpand?: true | ((row: Row<TData>) => boolean);
  onColumnSort?: OnChangeFn<SortingState>;
  onFilter?: OnChangeFn<Record<string, TableFilterValueType>>;
  onRowSelect?: OnChangeFn<RowSelectionState>;
  pagination?: TablePagination;
  renderSubComponent?: (props: TableRow<TData>) => React.ReactElement;
  rowSelections?: RowSelectionState;
  showSkeleton?: boolean;
}

export function DataTable<TData extends Object, TValue>({
  columns,
  controlledColumnSort,
  data,
  filterValues,
  getRowCanExpand,
  onColumnSort,
  onFilter,
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
    defaultColumn: DEFAULT_COLUMN_DEF,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    enableExpanding: Boolean(getRowCanExpand && renderSubComponent),
    getRowCanExpand: getRowCanExpand === true ? allRowsCanExpand : getRowCanExpand,
    enableRowSelection: onRowSelect && !showSkeleton,
    onRowSelectionChange: onRowSelect,
    onSortingChange: onColumnSort,
    state: { rowSelection: rowSelections || {}, sorting: controlledColumnSort },
    manualSorting: true,
    enableSorting: Boolean(onColumnSort),
  });

  return (
    <div className="rounded-md border overflow-auto h-100 w-100">
      <Table className="relative">
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [isOpen, setIsOpen] = useState(false);
                const customColumnDef = header.column.columnDef as CustomColumnDef<TData, TValue>;
                const canSort = header.column.getCanSort();
                const filter = customColumnDef.filter;
                const sort = header.column.getIsSorted();
                const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
                const hasFilter = header.column?.columnDef?.id && filter && onFilter;
                const hasFilterValue = filterValues?.[header.column.columnDef.id!];

                const base = (
                  <TableHead
                    aria-sort={canSort ? (sort ? (sort === 'desc' ? 'descending' : 'ascending') : 'none') : undefined}
                    style={{ maxWidth: header.column.columnDef.maxSize }}
                    key={header.id}
                  >
                    <div
                      className={cn(
                        'flex gap-2 items-center flex-nowrap',
                        customColumnDef.align === 'right' && 'justify-end',
                        customColumnDef.align === 'center' && 'justify-center',
                        customColumnDef.align === 'left' && 'justify-start',
                      )}
                    >
                      {canSort ? (
                        <button
                          aria-label="Toggle sort order"
                          className="flex gap-1 items-center flex-nowrap"
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {sort === false ? <CaretSortIcon /> : sort === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />}
                          {content}
                        </button>
                      ) : (
                        content
                      )}

                      {hasFilter && (
                        <PopoverTrigger asChild>
                          <button aria-label="Apply filter" className="flex gap-1 items-center" type="button">
                            <MixerVerticalIcon className={cn(hasFilterValue && 'text-sky-400')} width={12} />
                          </button>
                        </PopoverTrigger>
                      )}
                    </div>
                  </TableHead>
                );

                return hasFilter ? (
                  <Popover key={header.id} open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverAnchor asChild>{base}</PopoverAnchor>
                    <PopoverContent
                      className="w-auto p-4 border bg-background shadow-lg"
                      style={{ width: 'var(--radix-popper-anchor-width)', minWidth: 250 }}
                    >
                      <TableFilter
                        id={header.column.columnDef.id!}
                        onChange={onFilter}
                        onClose={() => {
                          setIsOpen(false);
                        }}
                        {...filter}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  base
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
                  {row.getVisibleCells().map((cell) => {
                    const customColumnDef = cell.column.columnDef as CustomColumnDef<TData, TValue>;

                    return (
                      <TableCell style={{ maxWidth: cell.column.columnDef.maxSize }} key={cell.id}>
                        <div
                          className={cn(
                            'flex gap-2 items-center flex-nowrap',
                            customColumnDef.align === 'right' && 'justify-end',
                            customColumnDef.align === 'center' && 'justify-center',
                            customColumnDef.align === 'left' && 'justify-start',
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    );
                  })}
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
