import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { O5DanteV1ServiceRejectDeadMessageRequest, O5DanteV1ServiceRejectDeadMessageResponse } from '@/data/types';
import { LIST_DEPLOYMENTS_KEY } from '@/data/api/query/deployer';
import { buildRequestInit } from '../../search-params';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';

const TRIGGER_DEPLOYMENT_KEY: KeyBase = {
  scope: 'deployments',
  entity: 'detail',
  service: 'DeployerService.TriggerDeployment',
} as const;

export async function triggerDeployment(baseUrl: string, request: O5DanteV1ServiceRejectDeadMessageRequest) {
  return makeRequest<O5DanteV1ServiceRejectDeadMessageResponse, O5DanteV1ServiceRejectDeadMessageRequest>(
    ...buildRequestInit('POST', baseUrl, '/deployer/v1/c/deployments/:deploymentId', request),
  );
}

export function useTriggerDeployment() {
  const queryClient = useQueryClient();
  const baseUrl = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [TRIGGER_DEPLOYMENT_KEY],
    async mutationFn(request: O5DanteV1ServiceRejectDeadMessageRequest) {
      return triggerDeployment(baseUrl, request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_DEPLOYMENTS_KEY] });
    },
  });
}
