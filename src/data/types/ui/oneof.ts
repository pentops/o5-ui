export function getOneOfType<T extends Record<string, any>>(oneOf: T | undefined): keyof T | undefined {
  if (!oneOf) {
    return undefined;
  }

  return Object.keys(oneOf)[0] as keyof T;
}
