/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { schema } from 'normalizr';
import { o5DanteV1DeadMessageStateEntity } from '../../../entities/generated/o5-dante-v1-dead-message-state';
import {
  O5DanteV1DeadMessageCommandServiceRejectDeadMessageResponse,
  O5DanteV1DeadMessageCommandServiceRejectDeadMessageRequest,
} from '../../../types/generated';
import { o5DanteV1DeadMessageCommandServiceRejectDeadMessage } from '../../generated';

export const o5DanteV1DeadMessageCommandServiceRejectDeadMessageResponseEntity =
  new schema.Object<O5DanteV1DeadMessageCommandServiceRejectDeadMessageResponse>({
    message: o5DanteV1DeadMessageStateEntity,
  });
/**
 * @generated by NormalizedQueryPlugin (post /dante/v1/c/messages/:messageId/shelve) */

export function buildO5DanteV1DeadMessageCommandServiceRejectDeadMessageKey() {
  return ['/o5.dante.v1.DeadMessageCommandService/RejectDeadMessage'] as const;
}

export function useO5DanteV1DeadMessageCommandServiceRejectDeadMessage(
  options?: Partial<
    UseMutationOptions<
      O5DanteV1DeadMessageCommandServiceRejectDeadMessageResponse | undefined,
      Error,
      O5DanteV1DeadMessageCommandServiceRejectDeadMessageRequest,
      unknown
    >
  >,
) {
  return useMutation({
    mutationKey: buildO5DanteV1DeadMessageCommandServiceRejectDeadMessageKey(),
    mutationFn: async (request: O5DanteV1DeadMessageCommandServiceRejectDeadMessageRequest) =>
      o5DanteV1DeadMessageCommandServiceRejectDeadMessage('', request),
    meta: { normalizationSchema: o5DanteV1DeadMessageCommandServiceRejectDeadMessageResponseEntity },
    ...options,
  });
}
