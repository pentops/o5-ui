import React from 'react';
import { match } from 'ts-pattern';
import { TableFilterSelect, TableFilterValueExact, TableFilterValueMultiple } from '@/components/data-table/state.ts';
import { Combobox } from '@/components/combobox/combobox.tsx';
interface SelectFilterProps extends TableFilterSelect {
  id: string;
  onChange: (value: TableFilterValueExact | TableFilterValueMultiple) => void;
  value: TableFilterValueExact | TableFilterValueMultiple | undefined;
}

export function SelectFilter({ label, id, isMultiple = false, searchLabel = 'Search options...', onChange, options, value }: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      {match(isMultiple)
        .with(true, () => (
          <Combobox
            isMulti
            aria-label={label}
            name={id}
            onChange={(e) => {
              onChange({ multiple: e.target.value as unknown as string[] });
            }}
            options={options}
            placeholder={label}
            searchPlaceholder={searchLabel}
            value={(value as TableFilterValueMultiple)?.multiple || []}
          />
        ))
        .with(false, () => (
          <Combobox
            aria-label={label}
            name={id}
            onChange={(e) => {
              onChange({ exact: e.target.value });
            }}
            options={options}
            placeholder={label}
            searchPlaceholder={searchLabel}
            value={(value as TableFilterValueExact)?.exact || ''}
          />
        ))
        .exhaustive()}
    </div>
  );
}
