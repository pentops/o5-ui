import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DeployerV1ServiceListDeploymentEventsRequest, O5DeployerV1ServiceListDeploymentEventsResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';

export const LIST_DEPLOYMENT_EVENTS_KEY: KeyBase = {
  scope: 'deployment_events',
  entity: 'list',
  service: 'DeployerService.ListDeploymentEvents',
} as const;

export async function listDeploymentEvents(baseUrl: string, request: O5DeployerV1ServiceListDeploymentEventsRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceListDeploymentEventsResponse, O5DeployerV1ServiceListDeploymentEventsRequest>(
    ...buildRequestInit('POST', baseUrl, '/deployer/v1/q/deployment/:deploymentId/events', request),
  );
}

export function useListDeploymentEvents(request?: O5DeployerV1ServiceListDeploymentEventsRequest) {
  return useInfiniteQuery({
    queryKey: [LIST_DEPLOYMENT_EVENTS_KEY, request],
    queryFn: async ({ pageParam }) => listDeploymentEvents('', pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
  });
}
