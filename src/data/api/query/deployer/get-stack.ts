import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5AwsDeployerV1StackQueryServiceGetStackGetStackRequest } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5AwsDeployerV1StackQueryServiceGetStack } from '@/data/api/generated';

export const GET_STACK_KEY: KeyBase = { scope: 'stacks', entity: 'detail', service: 'DeployerService.GetStack' } as const;

export function useStack(request?: O5AwsDeployerV1StackQueryServiceGetStackGetStackRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_STACK_KEY, request, baseUrl],
    queryFn: async () => o5AwsDeployerV1StackQueryServiceGetStack(baseUrl, request),
    enabled: Boolean(!loadingRealm && request?.stackId),
  });
}
