import { useCallback, useState } from 'react';
import {
  FilterState,
  FilterValue,
  RangeFilter,
  TableStateOptions as PSMTableStateOptions,
  Updater,
  useTableState as usePSMTableState,
} from '@pentops/react-table-state-psm';
import { match, P } from 'ts-pattern';
import { OnChangeFn } from '@tanstack/react-table';
import { endOfDay, startOfDay } from 'date-fns';

export interface TableFilterValueExact {
  exact: string | undefined;
}

export interface TableFilterValueMultiple {
  multiple: string[];
}

export interface TableFilterValueDate {
  date: { start?: string; end?: string; exact?: string };
}

export interface TableFilterValueRange {
  range: { min?: string; max?: string };
}

export type TableFilterValueType = TableFilterValueExact | TableFilterValueMultiple | TableFilterValueDate | TableFilterValueRange;

export interface TableFilterSelect {
  label?: string;
  options: { label: string; value: string }[];
  searchLabel?: string;
  isMultiple?: boolean;
}

export interface TableFilterNumeric {
  // isFlexible is true if it can be an exact number or a range
  isFlexible?: boolean;
  isRange?: boolean;
  exactLabel?: string;
  minLabel?: string;
  maxLabel?: string;
}

export interface TableFilterDate {
  allowTime?: boolean;
  // isFlexible is true if it can be an exact date or a range
  isFlexible?: boolean;
  isRange?: boolean;
  endLabel?: string;
  exactLabel?: string;
  startLabel?: string;
}

export interface TableFilter {
  type: {
    select?: TableFilterSelect;
    numeric?: TableFilterNumeric;
    date?: TableFilterDate;
  };
}

function mapTableFiltersToPSM(filters: Record<string, TableFilterValueType>): FilterState {
  return [
    {
      inclusion: 'and',
      type: {
        filters: Object.entries(filters).reduce<FilterValue[]>((accum, [k, v]) => {
          const valueType = match(v)
            .with({ date: P.not(P.nullish) }, (dv) => {
              if (dv.date.start || dv.date.end) {
                const range: RangeFilter = {};

                if (dv.date.start) {
                  range.min = dv.date.start.toString();
                }

                if (dv.date.end) {
                  range.max = dv.date.end.toString();
                }

                return { range };
              }

              if (dv.date.exact) {
                // For an exact date, if the date is not a date-time, we actually need to send it as a range from the beginning of the
                // target date to the end of the target date.
                if (!dv.date.exact.includes('T')) {
                  try {
                    const tzOffset = new Date().getTimezoneOffset() * 60000;
                    const rawDate = new Date(dv.date.exact);
                    const start = startOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
                    const end = endOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();

                    return {
                      range: {
                        min: start,
                        max: end,
                      },
                    };
                  } catch {}
                }

                return { exact: dv.date.exact.toString() };
              }

              return undefined;
            })
            .with({ exact: P.not(P.nullish) }, (ev) => ({ exact: ev.exact.toString() }))
            .with({ multiple: P.not(P.nullish) }, (mv) => {
              if (mv.multiple.length) {
                return { in: mv.multiple };
              }

              return undefined;
            })
            .otherwise(() => undefined);

          if (valueType === undefined) {
            return accum;
          }

          return [...accum, { id: k, value: valueType }];
        }, []),
      },
    },
  ];
}

export interface TableStateOptions extends Omit<PSMTableStateOptions, 'initialFilters'> {
  initialFilters?: Record<string, TableFilterValueType>;
  searchFields?: string[];
}

export function useTableState(options?: TableStateOptions) {
  const { initialFilters, initialSearch, initialSort, onFilter, onSearch, onSort, searchFields } = options || {};
  const [basicFilters, setBasicFilters] = useState<Record<string, TableFilterValueType>>(initialFilters || {});
  // Only using one search field for the time being
  const [singleSearchValue, setSingleSearchValue] = useState('');
  const { setFilterValues, sortValues, setSortValues, setSearchValue, psmQuery } = usePSMTableState({
    initialFilters: mapTableFiltersToPSM(basicFilters),
    initialSearch,
    initialSort,
    onFilter,
    onSearch,
    onSort,
  });

  const handleSetSearchValue = useCallback(
    (value: string) => {
      setSingleSearchValue(value);

      setSearchValue(
        searchFields?.map((field) => ({
          id: field,
          value,
        })) || [],
      );
    },
    [searchFields, setSearchValue],
  );

  const handleSetFilterValues: OnChangeFn<Record<string, TableFilterValueType>> = useCallback(
    (updater: Updater<Record<string, TableFilterValueType>>) => {
      const newValues = typeof updater === 'function' ? updater(basicFilters) : updater;

      setBasicFilters(newValues);
      setFilterValues(mapTableFiltersToPSM(newValues));
    },
    [setFilterValues, basicFilters],
  );

  return {
    filterValues: basicFilters,
    setFilterValues: handleSetFilterValues,
    sortValues,
    setSortValues,
    searchValue: singleSearchValue,
    setSearchValue: handleSetSearchValue,
    psmQuery,
  } as const;
}
