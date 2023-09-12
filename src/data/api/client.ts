import { APIError } from '@/data/api/error.ts';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function processResponse<TRes>(rawResponse: Response): Promise<TRes> {
  switch (rawResponse.headers.get('Content-Type')) {
    case 'application/json':
      return (await rawResponse.json()) as Promise<TRes>;
    case 'application/pdf':
      return (await rawResponse.blob()) as unknown as Promise<TRes>;
    default:
      return (await rawResponse.text()) as unknown as Promise<TRes>;
  }
}

export interface TypedRequestInit<TReqBody> extends Omit<RequestInit, 'body'> {
  body: TReqBody;
}

export interface KeyBase {
  service: string;
  scope: string;
  entity?: 'list' | 'detail';
}

export async function makeRequest<TRes, TReqBody = undefined>(
  method: HTTPMethod,
  path: string,
  request?: TypedRequestInit<TReqBody>,
): Promise<TRes | undefined> {
  const { body, headers, ...requestInit } = request || {};

  const requestOptions: RequestInit = {
    method,
    credentials: 'include',
    mode: 'cors',
    ...requestInit,
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    }),
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(path, requestOptions);

  const responseBody = await processResponse<TRes>(response);

  if (!response.ok) {
    throw new APIError(response.status, `${method}:${path}`, responseBody);
  }

  return responseBody;
}
