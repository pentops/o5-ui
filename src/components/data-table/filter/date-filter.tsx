import React, { useMemo, useState } from 'react';
import { match } from 'ts-pattern';
import { TableFilterDate, TableFilterValueDate } from '@/components/data-table/state.ts';
import { DatePicker } from '@/components/date-picker/date-picker.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';

function getDate(value: string | undefined, allowTime: boolean | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    if (allowTime) {
      return new Date(value);
    }

    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const date = new Date(value);

    return new Date(date.getTime() + tzOffset);
  } catch {
    return undefined;
  }
}

function formatDate(value: Date | undefined, allowTime: boolean | undefined) {
  if (!value) {
    return undefined;
  }

  const strValue = value.toISOString();

  return allowTime ? strValue : strValue.split('T')[0];
}

interface DateFilterProps extends TableFilterDate {
  id: string;
  onChange: (value: TableFilterValueDate) => void;
  value: TableFilterValueDate | undefined;
}

export function DateFilter({
  allowTime,
  id,
  isFlexible,
  isRange,
  onChange,
  endLabel = 'Max',
  startLabel = 'Min',
  exactLabel = 'Pick a date',
  value,
}: DateFilterProps) {
  const [isFlexibleRange, setIsFlexibleRange] = useState(Boolean(isRange));
  const rangeToggleId = `${id}_range_toggle`;
  const dateValue = useMemo(
    () => ({
      from: getDate(
        match(isFlexibleRange)
          .with(true, () => value?.date?.start)
          .otherwise(() => value?.date?.exact),
        allowTime,
      ),
      to: getDate(value?.date?.end, allowTime),
    }),
    [value?.date, isFlexibleRange, allowTime],
  );

  return (
    <div className="flex flex-col gap-2">
      {match(isFlexibleRange)
        .with(true, () => (
          <div className="flex flex-col gap-2">
            <DatePicker
              type="range"
              endLabel={endLabel}
              onChange={(range) => {
                onChange({
                  date: {
                    start: formatDate(range.from, allowTime),
                    end: formatDate(range.to, allowTime),
                  },
                });
              }}
              startLabel={startLabel}
              value={dateValue}
            />
          </div>
        ))
        .with(false, () => (
          <DatePicker
            type="single"
            label={exactLabel}
            onChange={(date) => {
              onChange({ date: { exact: formatDate(date, allowTime) } });
            }}
            value={dateValue.from}
          />
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
                  onChange({ date: { start: undefined, end: undefined } });
                } else {
                  onChange({ date: { exact: undefined } });
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
