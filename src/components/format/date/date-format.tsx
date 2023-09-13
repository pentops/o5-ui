import React, { BaseHTMLAttributes } from 'react';
import { getDateFormatter } from '@/lib/date.ts';

export interface DateFormatProps extends BaseHTMLAttributes<HTMLTimeElement>, Intl.DateTimeFormatOptions {
  value?: string | number | Date;
  locale?: string;
}

const getDateString = (value: DateFormatProps['value']): string | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    const valueAsDate = new Date(value);

    return valueAsDate.toISOString();
  } catch {
    return undefined;
  }
};

const safelyFormatValue = (formatter: Intl.DateTimeFormat, value: DateFormatProps['value']): string => {
  if (!value) {
    return '';
  }

  try {
    const dateFromValue = new Date(value);
    return formatter.format(dateFromValue);
  } catch {
    return '';
  }
};

export function DateFormat({ hour, minute, day, month, year, second, value, timeZoneName, locale = 'default', ...rest }: DateFormatProps) {
  const dateFormatter = getDateFormatter(locale, {
    hour,
    minute,
    day,
    month,
    year,
    second,
    timeZoneName,
  });

  return (
    <time dateTime={getDateString(value)} {...rest}>
      {safelyFormatValue(dateFormatter, value)}
    </time>
  );
}
