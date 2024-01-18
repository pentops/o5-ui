import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { O5DanteV1ServiceRejectDeadMessageRequest, O5DanteV1ServiceRejectDeadMessageResponse } from '@/data/types';
import { LIST_MESSAGES_KEY } from '@/data/api';
import { buildRequestInit } from '../../search-params';

const REJECT_MESSAGE_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.RejectMessage',
} as const;

export async function rejectMessage(baseUrl: string, request: O5DanteV1ServiceRejectDeadMessageRequest) {
  return makeRequest<O5DanteV1ServiceRejectDeadMessageResponse, O5DanteV1ServiceRejectDeadMessageRequest>(
    ...buildRequestInit('POST', baseUrl, '/dante/v1/c/messages/:messageId/shelve', request),
  );
}

export function useRejectMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [REJECT_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1ServiceRejectDeadMessageRequest) {
      return rejectMessage('', request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });
    },
  });
}
