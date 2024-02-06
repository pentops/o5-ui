import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ServiceGetStackRequest, O5DeployerV1ServiceGetStackResponse } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';

const GET_STACK_KEY: KeyBase = { scope: 'stacks', entity: 'detail', service: 'DeployerService.GetStack' } as const;
export async function getStack(baseUrl: string, request: O5DeployerV1ServiceGetStackRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceGetStackResponse, O5DeployerV1ServiceGetStackRequest>(
    ...buildMergedRequestInit('GET', baseUrl, '/deployer/v1/q/stack/:stackId', request),
  );
}

export function useStack(request?: O5DeployerV1ServiceGetStackRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_STACK_KEY, request, baseUrl],
    queryFn: async () => getStack(baseUrl, request),
    enabled: Boolean(!loadingRealm && request?.stackId),
  });
}
