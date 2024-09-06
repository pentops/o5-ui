import React, { useCallback, useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input.tsx';
import { Combobox } from '@/components/combobox/combobox.tsx';
import { BaseTableSearch } from '@pentops/react-table-state-psm';

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T> | Error>((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const output = callback(...args);
          resolve(output);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  };
}

function tableSearchesToSelectOptions<T extends string>(searches: BaseTableSearch<T>[]): { label: string; value: T }[] {
  return searches.map((search) => ({
    label: search.label,
    value: search.id,
  }));
}

export type OnSearchFieldChange<TSearchableField extends string> = (fields: TSearchableField[]) => void;

interface DataTableSearchProps<TSearchableField extends string = string> {
  fields?: BaseTableSearch<TSearchableField>[];
  fieldSelections?: TSearchableField[];
  onSearch: (searchValue: string) => void;
  onSearchFieldChange?: OnSearchFieldChange<TSearchableField>;
  searchValue: string;
}

export const DataTableSearch = React.memo(
  <TSearchableField extends string = string>({
    fields,
    fieldSelections,
    onSearch,
    onSearchFieldChange,
    searchValue,
  }: DataTableSearchProps<TSearchableField>) => {
    const options = useMemo(() => tableSearchesToSelectOptions(fields || []), [fields]);
    const [internalValue, setInternalValue] = useState(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce(onSearch, 250), [onSearch]);
    const handleSearch = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.target.value);
        await debouncedSearch(e.target.value);
      },
      [debouncedSearch],
    );

    return (
      <div className="flex flex-row gap-2 flex-nowrap justify-between pb-2">
        <div className="relative flex-grow flex-shrink-0">
          <MagnifyingGlassIcon aria-hidden className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-[2rem]"
            onChange={handleSearch}
            placeholder="Search"
            type="search"
            value={internalValue}
          />
        </div>

        {fields && onSearchFieldChange && (
          <div>
            <Combobox
              isMulti
              name="searchFields"
              onChange={(e) => {
                onSearchFieldChange(e.target.value as unknown as TSearchableField[]);
              }}
              options={options}
              value={fieldSelections || []}
            />
          </div>
        )}
      </div>
    );
  },
);
