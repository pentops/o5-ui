import React, { BaseHTMLAttributes, useEffect, useMemo, useState } from 'react';
import { getRelativeTimeFormatter } from '@/lib/date.ts';

const YEAR = 31560000000;
const APPROXIMATE_MONTH = 2628000000;
const WEEK = 604800000;
const DAY = 86400000;
const HOUR = 3600000;
const MINUTE = 60000;
const SECOND = 1000;

const getDurationWithUnit = (baseDate: Date | string | undefined): [number, Intl.RelativeTimeFormatUnit] | undefined => {
  if (!baseDate) {
    return undefined;
  }

  try {
    if (typeof baseDate === 'string') {
      // eslint-disable-next-line no-param-reassign
      baseDate = new Date(baseDate);
    }
  } catch {
    return undefined;
  }

  // negative diff means baseDate is after _now_
  const diff = baseDate.valueOf() - new Date().valueOf();
  const absDiff = Math.abs(diff);

  // If the diff is greater than or equal to a year, use years
  if (absDiff >= YEAR) {
    return [Math.round(diff / 3.156e10), 'years'];
  }

  // If the diff is greater than or equal to a month, use months
  if (absDiff >= APPROXIMATE_MONTH) {
    return [Math.round(diff / 2.628e9), 'months'];
  }

  // If the diff is greater than or equal to a week, use weeks
  if (absDiff >= WEEK) {
    return [Math.round(diff / 6.048e8), 'weeks'];
  }

  // If the diff is greater than or equal to a day, use days
  if (absDiff >= DAY) {
    return [Math.round(diff / 8.64e7), 'days'];
  }

  // If the diff is greater than or equal to an hour, use hours
  if (absDiff >= HOUR) {
    return [Math.round(diff / 3.6e6), 'hours'];
  }

  // If the diff is greater than or equal to a minute, use minutes
  if (absDiff >= MINUTE) {
    return [Math.round(diff / 60000), 'minutes'];
  }

  // Otherwise, use seconds
  return [Math.round(diff / SECOND), 'seconds'];
};

const buildDurationAndUnitState = (
  providedDuration: number | undefined,
  providedUnit: Intl.RelativeTimeFormatUnit | undefined,
  calculateDurationFromDate: Date | string | undefined,
) => {
  let usableDuration = providedDuration;
  let usableUnit = providedUnit;

  if (!usableDuration || !usableUnit) {
    [usableDuration, usableUnit] = getDurationWithUnit(calculateDurationFromDate) || [];
  }

  return {
    duration: usableDuration,
    unit: usableUnit,
  };
};

/**
 * style is omitted from Intl.RelativeTimeFormatOptions and renamed to formatStyle to prevent a clash with the
 * BaseHTMLAttributes "style" (which would be the CSS style object)
 */
export interface RelativeTimeFormatProps extends BaseHTMLAttributes<HTMLSpanElement>, Omit<Intl.RelativeTimeFormatOptions, 'style'> {
  calculateDurationFromDate?: Date | string;
  formatStyle?: Intl.RelativeTimeFormatStyle;
  unit?: Intl.RelativeTimeFormatUnit;
  value?: number;
  locale?: string;
}

export function RelativeTimeFormat({
  calculateDurationFromDate,
  formatStyle,
  locale = 'default',
  numeric,
  unit: providedUnit,
  value,
  ...rest
}: RelativeTimeFormatProps) {
  const [{ duration, unit }, setDurationAndUnit] = useState(() => buildDurationAndUnitState(value, providedUnit, calculateDurationFromDate));
  const relativeTimeFormatter = useMemo(() => getRelativeTimeFormatter(locale, { numeric, style: formatStyle }), [locale, numeric, formatStyle]);

  const formattedValue = useMemo(() => {
    try {
      if (!duration || !unit) {
        throw new Error('missing duration or unit for relative time formatter');
      }

      return relativeTimeFormatter.format(duration, unit);
    } catch {
      return '';
    }
  }, [relativeTimeFormatter, duration, unit]);

  useEffect(() => {
    setDurationAndUnit(buildDurationAndUnitState(value, providedUnit, calculateDurationFromDate));
  }, [value, providedUnit, calculateDurationFromDate]);

  useEffect(() => {
    let updateIntervalHandle: number;

    if (calculateDurationFromDate) {
      let updateInterval: number;

      switch (unit) {
        case 'day':
        case 'days':
        case 'week':
        case 'weeks':
        case 'month':
        case 'months':
        case 'year':
        case 'years':
          updateInterval = DAY;
          break;
        case 'hour':
        case 'hours':
          updateInterval = HOUR;
          break;
        case 'minute':
        case 'minutes':
          updateInterval = MINUTE;
          break;
        case 'second':
        case 'seconds':
        default:
          updateInterval = SECOND;
          break;
      }

      updateIntervalHandle = window.setInterval(() => {
        const [newDuration, newUnit] = getDurationWithUnit(calculateDurationFromDate) || [];

        setDurationAndUnit({ duration: newDuration, unit: newUnit });
      }, updateInterval);
    }

    return () => {
      if (updateIntervalHandle !== undefined) {
        window.clearInterval(updateIntervalHandle);
      }
    };
  }, [unit, calculateDurationFromDate]);

  return (
    <span data-unit={unit} data-value={duration} {...rest}>
      {formattedValue}
    </span>
  );
}
