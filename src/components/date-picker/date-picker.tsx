import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateFormat } from '@/components/format/date/date-format.tsx';

interface DatePickerProps {
  // allowRange?: boolean;
  setStart: (date: Date | undefined) => void;
  start: Date | undefined;
}

export function DatePicker({ setStart, start }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={cn('w-[280px] justify-start text-left font-normal', !start && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {start ? <DateFormat value={start} /> : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={start} onSelect={setStart} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
