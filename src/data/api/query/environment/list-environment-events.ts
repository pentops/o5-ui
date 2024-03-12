import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ListEnvironmentEventsRequest } from '@/data/types';
import { getNextPageParam, mergePageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceListEnvironmentEvents } from '@/data/api/generated';

export const LIST_ENVIRONMENT_EVENTS_KEY: KeyBase = {
  scope: 'environment_events',
  entity: 'list',
  service: 'DeployerService.ListEnvironmentEvents',
} as const;

export function useListEnvironmentEvents(request?: O5DeployerV1ListEnvironmentEventsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_ENVIRONMENT_EVENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => o5DeployerV1DeploymentQueryServiceListEnvironmentEvents(baseUrl, mergePageParam(request, pageParam)),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
