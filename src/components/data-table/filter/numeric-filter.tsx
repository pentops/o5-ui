import React, { useState } from 'react';
import { match } from 'ts-pattern';
import { TableFilterNumeric, TableFilterValueExact, TableFilterValueRange } from '@/components/data-table/state.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
interface NumericFilterProps extends TableFilterNumeric {
  id: string;
  onChange: (value: TableFilterValueExact | TableFilterValueRange) => void;
  value: TableFilterValueExact | TableFilterValueRange | undefined;
}

export function NumericFilter({
  exactLabel = 'Value',
  id,
  isFlexible,
  isRange,
  minLabel = 'Min',
  maxLabel = 'Max',
  onChange,
  value,
}: NumericFilterProps) {
  const [isFlexibleRange, setIsFlexibleRange] = useState(Boolean(isRange));
  const rangeToggleId = `${id}_range_toggle`;

  return (
    <div className="flex flex-col gap-2">
      {match(isFlexibleRange)
        .with(true, () => (
          <div className="w-full grid gap-2 grid-cols-1 md:grid-cols-2">
            <Label>
              <span className="block pb-1">{minLabel}</span>

              <Input
                onChange={(e) => {
                  onChange({ range: { ...(value as TableFilterValueRange)?.range, min: e.target.value || undefined } });
                }}
                value={(value as TableFilterValueRange)?.range?.min || ''}
              />
            </Label>

            <Label>
              <span className="block pb-1">{maxLabel}</span>

              <Input
                onChange={(e) => {
                  onChange({ range: { ...(value as TableFilterValueRange)?.range, max: e.target.value || undefined } });
                }}
                value={(value as TableFilterValueRange)?.range?.max || ''}
              />
            </Label>
          </div>
        ))
        .with(false, () => (
          <Label>
            <span className="block pb-1">{exactLabel}</span>

            <Input
              onChange={(e) => {
                onChange({ exact: e.target.value || undefined });
              }}
              value={(value as TableFilterValueExact)?.exact || ''}
            />
          </Label>
        ))
        .exhaustive()}

      {isFlexible && (
        <div className="items-top flex space-x-2">
          <Checkbox
            id={rangeToggleId}
            checked={isFlexibleRange}
            onCheckedChange={(checked) => {
              if (checked !== 'indeterminate') {
                setIsFlexibleRange(checked);

                if (checked) {
                  onChange({ range: { min: undefined, max: undefined } });
                } else {
                  onChange({ exact: undefined });
                }
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor={rangeToggleId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Range
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
