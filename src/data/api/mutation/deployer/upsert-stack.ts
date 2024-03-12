import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import { KeyBase } from '@/data/api/client.ts';
import { O5DeployerV1UpsertStackRequest } from '@/data/types';
import { GET_STACK_KEY, LIST_STACKS_KEY } from '@/data/api/query/deployer';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DeployerV1DeploymentCommandServiceUpsertStack } from '@/data/api/generated';

const UPSERT_STACK_KEY: KeyBase = {
  scope: 'stacks',
  entity: 'detail',
  service: 'DeployerService.UpsertStack',
} as const;

export function useUpsertStack() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [UPSERT_STACK_KEY],
    async mutationFn(request: O5DeployerV1UpsertStackRequest) {
      if (!request.stackId) {
        request.stackId = uuid();
      }

      return o5DeployerV1DeploymentCommandServiceUpsertStack(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_STACKS_KEY] });

      if (res?.state?.stackId) {
        queryClient.invalidateQueries({ queryKey: [GET_STACK_KEY, { stackId: res.state.stackId }] });
      }
    },
  });
}
