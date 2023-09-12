import { useInfiniteQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildBoundPath } from '@/data/api/search-params.ts';
import { O5DempeV1ListMessagesRequest, O5DempeV1ListMessagesResponse } from '@/data/types';

export const LIST_MESSAGES_KEY: KeyBase = { scope: 'messages', entity: 'list', service: 'DempeService.ListMessages' } as const;

export async function listMessages(baseUrl: string, request: O5DempeV1ListMessagesRequest | undefined) {
  const { path } = buildBoundPath('GET', `${baseUrl}/dempe/v1/messages`, request);

  return makeRequest<O5DempeV1ListMessagesResponse>('GET', path);
}

export function useListMessages(request?: O5DempeV1ListMessagesRequest) {
  return useInfiniteQuery({
    queryKey: [LIST_MESSAGES_KEY],
    queryFn: async () => listMessages('', request),
  });
}
