import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1TerminateDeploymentRequest } from '@/data/types';
import { buildGetDeploymentKey, LIST_DEPLOYMENTS_KEY } from '@/data/api/query/deployer';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentCommandServiceTerminateDeployment } from '@/data/api/generated';

const TERMINATE_DEPLOYMENT_KEY: KeyBase = {
  scope: 'deployments',
  entity: 'detail',
  service: 'DeployerService.TerminateDeployment',
} as const;

export function useTerminateDeployment() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [TERMINATE_DEPLOYMENT_KEY],
    async mutationFn(request: O5DeployerV1TerminateDeploymentRequest) {
      return o5DeployerV1DeploymentCommandServiceTerminateDeployment(baseUrl, request);
    },
    onSettled(_, err, request) {
      if (!err) {
        queryClient.invalidateQueries({ queryKey: [LIST_DEPLOYMENTS_KEY] });
        queryClient.invalidateQueries({ queryKey: buildGetDeploymentKey({ deploymentId: request?.deploymentId }) });
      }
    },
  });
}
