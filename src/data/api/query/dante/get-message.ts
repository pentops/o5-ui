import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { O5DanteV1GetDeadMessageRequest } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';
import { o5DanteV1DeadMessageQueryServiceGetDeadMessage } from '@/data/api/generated';

export const GET_MESSAGE_KEY: KeyBase = { scope: 'messages', entity: 'detail', service: 'DanteService.GetMessage' } as const;

export function useMessage(request?: O5DanteV1GetDeadMessageRequest) {
  const [baseUrl, loadingRealm] = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_MESSAGE_KEY, request?.messageId, baseUrl],
    queryFn: async () => o5DanteV1DeadMessageQueryServiceGetDeadMessage(baseUrl, request),
    enabled: Boolean(!loadingRealm && request?.messageId),
  });
}
