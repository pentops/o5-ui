import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ListDeploymentsRequest } from '@/data/types';
import { getNextPageParam, mergePageParam } from '@/data/api/pagination.ts';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceListDeployments } from '@/data/api/generated';

export const LIST_DEPLOYMENTS_KEY: KeyBase = { scope: 'deployments', entity: 'list', service: 'DeployerService.ListDeployments' } as const;

export function useListDeployments(request?: O5DeployerV1ListDeploymentsRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useInfiniteQuery({
    queryKey: [LIST_DEPLOYMENTS_KEY, request, baseUrl],
    queryFn: async ({ pageParam }) => o5DeployerV1DeploymentQueryServiceListDeployments(baseUrl, mergePageParam(request, pageParam)),
    getNextPageParam,
    initialPageParam: undefined,
    enabled: !loadingRealm,
  });
}
