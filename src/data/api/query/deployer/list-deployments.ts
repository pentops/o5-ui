import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DeployerV1ServiceListDeploymentsRequest, O5DeployerV1ServiceListDeploymentsResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';

export const LIST_DEPLOYMENTS_KEY: KeyBase = { scope: 'deployments', entity: 'list', service: 'DeployerService.ListDeployments' } as const;

export async function listDeployments(baseUrl: string, request: O5DeployerV1ServiceListDeploymentsRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceListDeploymentsResponse, O5DeployerV1ServiceListDeploymentsRequest>(
    ...buildRequestInit('POST', baseUrl, '/deployer/v1/q/deployments', request),
  );
}

export function useListDeployments(request?: O5DeployerV1ServiceListDeploymentsRequest) {
  return useInfiniteQuery({
    queryKey: [LIST_DEPLOYMENTS_KEY, request],
    queryFn: async ({ pageParam }) => listDeployments('', pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
  });
}
