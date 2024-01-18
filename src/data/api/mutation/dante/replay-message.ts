import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { O5DanteV1ServiceReplayDeadMessageRequest, O5DanteV1ServiceReplayDeadMessageResponse } from '@/data/types';
import { LIST_MESSAGES_KEY } from '@/data/api';
import { buildRequestInit } from '../../search-params';

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

  return useMutation({
    mutationKey: [REPLAY_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1ServiceReplayDeadMessageRequest) {
      return replayMessage('', request);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });
    },
  });
}
