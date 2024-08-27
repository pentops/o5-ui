import React, { BaseHTMLAttributes } from 'react';

/**
 * style is omitted from Intl.NumberFormatOptions and renamed to formatStyle to prevent a clash with the
 * BaseHTMLAttributes "style" (which would be the CSS style object)
 */
export interface NumberFormatProps extends BaseHTMLAttributes<HTMLSpanElement>, Omit<Intl.NumberFormatOptions, 'style'> {
  formatStyle?: Intl.NumberFormatOptions['style'];
  locale?: string;
  value?: number;
}

export function NumberFormat({
  currency,
  currencySign,
  useGrouping,
  minimumIntegerDigits,
  minimumFractionDigits,
  maximumFractionDigits,
  minimumSignificantDigits,
  maximumSignificantDigits,
  formatStyle,
  locale,
  value,
  ...rest
}: NumberFormatProps) {
  const numberFormatter = new Intl.NumberFormat(locale, {
    style: formatStyle,
    currency,
    currencySign,
    useGrouping,
    minimumIntegerDigits,
    minimumFractionDigits,
    maximumFractionDigits,
    minimumSignificantDigits,
    maximumSignificantDigits,
  });

  return (
    <span className="font-mono" data-number={value?.toString()} {...rest}>
      {value === undefined || Number.isNaN(value) ? '' : numberFormatter.format(value)}
    </span>
  );
}
