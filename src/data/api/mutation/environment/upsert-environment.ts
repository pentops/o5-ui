import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1UpsertEnvironmentRequest } from '@/data/types';
import { GET_ENVIRONMENT_KEY, LIST_ENVIRONMENTS_KEY } from '@/data/api/query/environment';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentCommandServiceUpsertEnvironment } from '@/data/api/generated';

const UPSERT_ENVIRONMENT_KEY: KeyBase = {
  scope: 'environments',
  entity: 'detail',
  service: 'EnvironmentService.UpsertEnvironment',
} as const;

export function useUpsertEnvironment() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [UPSERT_ENVIRONMENT_KEY],
    async mutationFn(request: O5DeployerV1UpsertEnvironmentRequest) {
      if (!request.environmentId) {
        request.environmentId = uuid();
      }

      return o5DeployerV1DeploymentCommandServiceUpsertEnvironment(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_ENVIRONMENTS_KEY] });

      if (res?.state?.environmentId) {
        queryClient.invalidateQueries({ queryKey: [GET_ENVIRONMENT_KEY, { environmentId: res.state.environmentId }] });
      }
    },
  });
}
