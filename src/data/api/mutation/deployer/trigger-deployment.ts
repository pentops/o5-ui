import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1TriggerDeploymentRequest } from '@/data/types';
import { LIST_DEPLOYMENTS_KEY } from '@/data/api/query/deployer';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentCommandServiceTriggerDeployment } from '@/data/api/generated';

const TRIGGER_DEPLOYMENT_KEY: KeyBase = {
  scope: 'deployments',
  entity: 'detail',
  service: 'DeployerService.TriggerDeployment',
} as const;

export function useTriggerDeployment() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [TRIGGER_DEPLOYMENT_KEY],
    async mutationFn(request: O5DeployerV1TriggerDeploymentRequest) {
      return o5DeployerV1DeploymentCommandServiceTriggerDeployment(baseUrl, request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_DEPLOYMENTS_KEY] });
    },
  });
}
