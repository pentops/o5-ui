import { useQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DeployerV1ServiceGetDeploymentRequest, O5DeployerV1ServiceGetDeploymentResponse } from '@/data/types';

const GET_DEPLOYMENT_KEY: KeyBase = { scope: 'deployments', entity: 'detail', service: 'DeployerService.GetDeployment' } as const;
export async function getDeployment(baseUrl: string, request: O5DeployerV1ServiceGetDeploymentRequest | undefined) {
  return makeRequest<O5DeployerV1ServiceGetDeploymentResponse, O5DeployerV1ServiceGetDeploymentRequest>(
    ...buildRequestInit('GET', baseUrl, '/deployer/v1/q/deployment/:deploymentId', request),
  );
}

export function useDeployment(request?: O5DeployerV1ServiceGetDeploymentRequest) {
  return useQuery({
    queryKey: [GET_DEPLOYMENT_KEY, request],
    queryFn: async () => getDeployment('', request),
    enabled: Boolean(request?.deploymentId),
  });
}
