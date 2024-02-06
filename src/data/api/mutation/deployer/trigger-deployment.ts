import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1ServiceTriggerDeploymentRequest, O5DeployerV1ServiceTriggerDeploymentResponse } from '@/data/types';
import { LIST_DEPLOYMENTS_KEY } from '@/data/api/query/deployer';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';

const TRIGGER_DEPLOYMENT_KEY: KeyBase = {
  scope: 'deployments',
  entity: 'detail',
  service: 'DeployerService.TriggerDeployment',
} as const;

export async function triggerDeployment(baseUrl: string, request: O5DeployerV1ServiceTriggerDeploymentRequest) {
  return makeRequest<O5DeployerV1ServiceTriggerDeploymentResponse, O5DeployerV1ServiceTriggerDeploymentRequest>(
    ...buildMergedRequestInit('POST', baseUrl, '/deployer/v1/c/deployments/:deploymentId', request),
  );
}

export function useTriggerDeployment() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [TRIGGER_DEPLOYMENT_KEY],
    async mutationFn(request: O5DeployerV1ServiceTriggerDeploymentRequest) {
      return triggerDeployment(baseUrl, request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_DEPLOYMENTS_KEY] });
    },
  });
}
