import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ListStacksRequest } from '@/data/types';
import { getNextPageParam, mergePageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceListStacks } from '@/data/api/generated';

export const LIST_STACKS_KEY: KeyBase = { scope: 'stacks', entity: 'list', service: 'DeployerService.ListStacks' } as const;

export function useListStacks(request?: O5DeployerV1ListStacksRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_STACKS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => o5DeployerV1DeploymentQueryServiceListStacks(baseUrl, mergePageParam(request, pageParam)),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
