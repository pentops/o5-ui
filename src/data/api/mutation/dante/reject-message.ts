import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1RejectDeadMessageRequest } from '@/data/types';
import { GET_MESSAGE_KEY, LIST_MESSAGES_KEY } from '@/data/api';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DanteV1DeadMessageCommandServiceRejectDeadMessage } from '@/data/api/generated';

const REJECT_MESSAGE_KEY: KeyBase = {
  scope: 'message',
  entity: 'detail',
  service: 'DanteService.RejectMessage',
} as const;

export function useRejectMessage() {
  const queryClient = useQueryClient();
  const [baseUrl] = useSelectedRealmBaseUrl();

  return useMutation({
    mutationKey: [REJECT_MESSAGE_KEY],
    async mutationFn(request: O5DanteV1RejectDeadMessageRequest) {
      return o5DanteV1DeadMessageCommandServiceRejectDeadMessage(baseUrl, request);
    },
    onSettled(res) {
      queryClient.invalidateQueries({ queryKey: [LIST_MESSAGES_KEY] });

      if (res?.message?.messageId) {
        queryClient.invalidateQueries({ queryKey: [GET_MESSAGE_KEY, res.message.messageId] });
      }
    },
  });
}
