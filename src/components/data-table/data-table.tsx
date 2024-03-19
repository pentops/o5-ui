'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  Header,
  HeaderGroup,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useIntersectionObserverAction } from '@/lib/intersection-observer.ts';
import { TableFilter as TableFilterType, TableFilterValueType } from '@/components/data-table/state.ts';
import { DataTableHeader } from '@/components/data-table/header.tsx';
import { getSafeColumnId } from '@/components/data-table/util.ts';
import { DataTableSearch } from '@/components/data-table/search.tsx';
import { DataTableBody, TableRowType } from '@/components/data-table/body.tsx';

const LOADING_ROWS = 20;

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
  onSearch?: OnChangeFn<string>;
  onSearchFieldChange?: (fields: string[]) => void;
  pagination?: TablePagination;
  renderSubComponent?: (props: TableRowType<TData>) => React.ReactElement;
  rowSelections?: RowSelectionState;
  searchFields?: { value: string; label: string }[];
  searchFieldSelections?: string[];
  searchValue?: string;
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
  onSearch,
  onSearchFieldChange,
  pagination,
  renderSubComponent,
  rowSelections,
  searchFields,
  searchFieldSelections,
  searchValue,
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
    <div className="w-full flex flex-col">
      {onSearch && (
        <DataTableSearch
          fields={searchFields}
          fieldSelections={searchFieldSelections}
          onSearch={onSearch}
          onSearchFieldChange={onSearchFieldChange}
          searchValue={searchValue || ''}
        />
      )}

      <div className="rounded-md border overflow-x-auto relative scrollbars" ref={tableContainerRef}>
        <Table className="relative block" style={styleVariables}>
          <DataTableHeader filterValues={filterValues} headerGroups={table.getHeaderGroups() as HeaderGroup<any>[]} onFilter={onFilter} />
          <DataTableBody
            columnCount={columns.length}
            rows={table.getRowModel().rows as Row<TData>[]}
            renderSubComponent={renderSubComponent as any}
          />
          <tfoot className="flex w-full" ref={setObservedItemRef} />
        </Table>
      </div>
    </div>
  );
}
