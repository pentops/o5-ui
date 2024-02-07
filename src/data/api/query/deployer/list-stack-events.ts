import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ListStackEventsRequest } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceListStackEvents } from '@/data/api/generated';

export const LIST_STACK_EVENTS_KEY: KeyBase = { scope: 'stack_events', entity: 'list', service: 'DeployerService.ListStackEvents' } as const;

export function useListStackEvents(request?: O5DeployerV1ListStackEventsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_STACK_EVENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) =>
      o5DeployerV1DeploymentQueryServiceListStackEvents(baseUrl, pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
