import * as React from 'react';
import { match, P } from 'ts-pattern';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateFormat } from '@/components/format/date/date-format.tsx';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  type: 'range';
  endLabel?: string;
  startLabel?: string;
  onChange: (range: DateRange) => void;
  value: DateRange | undefined;
}

interface SingleDatePickerProps {
  type: 'single';
  label?: string;
  onChange: (date: Date | undefined) => void;
  value: Date | undefined;
}

export function DatePicker(props: DateRangePickerProps | SingleDatePickerProps) {
  const hasValue = match(props)
    .with({ type: 'single' }, (p) => Boolean(p.value))
    .with({ type: 'range' }, (p) => Boolean(p.value?.to || p.value?.from))
    .exhaustive();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn('w-full grid gap-2', props.type === 'range' ? 'grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1')}>
          {match(props)
            .with({ type: 'range' }, (p) => (
              <>
                <Button
                  aria-label={p.startLabel}
                  variant="outline"
                  className={cn('justify-start text-left font-normal', !hasValue && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {match(p)
                    .with({ value: { from: P.not(P.nullish) } }, (p) => <DateFormat value={p.value.from} />)
                    .otherwise((p) => (
                      <span>{p.startLabel || 'Start'}</span>
                    ))}
                </Button>

                <Button
                  aria-label={p.endLabel}
                  variant="outline"
                  className={cn('justify-start text-left font-normal', !hasValue && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {match(p)
                    .with({ value: { to: P.not(P.nullish) } }, (p) => <DateFormat value={p.value.to} />)
                    .otherwise((p) => (
                      <span>{p.endLabel || 'End'}</span>
                    ))}
                </Button>
              </>
            ))
            .with({ type: 'single' }, (p) => (
              <Button variant="outline" className={cn('justify-start text-left font-normal', !hasValue && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {match(p)
                  .with({ value: P.not(P.nullish) }, () => <DateFormat value={p.value} />)
                  .otherwise((p) => (
                    <span>{p.label || 'Pick a date'}</span>
                  ))}
              </Button>
            ))
            .exhaustive()}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {match(props)
          .with({ type: 'single' }, (p) => (
            <Calendar initialFocus className="flex justify-center" mode="single" selected={p.value} onSelect={p.onChange} />
          ))
          .with({ type: 'range' }, (p) => (
            <Calendar
              initialFocus
              className="flex justify-center"
              mode="range"
              numberOfMonths={2}
              selected={p.value}
              onSelect={(range) => {
                if (!range) {
                  p.onChange({ from: undefined, to: undefined });
                  return;
                }

                p.onChange({ from: range.from, to: range.to });
              }}
            />
          ))
          .exhaustive()}
      </PopoverContent>
    </Popover>
  );
}
