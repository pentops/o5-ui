import React, { useMemo } from 'react';
import { CustomColumnDef } from '@/components/data-table/data-table.tsx';
import { getSafeColumnId } from '@/components/data-table/util.ts';
import { CellContext, flexRender } from '@tanstack/react-table';
import { cn } from '@/lib/utils.ts';
import { TableCell } from '@/components/ui/table.tsx';

export interface DataTableCellProps<TData extends Object> {
  backupId: string;
  context: CellContext<TData, any>;
  definition: CustomColumnDef<TData, any>;
}

export function DataTableCell({ backupId, context, definition }: DataTableCellProps<any>) {
  const id = getSafeColumnId(definition.id || backupId);
  const styles = useMemo(
    () => ({
      flex: `var(--o5ui-table-column-${id}-size)`,
      maxWidth: `var(--o5ui-table-column-${id}-max-size)`,
      minWidth: `var(--o5ui-table-column-${id}-min-size)`,
    }),
    [id],
  );

  return (
    <TableCell className="flex flex-nowrap" style={styles}>
      <div
        className={cn(
          'flex gap-2 items-center flex-nowrap flex-1 whitespace-pre-wrap break-all',
          definition.className,
          definition.align === 'right' && 'justify-end',
          definition.align === 'center' && 'justify-center',
          definition.align === 'left' && 'justify-start',
        )}
      >
        {flexRender(definition.cell, context)}
      </div>
    </TableCell>
  );
}
