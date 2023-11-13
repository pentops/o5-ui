import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { O5DanteV1ListMessagesRequest, O5DanteV1ListMessagesResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';

export const LIST_MESSAGES_KEY: KeyBase = { scope: 'messages', entity: 'list', service: 'DanteService.ListMessages' } as const;

export async function listMessages(baseUrl: string, request: O5DanteV1ListMessagesRequest | undefined) {
  const { path } = buildBoundPath('GET', `${baseUrl}/dante/v1/messages`, request);

  return makeRequest<O5DanteV1ListMessagesResponse>('GET', path);
}

export function useListMessages(request?: O5DanteV1ListMessagesRequest) {
  return useInfiniteQuery({
    queryKey: [LIST_MESSAGES_KEY],
    queryFn: async () => listMessages('', request),
    getNextPageParam,
    initialPageParam: undefined,
  });
}
