import { useQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { O5DanteV1ServiceGetMessageRequest, O5DanteV1ServiceGetMessageResponse } from '@/data/types';

const GET_MESSAGE_KEY: KeyBase = { scope: 'messages', entity: 'detail', service: 'DanteService.GetMessage' } as const;
const GET_MESSAGE_PATH_PARAMETERS: readonly (keyof O5DanteV1ServiceGetMessageRequest)[] = ['messageId'] as const;

export async function getMessage(baseUrl: string, request: O5DanteV1ServiceGetMessageRequest | undefined) {
  const { path } = buildBoundPath('GET', `${baseUrl}/dante/v1/message/:messageId`, request, GET_MESSAGE_PATH_PARAMETERS);

  return makeRequest<O5DanteV1ServiceGetMessageResponse>('GET', path);
}

export function useMessage(request?: O5DanteV1ServiceGetMessageRequest) {
  return useQuery({
    queryKey: [GET_MESSAGE_KEY, request],
    queryFn: async () => getMessage('', request),
    enabled: Boolean(request?.messageId),
  });
}
