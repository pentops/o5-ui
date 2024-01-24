import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DeployerV1ServiceListStackEventsRequest, O5DeployerV1ServiceListStackEventsResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';

export const LIST_STACK_EVENTS_KEY: KeyBase = { scope: 'stack_events', entity: 'list', service: 'DeployerService.ListStackEvents' } as const;

export async function listStackEvents(baseUrl: string, request: O5DeployerV1ServiceListStackEventsRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceListStackEventsResponse, O5DeployerV1ServiceListStackEventsRequest>(
    ...buildRequestInit('POST', baseUrl, '/deployer/v1/q/stack/:stackId/events', request),
  );
}

export function useListStackEvents(request?: O5DeployerV1ServiceListStackEventsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_STACK_EVENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => listStackEvents(baseUrl, pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
