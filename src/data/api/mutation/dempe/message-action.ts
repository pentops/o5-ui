import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { O5DempeV1MessagesActionRequest, O5DempeV1MessagesActionResponse } from '@/data/types';
import { LIST_MESSAGES_KEY } from '@/data/api';

const MESSAGE_ACTION_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DempeService.MessagesAction',
} as const;

export async function messageAction(request: O5DempeV1MessagesActionRequest) {
  const { path, body } = buildBoundPath('POST', 'dempe/v1/messages/action', request);
  return makeRequest<O5DempeV1MessagesActionResponse, O5DempeV1MessagesActionRequest>('POST', path, {
    body,
  });
}

export function useMessageAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MESSAGE_ACTION_KEY],
    async mutationFn(request: O5DempeV1MessagesActionRequest) {
      return messageAction(request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });
    },
  });
}
