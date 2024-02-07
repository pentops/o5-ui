import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1ReplayDeadMessageRequest } from '@/data/types';
import { GET_MESSAGE_KEY, LIST_MESSAGES_KEY } from '@/data/api';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DanteV1DeadMessageCommandServiceReplayDeadMessage } from '@/data/api/generated';

const REPLAY_MESSAGE_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.ReplayMessage',
} as const;

export function useReplayMessage() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [REPLAY_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1ReplayDeadMessageRequest) {
      return o5DanteV1DeadMessageCommandServiceReplayDeadMessage(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });

      if (res?.message?.messageId) {
        queryClient.invalidateQueries({ queryKey: [GET_MESSAGE_KEY, res.message.messageId] });
      }
    },
  });
}
