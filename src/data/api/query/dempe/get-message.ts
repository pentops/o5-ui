import { useQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { O5DempeV1GetMessageRequest, O5DempeV1GetMessageResponse } from '@/data/types';

const GET_MESSAGE_KEY: KeyBase = { scope: 'messages', entity: 'detail', service: 'DempeService.GetMessage' } as const;
const GET_MESSAGE_PATH_PARAMETERS: readonly (keyof O5DempeV1GetMessageRequest)[] = ['messageId'] as const;

export async function getMessage(baseUrl: string, request: O5DempeV1GetMessageRequest | undefined) {
  const { path } = buildBoundPath('GET', `${baseUrl}/dempe/v1/messages/:messageId`, request, GET_MESSAGE_PATH_PARAMETERS);

  return makeRequest<O5DempeV1GetMessageResponse>('GET', path);
}

export function useMessage(request?: O5DempeV1GetMessageRequest) {
  return useQuery({
    queryKey: [GET_MESSAGE_KEY, request],
    queryFn: async () => getMessage('', request),
  });
}
