import React from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { CustomColumnDef } from '@/components/data-table/data-table.tsx';

export function getRowExpander<TData>(): CustomColumnDef<TData> {
  return {
    id: 'expander',
    className: 'justify-center',
    header: () => {
      return <div className="block w-[24px]" />;
    },
    cell: ({ row }) => {
      const isExpanded = row.getIsExpanded();

      return row.getCanExpand() ? (
        <button
          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
          onClick={row.getToggleExpandedHandler()}
          type="button"
          className="content-center justify-center"
        >
          {isExpanded ? <ChevronDownIcon aria-hidden /> : <ChevronRightIcon aria-hidden />}
        </button>
      ) : null;
    },
    size: 24,
    maxSize: 24,
    minSize: 24,
  };
}
