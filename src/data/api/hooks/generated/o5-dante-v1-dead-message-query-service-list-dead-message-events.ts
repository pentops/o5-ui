/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import {
  O5DanteV1DeadMessageQueryServiceListDeadMessageEventsResponse,
  O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest,
} from '../../../types/generated';
import { o5DanteV1DeadMessageQueryServiceListDeadMessageEvents } from '../../generated';
import { o5DanteV1DeadMessageStateEntity } from '../../../entities/generated/o5-dante-v1-dead-message-state';
import { useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData, type QueryKey } from '@tanstack/react-query';

/**
 * @generated by NormalizedQueryPlugin (get /dante/v1/q/message/:messageId/events) */
export function useO5DanteV1DeadMessageQueryServiceListDeadMessageEvents(
  request: O5DanteV1DeadMessageQueryServiceListDeadMessageEventsListDeadMessageEventsRequest | undefined,
  options?: Partial<
    UseInfiniteQueryOptions<
      O5DanteV1DeadMessageQueryServiceListDeadMessageEventsResponse | undefined,
      Error,
      InfiniteData<O5DanteV1DeadMessageQueryServiceListDeadMessageEventsResponse | undefined>,
      O5DanteV1DeadMessageQueryServiceListDeadMessageEventsResponse | undefined,
      QueryKey,
      string | undefined
    >
  >,
) {
  return useInfiniteQuery({
    queryKey: [o5DanteV1DeadMessageStateEntity.key, request],
    queryFn: async ({ pageParam }) =>
      o5DanteV1DeadMessageQueryServiceListDeadMessageEvents(
        '',
        request ? { ...request, page: pageParam ? { token: pageParam } : undefined } : undefined,
      ),
    enabled: Boolean(request?.messageId),
    getNextPageParam: (response) => response?.page?.nextToken,
    initialPageParam: undefined,
    ...options,
  });
}