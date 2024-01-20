import { useQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DanteV1ServiceGetDeadMessageRequest, O5DanteV1ServiceGetDeadMessageResponse } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';

export const GET_MESSAGE_KEY: KeyBase = { scope: 'messages', entity: 'detail', service: 'DanteService.GetMessage' } as const;

export async function getMessage(baseUrl: string, request: O5DanteV1ServiceGetDeadMessageRequest | undefined) {
  return makeRequest<O5DanteV1ServiceGetDeadMessageResponse, O5DanteV1ServiceGetDeadMessageRequest>(
    ...buildRequestInit('GET', baseUrl, '/dante/v1/q/message/:messageId', request),
  );
}

export function useMessage(request?: O5DanteV1ServiceGetDeadMessageRequest) {
  const baseUrl = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [GET_MESSAGE_KEY, request?.messageId],
    queryFn: async () => getMessage(baseUrl, request),
    enabled: Boolean(request?.messageId),
  });
}
