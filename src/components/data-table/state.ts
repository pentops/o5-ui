import { useCallback, useState } from 'react';
import {
  ExtractFilterField,
  ExtractSearchField,
  ExtractSortField,
  FilterState,
  TableStateOptions as PSMTableStateOptions,
  Updater,
  useTableState as usePSMTableState,
} from '@pentops/react-table-state-psm';
import { OnChangeFn } from '@tanstack/react-table';
import { J5ListV1QueryRequest } from '@/data/types';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mapTableFiltersToPSM<TFilterField extends string = never>(_filters: Record<string, TableFilterValueType>): FilterState<TFilterField> {
  return [];
  // return [
  //   {
  //     inclusion: 'and',
  //     type: {
  //       filters: Object.entries(filters).reduce<FilterValue[]>((accum, [k, v]) => {
  //         const tzOffset = new Date().getTimezoneOffset() * 60000;
  //
  //         const valueType = match(v)
  //           .with({ date: P.not(P.nullish) }, (dv) => {
  //             if (dv.date.start || dv.date.end) {
  //               const range: RangeFilter = {};
  //
  //               if (dv.date.start) {
  //                 if (dv.date.start.includes('T')) {
  //                   range.min = dv.date.start.toString();
  //                 } else {
  //                   const rawDate = new Date(dv.date.start);
  //                   const start = startOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
  //                   range.min = start.toString();
  //                 }
  //               }
  //
  //               if (dv.date.end) {
  //                 if (dv.date.end.includes('T')) {
  //                   range.max = dv.date.end.toString();
  //                 } else {
  //                   const rawDate = new Date(dv.date.end);
  //                   const end = endOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
  //                   range.max = end.toString();
  //                 }
  //               }
  //
  //               return { range };
  //             }
  //
  //             if (dv.date.exact) {
  //               // For an exact date, if the date is not a date-time, we actually need to send it as a range from the beginning of the
  //               // target date to the end of the target date.
  //               if (!dv.date.exact.includes('T')) {
  //                 try {
  //                   const rawDate = new Date(dv.date.exact);
  //                   const start = startOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
  //                   const end = endOfDay(new Date(rawDate.getTime() + tzOffset)).toISOString();
  //
  //                   return {
  //                     range: {
  //                       min: start,
  //                       max: end,
  //                     },
  //                   };
  //                 } catch {}
  //               }
  //
  //               return { exact: dv.date.exact.toString() };
  //             }
  //
  //             return undefined;
  //           })
  //           .with({ exact: P.not(P.nullish) }, (ev) => ({ exact: ev.exact.toString() }))
  //           .with({ multiple: P.not(P.nullish) }, (mv) => {
  //             if (mv.multiple.length) {
  //               return { in: mv.multiple };
  //             }
  //
  //             return undefined;
  //           })
  //           .otherwise(() => undefined);
  //
  //         if (valueType === undefined) {
  //           return accum;
  //         }
  //
  //         return [...accum, { id: k, value: valueType }];
  //       }, []),
  //     },
  //   },
  // ];
}

// function buildInitialState(
//   searchString: string | undefined,
//   initialFilters: Record<string, TableFilterValueType> | undefined,
//   initialSearch: SearchState | undefined,
//   initialSort: SortingState | undefined,
// ) {
//   const fromSearchString = searchString ? qs.parse(searchString) : {};
//
//   return {
//     initialFilters: { ...(fromSearchString as any)?.filter, ...initialFilters } as Record<string, TableFilterValueType>,
//     initialSearch: (initialSearch || fromSearchString?.search) as SearchState,
//     initialSort: (initialSort || fromSearchString?.sort) as SortingState,
//   };
// }

export interface TableStateOptions<T extends J5ListV1QueryRequest<ExtractSearchField<T>, ExtractSortField<T>, ExtractFilterField<T>> | undefined>
  extends Omit<PSMTableStateOptions<T>, 'initialFilters'> {
  initialFilters?: Record<ExtractFilterField<T>, TableFilterValueType>;
  initialSearchFields?: ExtractSearchField<T>[];
}

export function useTableState<T extends J5ListV1QueryRequest<ExtractSearchField<T>, ExtractSortField<T>, ExtractFilterField<T>> | undefined>(
  options?: TableStateOptions<T>,
) {
  // const [searchParams, setSearchParams] = useSearchParams();
  const { initialFilters, initialSearch, initialSort, onFilter, onSearch, onSort, initialSearchFields } = options || {};
  const [searchFields, setSearchFields] = useState<ExtractSearchField<T>[]>(initialSearchFields || []);
  // const { initialFilters, initialSearch, initialSort } = buildInitialState(
  //   searchParams.toString(),
  //   options?.initialFilters,
  //   options?.initialSearch,
  //   options?.initialSort,
  // );
  const [basicFilters, setBasicFilters] = useState<Record<ExtractFilterField<T>, TableFilterValueType>>(
    initialFilters || ({} as Record<ExtractFilterField<T>, TableFilterValueType>),
  );
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

  const handleSetFilterValues: OnChangeFn<Record<string, TableFilterValueType>> = useCallback(
    (updater: Updater<Record<string, TableFilterValueType>>) => {
      const newValues = typeof updater === 'function' ? updater(basicFilters) : updater;

      setBasicFilters(newValues);
      setFilterValues(mapTableFiltersToPSM(newValues));
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
