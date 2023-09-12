import { stringify } from 'qs';
import { HTTPMethod } from '@/data/api/client.ts';

function prepareParameters(params: any | undefined): any {
  if (!params || params === '' || params === undefined || params === null) {
    return null;
  }

  if (Array.isArray(params)) {
    return params.reduce((accum, curr) => {
      const prepared = prepareParameters(curr);
      if (prepared) {
        accum.push(prepared);
      }

      return accum;
    }, []);
  }

  if (params instanceof Date) {
    return params;
  }

  if (typeof params === 'object') {
    return Object.entries(params || {}).reduce(
      (accum, [k, v]) => {
        if (!['', null, undefined].includes(v as any)) {
          return { ...accum, [k]: prepareParameters(v) };
        }

        return accum;
      },
      {} as Record<string, any>,
    );
  }

  return params;
}

function buildSearchString(params: any | undefined): string {
  return stringify(prepareParameters(params), { addQueryPrefix: true, arrayFormat: 'comma', allowDots: true, skipNulls: true });
}

interface BoundPathResult {
  path: string;
  body?: any;
}

export function buildBoundPath(method: HTTPMethod, unboundPath: string, params?: any, pathParameters?: readonly string[]): BoundPathResult {
  const paramCopy = JSON.parse(JSON.stringify(params || {}));
  let boundPath = unboundPath;

  if (params) {
    pathParameters?.forEach((unboundPathParameter) => {
      boundPath = boundPath.replace(`:${unboundPathParameter}`, paramCopy[unboundPathParameter] || '');
      delete paramCopy[unboundPathParameter];
    });
  }

  if (method === 'GET') {
    return { path: `${boundPath}${buildSearchString(paramCopy)}` };
  }

  return { path: boundPath, body: paramCopy };
}
