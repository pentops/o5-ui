import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1ListDeadMessageEventsRequest } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DanteV1DeadMessageQueryServiceListDeadMessageEvents } from '@/data/api/generated';
import { getNextPageParam, mergePageParam } from '@/data/api/pagination.ts';

export const LIST_MESSAGE_EVENTS_KEY: KeyBase = { scope: 'message_events', entity: 'list', service: 'DanteService.ListMessageEvents' } as const;

export function useListMessageEvents(request?: O5DanteV1ListDeadMessageEventsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_MESSAGE_EVENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => o5DanteV1DeadMessageQueryServiceListDeadMessageEvents(baseUrl, mergePageParam(request, pageParam)),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
