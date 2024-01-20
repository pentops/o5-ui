import { useQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5DanteV1ServiceListDeadMessageEventsRequest, O5DanteV1ServiceListDeadMessageEventsResponse } from '@/data/types';
import { useSelectedRealmBaseUrl } from '@/context/api-context.ts';

export const LIST_MESSAGE_EVENTS_KEY: KeyBase = { scope: 'message_events', entity: 'list', service: 'DanteService.ListMessageEvents' } as const;

export async function listMessageEvents(baseUrl: string, request: O5DanteV1ServiceListDeadMessageEventsRequest | undefined) {
  return makeRequest<O5DanteV1ServiceListDeadMessageEventsResponse, O5DanteV1ServiceListDeadMessageEventsRequest>(
    ...buildRequestInit('GET', baseUrl, '/dante/v1/q/message/:messageId/events', request),
  );
}

export function useListMessageEvents(request?: O5DanteV1ServiceListDeadMessageEventsRequest) {
  const baseUrl = useSelectedRealmBaseUrl();

  return useQuery({
    queryKey: [LIST_MESSAGE_EVENTS_KEY],
    queryFn: async () => listMessageEvents(baseUrl, request),
  });
}
