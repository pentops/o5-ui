import React from 'react';
import { TableRowType } from '@/components/data-table/body.tsx';
import { cn } from '@/lib/utils.ts';
import { TableCell, TableRow } from '@/components/ui/table.tsx';
import { Cell, Row } from '@tanstack/react-table';
import { DataTableCell } from '@/components/data-table/cell.tsx';
import { CustomColumnDef } from '@/components/data-table/data-table.tsx';

interface DataTableRowProps<TData extends Object> {
  cells: Cell<TData, any>[];
  columnCount: number;
  isExpanded: boolean;
  isSelected: boolean;
  renderSubComponent?: (props: TableRowType<TData>) => React.ReactElement;
  row: Row<TData>;
}

export const DataTableRow = React.memo(({ cells, columnCount, isExpanded, isSelected, renderSubComponent, row }: DataTableRowProps<any>) => {
  const memoizedSubRow = React.useMemo(() => renderSubComponent?.({ row }), [renderSubComponent, row]);

  return (
    <>
      <TableRow data-state={isSelected && 'selected'} className={cn('flex flex-nowrap', isExpanded && 'border-0')}>
        {cells.map((cell) => (
          <DataTableCell
            key={cell.id}
            backupId={cell.column.id || cell.id}
            context={cell.getContext() as any}
            definition={cell.column.columnDef as CustomColumnDef<any>}
          />
        ))}
      </TableRow>

      {renderSubComponent && isExpanded && (
        <TableRow data-state="expanded" className="flex flex-nowrap w-full">
          <TableCell className="flex w-full px-3" colSpan={columnCount}>
            <div className="w-full">{memoizedSubRow}</div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});
