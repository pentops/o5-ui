import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ServiceListDeploymentEventsRequest, O5DeployerV1ServiceListDeploymentEventsResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';

export const LIST_DEPLOYMENT_EVENTS_KEY: KeyBase = {
  scope: 'deployment_events',
  entity: 'list',
  service: 'DeployerService.ListDeploymentEvents',
} as const;

export async function listDeploymentEvents(baseUrl: string, request: O5DeployerV1ServiceListDeploymentEventsRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceListDeploymentEventsResponse, O5DeployerV1ServiceListDeploymentEventsRequest>(
    ...buildMergedRequestInit('POST', baseUrl, '/deployer/v1/q/deployment/:deploymentId/events', request),
  );
}

export function useListDeploymentEvents(request?: O5DeployerV1ServiceListDeploymentEventsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_DEPLOYMENT_EVENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => listDeploymentEvents(baseUrl, pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
