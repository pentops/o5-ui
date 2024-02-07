import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1GetStackRequest } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceGetStack } from '@/data/api/generated';

const GET_STACK_KEY: KeyBase = { scope: 'stacks', entity: 'detail', service: 'DeployerService.GetStack' } as const;

export function useStack(request?: O5DeployerV1GetStackRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_STACK_KEY, request, baseUrl],
    queryFn: async () => o5DeployerV1DeploymentQueryServiceGetStack(baseUrl, request),
    enabled: Boolean(!loadingRealm && request?.stackId),
  });
}
