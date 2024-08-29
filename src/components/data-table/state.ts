import { useCallback, useState } from 'react';
import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import { match, P } from 'ts-pattern';
import {
  ExtractFilterField,
  ExtractSearchField,
  ExtractSortField,
  FilterState,
  FilterValue,
  RangeFilter,
  SearchState,
  SortingState,
  TableStateOptions as PSMTableStateOptions,
  Updater,
  useTableState as usePSMTableState,
} from '@pentops/react-table-state-psm';
import { OnChangeFn } from '@tanstack/react-table';
import { J5ListV1QueryRequest } from '@/data/types';
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

function mapTableFiltersToPSM<TFilterField extends string = never>(filters: Record<TFilterField, TableFilterValueType>): FilterState<TFilterField> {
  const filterValues: FilterValue<TFilterField>[] = [];

  for (const filterId in filters) {
    const filterValue: TableFilterValueType = filters[filterId];

    const valueType = match(filterValue)
      .returnType<FilterValue<TFilterField>['value'] | undefined>()
      .with({ date: P.not(P.nullish) }, (dv) => {
        const tzOffset = new Date().getTimezoneOffset() * 60000;

        if (dv.date.start || dv.date.end) {
          const range: RangeFilter = {};

          if (dv.date.start) {
            if (dv.date.start.includes('T')) {
              range.min = dv.date.start.toString();
            } else {
              const rawDate = new Date(dv.date.start);
              const start = startOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
              range.min = start.toString();
            }
          }

          if (dv.date.end) {
            if (dv.date.end.includes('T')) {
              range.max = dv.date.end.toString();
            } else {
              const rawDate = new Date(dv.date.end);
              const end = endOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
              range.max = end.toString();
            }
          }

          return { range };
        }

        if (dv.date.exact) {
          // For an exact date, if the date is not a date-time, we actually need to send it as a range from the beginning of the
          // target date to the end of the target date.
          if (!dv.date.exact.includes('T')) {
            try {
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

    if (valueType !== undefined) {
      filterValues.push({ id: filterId, value: valueType });
    }
  }

  return [
    {
      inclusion: 'and',
      type: {
        filters: filterValues,
      },
    },
  ];
}

function buildInitialState<T extends J5ListV1QueryRequest<ExtractSearchField<T>, ExtractSortField<T>, ExtractFilterField<T>> | undefined>(
  searchString: string | undefined,
  initialFilters: Record<ExtractFilterField<T>, TableFilterValueType> | undefined,
  initialSearch: SearchState<ExtractSearchField<T>> | undefined,
  initialSort: SortingState<ExtractSortField<T>> | undefined,
) {
  const fromSearchString = searchString ? qs.parse(searchString) : {};

  return {
    initialFilters: { ...(fromSearchString as any)?.filter, ...initialFilters } as Record<ExtractFilterField<T>, TableFilterValueType>,
    initialSearch: (initialSearch || fromSearchString?.search) as SearchState<ExtractSearchField<T>>,
    initialSort: (initialSort || fromSearchString?.sort) as SortingState<ExtractSortField<T>>,
  };
}

export interface TableStateOptions<T extends J5ListV1QueryRequest<ExtractSearchField<T>, ExtractSortField<T>, ExtractFilterField<T>> | undefined>
  extends Omit<PSMTableStateOptions<T>, 'initialFilters'> {
  initialFilters?: Record<ExtractFilterField<T>, TableFilterValueType>;
  initialSearchFields?: ExtractSearchField<T>[];
}

export function useTableState<T extends J5ListV1QueryRequest<ExtractSearchField<T>, ExtractSortField<T>, ExtractFilterField<T>> | undefined>(
  options?: TableStateOptions<T>,
) {
  const [searchParams] = useSearchParams();
  const { onFilter, onSearch, onSort, initialSearchFields } = options || {};
  const [searchFields, setSearchFields] = useState<ExtractSearchField<T>[]>(initialSearchFields || []);
  const { initialFilters, initialSearch, initialSort } = buildInitialState(
    searchParams.toString(),
    options?.initialFilters,
    options?.initialSearch,
    options?.initialSort,
  );
  const [basicFilters, setBasicFilters] = useState<Record<ExtractFilterField<T>, TableFilterValueType>>(
    initialFilters || ({} as Record<ExtractFilterField<T>, TableFilterValueType>),
  );
  // Only using one search field for the time being
  const [singleSearchValue, setSingleSearchValue] = useState('');
  const { setFilterValues, sortValues, setSortValues, setSearchValue, psmQuery } = usePSMTableState<T>({
    initialFilters: mapTableFiltersToPSM(basicFilters),
    initialSearch,
    initialSort,
    onFilter,
    onSearch,
    onSort,
  });

  const handleSetSearchValue: OnChangeFn<string> = useCallback(
    (updater: Updater<string>) => {
      const newValue = typeof updater === 'function' ? updater(singleSearchValue) : updater;
      setSingleSearchValue(newValue);

      setSearchValue(
        searchFields?.map((field) => ({
          id: field,
          value: newValue,
        })) || [],
      );
    },
    [searchFields, setSearchValue, singleSearchValue],
  );

  const handleSetSearchFields = useCallback(
    (newSearchFields: ExtractSearchField<T>[]) => {
      setSearchFields(newSearchFields);

      setSearchValue(
        newSearchFields?.map((field) => ({
          id: field,
          value: singleSearchValue,
        })),
      );
    },
    [singleSearchValue, setSearchValue],
  );

  const handleSetFilterValues: OnChangeFn<Record<ExtractFilterField<T>, TableFilterValueType>> = useCallback(
    (updater: Updater<Record<ExtractFilterField<T>, TableFilterValueType>>) => {
      const newValues = typeof updater === 'function' ? updater(basicFilters) : updater;

      setBasicFilters(newValues);
      setFilterValues(mapTableFiltersToPSM<ExtractFilterField<T>>(newValues));
    },
    [setFilterValues, basicFilters],
  );

  // useEffect(() => {
  //   setSearchParams(qs.stringify({ sort: sortValues, filter: basicFilters, search: singleSearchValue || undefined }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortValues, basicFilters, singleSearchValue]);

  return {
    filterValues: basicFilters,
    setFilterValues: handleSetFilterValues,
    sortValues,
    setSortValues,
    searchValue: singleSearchValue,
    setSearchValue: handleSetSearchValue,
    searchFields,
    setSearchFields: handleSetSearchFields,
    psmQuery,
  } as const;
}
