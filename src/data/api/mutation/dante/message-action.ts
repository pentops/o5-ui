import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { O5DanteV1ServiceMessagesActionRequest, O5DanteV1ServiceMessagesActionResponse } from '@/data/types';
import { LIST_MESSAGES_KEY } from '@/data/api';

const MESSAGE_ACTION_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.MessagesAction',
} as const;

export async function messageAction(request: O5DanteV1ServiceMessagesActionRequest) {
  const { path, body } = buildBoundPath('POST', 'dante/v1/messages/action', request);
  return makeRequest<O5DanteV1ServiceMessagesActionResponse, O5DanteV1ServiceMessagesActionRequest>('POST', path, {
    body,
  });
}

export function useMessageAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MESSAGE_ACTION_KEY],
    async mutationFn(request: O5DanteV1ServiceMessagesActionRequest) {
      return messageAction(request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });
    },
  });
}
