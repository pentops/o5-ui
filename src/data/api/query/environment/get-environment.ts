import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1GetEnvironmentRequest } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentQueryServiceGetEnvironment } from '@/data/api/generated';

const GET_ENVIRONMENT_KEY: KeyBase = { scope: 'environments', entity: 'detail', service: 'DeployerService.GetEnvironment' } as const;

export function useEnvironment(request?: O5DeployerV1GetEnvironmentRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_ENVIRONMENT_KEY, request, baseUrl],
    queryFn: async () => o5DeployerV1DeploymentQueryServiceGetEnvironment(baseUrl, request),
    enabled: Boolean(!loadingRealm && request?.environmentId),
  });
}
