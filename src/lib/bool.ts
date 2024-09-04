export function getYesNoOrUndefined(value: boolean | undefined) {
  return value === undefined ? undefined : value ? 'Yes' : 'No';
}
