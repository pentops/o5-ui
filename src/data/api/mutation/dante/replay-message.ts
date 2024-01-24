import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { O5DanteV1ServiceReplayDeadMessageRequest, O5DanteV1ServiceReplayDeadMessageResponse } from '@/data/types';
import { GET_MESSAGE_KEY, LIST_MESSAGES_KEY } from '@/data/api';
import { buildRequestInit } from '../../search-params';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';

const REPLAY_MESSAGE_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.ReplayMessage',
} as const;

export async function replayMessage(baseUrl: string, request: O5DanteV1ServiceReplayDeadMessageRequest) {
  return makeRequest<O5DanteV1ServiceReplayDeadMessageResponse, O5DanteV1ServiceReplayDeadMessageRequest>(
    ...buildRequestInit('POST', baseUrl, '/dante/v1/c/messages/:messageId/replay', request),
  );
}

export function useReplayMessage() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [REPLAY_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1ServiceReplayDeadMessageRequest) {
      return replayMessage(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });

      if (res?.message?.messageId) {
        queryClient.invalidateQueries({ queryKey: [GET_MESSAGE_KEY, res.message.messageId] });
      }
    },
  });
}
