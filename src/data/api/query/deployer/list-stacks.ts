import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DeployerV1ServiceListStacksRequest, O5DeployerV1ServiceListStacksResponse } from '@/data/types';
import { getNextPageParam } from '@/data/api/pagination.ts';

export const LIST_STACKS_KEY: KeyBase = { scope: 'stacks', entity: 'list', service: 'DeployerService.ListStacks' } as const;

export async function listStacks(baseUrl: string, request: O5DeployerV1ServiceListStacksRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceListStacksResponse, O5DeployerV1ServiceListStacksRequest>(
    ...buildRequestInit('POST', baseUrl, '/deployer/v1/q/stacks', request),
  );
}

export function useListStacks(request?: O5DeployerV1ServiceListStacksRequest) {
  return useInfiniteQuery({
    queryKey: [LIST_STACKS_KEY, request],
    queryFn: async ({ pageParam }) => listStacks('', pageParam ? { ...request, page: { token: pageParam } } : request),
    getNextPageParam,
    initialPageParam: undefined,
  });
}
