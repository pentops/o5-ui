import React from 'react';
import { Header, HeaderGroup, OnChangeFn } from '@tanstack/react-table';
import { TableHeader, TableRow } from '@/components/ui/table.tsx';
import { TableFilterValueType } from '@/components/data-table/state.ts';
import { TH } from '@/components/data-table/th.tsx';

const headerStyles = { top: 'var(--o5ui-table-header-top-offset, 0)', background: 'hsl(var(--background))' };

interface DataTableHeaderProps<TData extends Object> {
  filterValues: Record<string, TableFilterValueType> | undefined;
  headerGroups: HeaderGroup<TData>[];
  onFilter: OnChangeFn<Record<string, TableFilterValueType>> | undefined;
}

export const DataTableHeader = React.memo(<TData extends Object>({ filterValues, headerGroups, onFilter }: DataTableHeaderProps<TData>) => {
  return (
    <TableHeader className="sticky top-0 left-0 block z-10" style={headerStyles}>
      {headerGroups.map((headerGroup) => (
        <TableRow className="flex flex-nowrap" key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TH filterValue={filterValues?.[header.id]} header={header as Header<any, any>} key={header.id} onFilter={onFilter} />
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
});
