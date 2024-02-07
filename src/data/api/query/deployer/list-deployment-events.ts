import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ListDeploymentEventsRequest } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceListDeploymentEvents } from '@/data/api/generated';

export const LIST_DEPLOYMENT_EVENTS_KEY: KeyBase = {
  scope: 'deployment_events',
  entity: 'list',
  service: 'DeployerService.ListDeploymentEvents',
} as const;

export function useListDeploymentEvents(request?: O5DeployerV1ListDeploymentEventsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_DEPLOYMENT_EVENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) =>
      o5DeployerV1DeploymentQueryServiceListDeploymentEvents(baseUrl, pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
