import React, { useMemo, useState } from 'react';
import { match, P } from 'ts-pattern';
import { TableFilterValueType } from '@/components/data-table/state.ts';
import { flexRender, Header, OnChangeFn } from '@tanstack/react-table';
import { CustomColumnDef } from '@/components/data-table/data-table.tsx';
import { getSafeColumnId } from '@/components/data-table/util.ts';
import { TableHead } from '@/components/ui/table.tsx';
import { cn } from '@/lib/utils.ts';
import { CaretSortIcon, MixerVerticalIcon, TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { TableFilter } from '@/components/data-table/filter/table-filter.tsx';

const popoverContentStyles = { width: 'var(--radix-popper-anchor-width)', minWidth: 250 };

function hasActiveFilter(filterValue: TableFilterValueType | undefined): boolean {
  return match(filterValue)
    .with({ date: P.not(P.nullish) }, (d) => Boolean(d.date.start || d.date.end || d.date.exact))
    .with({ exact: P.not(P.nullish) }, (e) => e.exact !== undefined && e.exact !== '')
    .with({ multiple: P.not(P.nullish) }, (m) => m.multiple.length > 0)
    .with({ range: P.not(P.nullish) }, (r) => (r.range.min !== undefined && r.range.min !== '') || (r.range.max !== undefined && r.range.max !== ''))
    .otherwise(() => false);
}

interface DataTableTHProps<TData extends Object, TFilterableField extends string = string> {
  filterValue: TableFilterValueType | undefined;
  header: Header<TData, any>;
  onFilter: OnChangeFn<Record<TFilterableField, TableFilterValueType>> | undefined;
}

export const TH = React.memo(
  <TData extends Object, TFilterableField extends string = string>({ filterValue, header, onFilter }: DataTableTHProps<TData, TFilterableField>) => {
    const [isOpen, setIsOpen] = useState(false);
    const customColumnDef = header.column.columnDef as CustomColumnDef<TData, any>;
    const canSort = header.column.getCanSort();
    const filter = customColumnDef.filter;
    const sort = header.column.getIsSorted();
    const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
    const hasFilter = header.column?.columnDef?.id && filter && onFilter;
    const id = getSafeColumnId(header.column.columnDef.id || header.id);
    const thStyles = useMemo(
      () => ({
        flex: `var(--o5ui-table-column-${id}-size)`,
        maxWidth: `var(--o5ui-table-column-${id}-max-size)`,
        minWidth: `var(--o5ui-table-column-${id}-min-size)`,
      }),
      [id],
    );

    const base = (
      <TableHead
        aria-sort={canSort ? (sort ? (sort === 'desc' ? 'descending' : 'ascending') : 'none') : undefined}
        className="flex gap-2 items-center flex-nowrap"
        style={thStyles}
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
                <MixerVerticalIcon className={cn(hasActiveFilter(filterValue) && 'text-sky-400')} width={12} />
              </button>
            </PopoverTrigger>
          )}
        </div>
      </TableHead>
    );

    return hasFilter ? (
      <Popover key={header.id} open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>{base}</PopoverAnchor>
        <PopoverContent className="w-auto p-4 border bg-background shadow-lg" style={popoverContentStyles}>
          <TableFilter
            id={header.column.columnDef.id!}
            initialValue={filterValue}
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
  },
);
