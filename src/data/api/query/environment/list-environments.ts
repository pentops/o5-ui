import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ListEnvironmentsRequest } from '@/data/types';
import { getNextPageParam, mergePageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceListEnvironments } from '@/data/api/generated';

export const LIST_ENVIRONMENTS_KEY: KeyBase = { scope: 'environments', entity: 'list', service: 'DeployerService.ListEnvironments' } as const;

export function useListEnvironments(request?: O5DeployerV1ListEnvironmentsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_ENVIRONMENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => o5DeployerV1DeploymentQueryServiceListEnvironments(baseUrl, mergePageParam(request, pageParam)),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
