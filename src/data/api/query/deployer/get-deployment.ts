import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1GetDeploymentRequest } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceGetDeployment } from '@/data/api/generated';

const GET_DEPLOYMENT_KEY: KeyBase = { scope: 'deployments', entity: 'detail', service: 'DeployerService.GetDeployment' } as const;

export function useDeployment(request?: O5DeployerV1GetDeploymentRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_DEPLOYMENT_KEY, request, baseUrl],
    queryFn: async () => o5DeployerV1DeploymentQueryServiceGetDeployment(baseUrl, request),
    enabled: Boolean(!loadingRealm && request?.deploymentId),
  });
}
