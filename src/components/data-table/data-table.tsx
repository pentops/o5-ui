'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TriangleUpIcon, TriangleDownIcon, CaretSortIcon, MixerVerticalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Header,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useIntersectionObserverAction } from '@/lib/intersection-observer.ts';
import { TableFilter as TableFilterType, TableFilterValueType } from '@/components/data-table/state.ts';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { TableFilter } from './filter/table-filter';
import { cn } from '@/lib/utils.ts';

const LOADING_ROWS = 20;

export type TableRow<T> = { row: Row<T> };

function getSafeColumnId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}

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

function buildTableColumnSizeVariables<T extends Object>(
  tableStateSize: number,
  tableRef: React.RefObject<HTMLDivElement>,
  headers: Header<T, any>[],
) {
  const tableWidth = tableRef.current?.clientWidth || tableStateSize || 0;

  return headers.reduce(
    (acc, header) => {
      const headerSize = header.getSize();
      const headerSizePercentage = headerSize / tableStateSize;
      let renderedSize = headerSizePercentage * tableWidth;
      const id = getSafeColumnId(header.id);

      if (header.column.columnDef.maxSize) {
        acc[`--o5ui-table-column-${id}-max-size`] = `${header.column.columnDef.maxSize}px`;

        if (renderedSize > header.column.columnDef.maxSize) {
          renderedSize = header.column.columnDef.maxSize;
        }
      }

      if (header.column.columnDef.minSize) {
        acc[`--o5ui-table-column-${id}-min-size`] = `${header.column.columnDef.minSize}px`;

        if (renderedSize < header.column.columnDef.minSize) {
          renderedSize = header.column.columnDef.minSize;
        }
      }

      acc[`--o5ui-table-column-${id}-size`] = `1 0 ${renderedSize}px`;

      return acc;
    },
    {} as Record<string, string>,
  );
}

/*
 * This is an... interesting... solution for enabling sticky table headers while allowing the table to horizontally scroll.
 * Doing this with state, like the column sizing variables, would be less hacky, but it results in rendering lag that makes
 * the table header appear to jump around as the user scrolls. This solution is a bit hacky, but it's what we've got for now.
 */
function updateStickyHeaderPosition(tableContainerRef: React.RefObject<HTMLDivElement>) {
  const usableTop = (tableContainerRef.current?.getBoundingClientRect()?.top || 0) - 58;

  // Subtract 1px from the resulting top offset to hide the top border.
  tableContainerRef.current?.style?.setProperty(
    '--o5ui-table-header-top-offset',
    usableTop < 0 ? `${Math.abs(usableTop + (usableTop < 0 ? 1 : 0))}px` : '0',
  );
}

export type CustomColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  align?: 'left' | 'right' | 'center';
  className?: string;
  id: string;
  filter?: TableFilterType;
};

const DEFAULT_COLUMN_DEF = {
  enableSorting: false,
  width: 'auto',
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
  const tableContainerRef = useRef<HTMLDivElement>(null);
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

  const totalSize = table.getTotalSize();
  const flatHeaders = table.getFlatHeaders();
  const styleVariables = useMemo(() => buildTableColumnSizeVariables(totalSize, tableContainerRef, flatHeaders), [totalSize, flatHeaders]);

  useLayoutEffect(() => {
    const handleUpdateStickyHeaderPosition = () => {
      updateStickyHeaderPosition(tableContainerRef);
    };

    window.addEventListener('scroll', handleUpdateStickyHeaderPosition, true);
    handleUpdateStickyHeaderPosition();

    return () => {
      window.removeEventListener('scroll', handleUpdateStickyHeaderPosition, true);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-x-auto relative scrollbars" ref={tableContainerRef}>
        <Table className="relative block" style={styleVariables}>
          <TableHeader
            className="sticky top-0 left-0 block z-10"
            style={{ top: 'var(--o5ui-table-header-top-offset, 0)', background: 'hsl(var(--background))' }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="flex flex-nowrap" key={headerGroup.id}>
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
                  const id = getSafeColumnId(header.column.columnDef.id || header.id);

                  const base = (
                    <TableHead
                      aria-sort={canSort ? (sort ? (sort === 'desc' ? 'descending' : 'ascending') : 'none') : undefined}
                      className="flex gap-2 items-center flex-nowrap"
                      style={{
                        flex: `var(--o5ui-table-column-${id}-size)`,
                        maxWidth: `var(--o5ui-table-column-${id}-max-size)`,
                        minWidth: `var(--o5ui-table-column-${id}-min-size)`,
                      }}
                      key={id}
                    >
                      <div
                        className={cn(
                          'flex gap-2 items-center flex-nowrap flex-1',
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
          <TableBody className="block">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isExpanded = row.getIsExpanded();

                return (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && 'selected'} className={cn('flex flex-nowrap', isExpanded && 'border-0')}>
                      {row.getVisibleCells().map((cell) => {
                        const customColumnDef = cell.column.columnDef as CustomColumnDef<TData, TValue>;
                        const id = getSafeColumnId(cell.column.columnDef.id || cell.column.id || cell.id);

                        return (
                          <TableCell
                            className="flex flex-nowrap"
                            style={{
                              flex: `var(--o5ui-table-column-${id}-size)`,
                              maxWidth: `var(--o5ui-table-column-${id}-max-size)`,
                              minWidth: `var(--o5ui-table-column-${id}-min-size)`,
                            }}
                            key={cell.id}
                          >
                            <div
                              className={cn(
                                'flex gap-2 items-center flex-nowrap flex-1 whitespace-pre-wrap break-all',
                                customColumnDef.className,
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
                    {renderSubComponent && isExpanded && (
                      <TableRow data-state="expanded" className="flex flex-nowrap w-full">
                        <TableCell className="flex w-full px-3" colSpan={columns.length}>
                          <div className="w-full">{renderSubComponent({ row })}</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow className="flex w-full items-center justify-center">
                <TableCell colSpan={columns.length} className="h-24 text-center flex w-full items-center justify-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <tfoot className="flex w-full" ref={setObservedItemRef} />
        </Table>
      </div>
    </div>
  );
}
