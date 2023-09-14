import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export function getRowExpander<TData>(): ColumnDef<TData> {
  return {
    id: 'expander',
    header: () => <span aria-hidden>&zwnj;</span>,
    cell: ({ row }) => {
      const isExpanded = row.getIsExpanded();

      return row.getCanExpand() ? (
        <button aria-label={isExpanded ? 'Collapse row' : 'Expand row'} onClick={row.getToggleExpandedHandler()} type="button">
          {isExpanded ? <ChevronDownIcon aria-hidden /> : <ChevronRightIcon aria-hidden />}
        </button>
      ) : null;
    },
    maxSize: 15,
  };
}
