import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table.tsx';
import { Row } from '@tanstack/react-table';
import { DataTableRow } from '@/components/data-table/row.tsx';

export type TableRowType<T> = { row: Row<T> };

interface DataTableBodyProps<TData extends Object> {
  columnCount: number;
  renderSubComponent?: (props: TableRowType<TData>) => React.ReactElement;
  rows: Row<TData>[];
}

export function DataTableBody({ columnCount, renderSubComponent, rows }: DataTableBodyProps<any>) {
  return (
    <TableBody className="block">
      {rows?.length ? (
        rows.map((row) => (
          <DataTableRow
            key={row.id}
            cells={row.getVisibleCells()}
            columnCount={columnCount}
            isExpanded={row.getIsExpanded()}
            isSelected={row.getIsSelected()}
            renderSubComponent={renderSubComponent}
            row={row}
          />
        ))
      ) : (
        <TableRow className="flex w-full items-center justify-center">
          <TableCell colSpan={columnCount} className="h-24 text-center flex w-full items-center justify-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
