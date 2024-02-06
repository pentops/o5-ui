import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1ServiceListDeadMessagesRequest, O5DanteV1ServiceListDeadMessagesResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';

export const LIST_MESSAGES_KEY: KeyBase = { scope: 'messages', entity: 'list', service: 'DanteService.ListMessages' } as const;

export async function listMessages(baseUrl: string, request: O5DanteV1ServiceListDeadMessagesRequest | undefined) {
  return makeRequest<O5DanteV1ServiceListDeadMessagesResponse, O5DanteV1ServiceListDeadMessagesRequest>(
    ...buildMergedRequestInit('GET', baseUrl, '/dante/v1/q/messages', request),
  );
}

export function useListMessages(request?: O5DanteV1ServiceListDeadMessagesRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_MESSAGES_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => listMessages(baseUrl, pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
