import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1ServiceUpdateDeadMessageRequest, O5DanteV1ServiceUpdateDeadMessageResponse } from '@/data/types';
import { GET_MESSAGE_KEY, LIST_MESSAGES_KEY } from '@/data/api';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';

const UPDATE_MESSAGE_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.UpdateMessage',
} as const;

export async function updateMessage(baseUrl: string, request: O5DanteV1ServiceUpdateDeadMessageRequest) {
  return makeRequest<O5DanteV1ServiceUpdateDeadMessageResponse, O5DanteV1ServiceUpdateDeadMessageRequest>(
    ...buildMergedRequestInit('POST', baseUrl, '/dante/v1/c/messages/:messageId/update', request),
  );
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [UPDATE_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1ServiceUpdateDeadMessageRequest) {
      return updateMessage(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });

      if (res?.message?.messageId) {
        queryClient.invalidateQueries({ queryKey: [GET_MESSAGE_KEY, res.message.messageId] });
      }
    },
  });
}
