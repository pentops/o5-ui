import { useMutation, useQueryClient } from '@tanstack/react-query';
import { O5DempeV1MessageActionRequest, O5DempeV1MessageActionResponse } from '@/data/types';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { LIST_MESSAGES_KEY } from '@/data/api';

const MESSAGE_ACTION_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DempeService.MessageAction',
} as const;
const MESSAGE_ACTION_PATH_PARAMETERS: readonly (keyof O5DempeV1MessageActionRequest)[] = ['messageId'] as const;

export async function messageAction(request: O5DempeV1MessageActionRequest) {
  const { path, body } = buildBoundPath('POST', 'dempe/v1/messages/:messageId', request, MESSAGE_ACTION_PATH_PARAMETERS);
  return makeRequest<O5DempeV1MessageActionResponse, O5DempeV1MessageActionRequest>('POST', path, {
    body,
  });
}

export function useMessageAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MESSAGE_ACTION_KEY],
    async mutationFn(request: O5DempeV1MessageActionRequest) {
      return messageAction(request);
    },
    onSuccess(_, request) {
      queryClient.invalidateQueries([LIST_MESSAGES_KEY]);
      queryClient.invalidateQueries([MESSAGE_ACTION_KEY, request]);
    },
  });
}
