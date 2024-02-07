import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { getNextPageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DanteV1DeadMessageQueryServiceListDeadMessages } from '@/data/api/generated';

export const LIST_MESSAGES_KEY: KeyBase = { scope: 'messages', entity: 'list', service: 'DanteService.ListMessages' } as const;

export function useListMessages() {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_MESSAGES_KEY, baseUrl],
    // TODO: paging when implemented in backend
    queryFn: async () => o5DanteV1DeadMessageQueryServiceListDeadMessages(baseUrl),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
