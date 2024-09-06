import type { O5AwsDeployerV1KeyValue } from '@/data/types';

export function deployerKeyValuePairsToJSON(pairs: O5AwsDeployerV1KeyValue[] | undefined) {
  const obj = pairs?.reduce(
    (acc, pair) => {
      return {
        ...acc,
        [pair.name || '']: pair.value || '',
      };
    },
    {} as Record<string, string>,
  );

  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '{}';
  }
}
