import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { match } from 'ts-pattern';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command.tsx';

interface ComboboxProps {
  isMulti?: boolean;
  name: string;
  noMatchesMessage?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  value: string | string[];
}

export function Combobox({
  isMulti = false,
  name,
  noMatchesMessage = 'No matches found.',
  onChange,
  options,
  placeholder = 'Select Option',
  searchPlaceholder = 'Search options...',
  value,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !value && 'text-muted-foreground')}>
          {match(isMulti)
            .with(true, () => (
              <span className="truncate">
                {value?.length ? (value as string[]).map((v) => options.find((option) => option.value === v)?.label).join(', ') : placeholder}
              </span>
            ))
            .with(false, () => <span className="truncate">{value ? options.find((option) => option.value === value)?.label : placeholder}</span>)
            .exhaustive()}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ minWidth: 'var(--radix-popper-anchor-width)' }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandEmpty>{noMatchesMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                value={option.value}
                key={option.value}
                onSelect={() => {
                  onChange({
                    target: {
                      name,
                      value: match(isMulti)
                        .with(true, () => {
                          const valueAsArr = value ? (Array.isArray(value) ? value : [value]) : [];
                          if (valueAsArr.includes(option.value)) {
                            return valueAsArr.filter((v) => v !== option.value);
                          }

                          return [...valueAsArr, option.value];
                        })
                        .with(false, () => option.value)
                        .exhaustive(),
                    },
                  } as React.ChangeEvent<HTMLSelectElement>);

                  if (!isMulti) {
                    setIsOpen(false);
                  }
                }}
              >
                {option.label}
                <CheckIcon
                  className={cn('ml-auto h-4 w-4', (isMulti && value.includes(option.value)) || value === option.value ? 'opacity-100' : 'opacity-0')}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
