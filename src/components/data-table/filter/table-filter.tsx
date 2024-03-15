import React, { useState } from 'react';
import { match, P } from 'ts-pattern';
import {
  TableFilter as TableFilterType,
  TableFilterValueDate,
  TableFilterValueExact,
  TableFilterValueMultiple,
  TableFilterValueRange,
  TableFilterValueType,
} from '@/components/data-table/state.ts';
import { Button } from '@/components/ui/button.tsx';
import { DateFilter } from '@/components/data-table/filter/date-filter.tsx';
import { OnChangeFn } from '@tanstack/react-table';
import { NumericFilter } from '@/components/data-table/filter/numeric-filter.tsx';
import { SelectFilter } from '@/components/data-table/filter/select-filter.tsx';

interface TableFilterProps extends TableFilterType {
  id: string;
  onChange: OnChangeFn<Record<string, TableFilterValueType>>;
  onClose: () => void;
}

export function TableFilter({ id, onChange, onClose, type }: TableFilterProps) {
  const [prospectiveValue, setProspectiveValue] = useState<TableFilterValueType | undefined>();

  return (
    <div className="flex flex-col gap-2">
      {match(type)
        .with({ date: P.not(P.nullish) }, (f) => (
          <DateFilter id={id} onChange={setProspectiveValue} value={prospectiveValue as TableFilterValueDate} {...f.date} />
        ))
        .with({ numeric: P.not(P.nullish) }, (f) => (
          <NumericFilter
            id={id}
            onChange={setProspectiveValue}
            value={prospectiveValue as TableFilterValueRange | TableFilterValueExact}
            {...f.numeric}
          />
        ))
        .with({ select: P.not(P.nullish) }, (f) => (
          <SelectFilter
            id={id}
            onChange={setProspectiveValue}
            value={prospectiveValue as TableFilterValueMultiple | TableFilterValueExact}
            {...f.select}
          />
        ))
        .otherwise(() => null)}
      <div className="grid grid-cols-2 gap-2">
        <Button
          disabled={!prospectiveValue}
          onClick={() => {
            if (prospectiveValue) {
              const clearedValue: TableFilterValueType | undefined = match(type)
                .with({ date: P.not(P.nullish) }, () => ({ date: {} }))
                .with({ numeric: P.not(P.nullish) }, (p) => (p.numeric.isRange ? { range: {} } : { exact: '' }))
                .with({ select: P.not(P.nullish) }, (p) => (p.select.isMultiple ? { multiple: [] } : { exact: '' }))
                .otherwise(() => undefined);

              if (clearedValue) {
                onChange((prevState) => ({ ...prevState, [id]: clearedValue }));
                setProspectiveValue(undefined);
              }

              onClose();
            }
          }}
          variant="destructive"
        >
          Clear
        </Button>
        <Button
          disabled={!prospectiveValue}
          onClick={() => {
            if (prospectiveValue) {
              onChange((prevState) => ({ ...prevState, [id]: prospectiveValue }));
              onClose();
            }
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
