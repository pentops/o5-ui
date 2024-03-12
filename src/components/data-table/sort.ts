import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SortingState, OnChangeFn, Updater } from '@tanstack/react-table';
import { PsmListV1Sort } from '@/data/types';

export type TableColumnSortDirection = 'desc' | 'asc';
export type TableColumnSorting = Record<string, TableColumnSortDirection>;

export function stateToTableColumnSorting(state: SortingState = []): TableColumnSorting {
  return state.reduce(
    (accum, curr) =>
      ({
        ...accum,
        [curr.id]: curr.desc ? 'desc' : 'asc',
      }) as TableColumnSorting,
    {} as TableColumnSorting,
  );
}

export function useColumnSort(
  controlledColumnSort?: SortingState,
  onColumnSort?: OnChangeFn<SortingState>,
): [SortingState, OnChangeFn<SortingState>] {
  const hasUserUpdatedRef = useRef(false);
  const [state, setState] = useState<SortingState>(controlledColumnSort || []);
  const handleColumnSortChange: OnChangeFn<SortingState> = useCallback(
    (updater: Updater<SortingState>) => {
      const result = typeof updater === 'function' ? updater(state) : updater;
      setState(result);

      hasUserUpdatedRef.current = true;

      if (onColumnSort) {
        onColumnSort(result);
      }

      return result;
    },
    [state, onColumnSort],
  );

  useEffect(() => {
    if (!hasUserUpdatedRef.current) {
      setState(controlledColumnSort || []);
    }
  }, [controlledColumnSort]);

  return useMemo(() => [state, handleColumnSortChange], [state, handleColumnSortChange]);
}

export function getPSMQuerySortsFromTableState(tableSorts: TableColumnSorting | undefined): PsmListV1Sort[] | undefined {
  if (!tableSorts || !Object.keys(tableSorts).length) {
    return undefined;
  }

  return Object.entries(tableSorts).map(([field, direction]) => ({
    field,
    descending: direction === 'desc',
  }));
}
