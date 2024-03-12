import { getPSMQuerySortsFromTableState, stateToTableColumnSorting, useColumnSort } from '@/components/data-table/sort.ts';
import { useMemo } from 'react';
import { PsmListV1QueryRequest } from '@/data/types';

export function useTableState() {
  const [sortValues, setSortValues] = useColumnSort();
  const psmQuery = useMemo(() => {
    const base: PsmListV1QueryRequest = {};

    if (sortValues && Object.keys(sortValues).length > 0) {
      base.sorts = getPSMQuerySortsFromTableState(stateToTableColumnSorting(sortValues));
    }

    if (!Object.keys(base).length) {
      return undefined;
    }

    return base;
  }, [sortValues]);

  return {
    sortValues,
    setSortValues,
    psmQuery,
  } as const;
}
