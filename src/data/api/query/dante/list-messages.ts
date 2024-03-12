import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { getNextPageParam, mergePageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DanteV1DeadMessageQueryServiceListDeadMessages } from '@/data/api/generated';
import { O5DanteV1ListDeadMessagesRequest } from '@/data/types';

export const LIST_MESSAGES_KEY: KeyBase = { scope: 'messages', entity: 'list', service: 'DanteService.ListMessages' } as const;

export function useListMessages(request?: O5DanteV1ListDeadMessagesRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_MESSAGES_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => o5DanteV1DeadMessageQueryServiceListDeadMessages(baseUrl, mergePageParam(request, pageParam)),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
