import React from 'react';
import { Header, HeaderGroup, OnChangeFn } from '@tanstack/react-table';
import { TableHeader, TableRow } from '@/components/ui/table.tsx';
import { TableFilterValueType } from '@/components/data-table/state.ts';
import { TH } from '@/components/data-table/th.tsx';

const headerStyles = { top: 'var(--o5ui-table-header-top-offset, 0)', background: 'hsl(var(--background))' };

interface DataTableHeaderProps<TData extends Object, TFilterableField extends string = string> {
  filterValues: Record<TFilterableField, TableFilterValueType> | undefined;
  headerGroups: HeaderGroup<TData>[];
  onFilter: OnChangeFn<Record<TFilterableField, TableFilterValueType>> | undefined;
}

export const DataTableHeader = React.memo(
  <TData extends Object, TFilterableField extends string = string>({
    filterValues,
    headerGroups,
    onFilter,
  }: DataTableHeaderProps<TData, TFilterableField>) => {
    return (
      <TableHeader className="sticky top-0 left-0 block z-10" style={headerStyles}>
        {headerGroups.map((headerGroup) => (
          <TableRow className="flex flex-nowrap" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TH
                filterValue={filterValues?.[header.id as TFilterableField]}
                header={header as Header<any, any>}
                key={header.id}
                onFilter={onFilter}
              />
            ))}
          </TableRow>
        ))}
      </TableHeader>
    );
  },
);
