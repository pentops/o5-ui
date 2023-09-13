export function getDateFormatter(locale: string = 'default', options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, options);
}

export function getRelativeTimeFormatter(locale: string = 'default', options?: Intl.RelativeTimeFormatOptions) {
  return new Intl.RelativeTimeFormat(locale, options);
}
