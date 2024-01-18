import { stringify } from 'qs';
import { HTTPMethod, TypedRequestInit } from '@/data/api/client.ts';

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

export function buildSearchString(params: any | undefined): string {
  return stringify(prepareParameters(params), { addQueryPrefix: true, arrayFormat: 'comma', allowDots: true, skipNulls: true });
}

export function buildRequestInit<TReq = undefined>(
  method: HTTPMethod,
  basePath: string,
  unboundPath: string,
  params?: TReq,
  requestInit?: RequestInit,
): [HTTPMethod, string, TypedRequestInit<TReq> | undefined] {
  const paramCopy = JSON.parse(JSON.stringify(params || {}));
  let pathname = unboundPath;

  if (basePath) {
    pathname = new URL(unboundPath, basePath).pathname;
  }

  const urlSegments = pathname.split('/');

  for (let i = 0; i < urlSegments.length; i += 1) {
    const segment = urlSegments[i];
    if (segment.startsWith(':')) {
      const key = segment.slice(1);
      urlSegments[i] = paramCopy[key];
      delete paramCopy[key];
    }
  }

  const fullPath = `${basePath}${urlSegments.join('/')}`;

  if (method === 'GET') {
    return [method, `${fullPath}${buildSearchString(paramCopy)}`, requestInit as TypedRequestInit<TReq>];
  }

  return [method, fullPath, { ...(requestInit || {}), body: paramCopy }];
}
