import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1ServiceRejectDeadMessageRequest, O5DanteV1ServiceRejectDeadMessageResponse } from '@/data/types';
import { GET_MESSAGE_KEY, LIST_MESSAGES_KEY } from '@/data/api';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';

const REJECT_MESSAGE_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.RejectMessage',
} as const;

export async function rejectMessage(baseUrl: string, request: O5DanteV1ServiceRejectDeadMessageRequest) {
  return makeRequest<O5DanteV1ServiceRejectDeadMessageResponse, O5DanteV1ServiceRejectDeadMessageRequest>(
    ...buildMergedRequestInit('POST', baseUrl, '/dante/v1/c/messages/:messageId/shelve', request),
  );
}

export function useRejectMessage() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [REJECT_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1ServiceRejectDeadMessageRequest) {
      return rejectMessage(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });

      if (res?.message?.messageId) {
        queryClient.invalidateQueries({ queryKey: [GET_MESSAGE_KEY, res.message.messageId] });
      }
    },
  });
}
