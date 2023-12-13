// ui-only enum to help with dead message problem oneOf
import type { O5DanteV1DeadMessage, O5DanteV1ServiceMessageAction } from '@/data/types';
import { O5DanteV1Urgency } from '@/data/types';

export enum DeadMessageProblem {
  Unspecified = 'DEAD_MESSAGE_PROBLEM_UNSPECIFIED',
  InvariantViolation = 'DEAD_MESSAGE_PROBLEM_INVARIANT_VIOLATION',
  UnhandledError = 'DEAD_MESSAGE_PROBLEM_UNHANDLED_ERROR',
}

export function getDeadMessageProblem(capturedMessage: O5DanteV1DeadMessage | undefined): DeadMessageProblem {
  if (capturedMessage?.problem?.invariantViolation) {
    return DeadMessageProblem.InvariantViolation;
  }

  if (capturedMessage?.problem?.unhandledError) {
    return DeadMessageProblem.UnhandledError;
  }

  return DeadMessageProblem.Unspecified;
}

export const deadMessageProblemLabels: Record<DeadMessageProblem, string> = {
  [DeadMessageProblem.Unspecified]: 'Unspecified',
  [DeadMessageProblem.InvariantViolation]: 'Invariant Violation',
  [DeadMessageProblem.UnhandledError]: 'Unhandled Error',
};

// ui-only enum to help with message action oneOf
export enum MessageActionType {
  Unspecified = 'MESSAGE_ACTION_TYPE_UNSPECIFIED',
  Delete = 'MESSAGE_ACTION_TYPE_DELETE',
  Requeue = 'MESSAGE_ACTION_TYPE_REQUEUE',
  Edit = 'MESSAGE_ACTION_TYPE_EDIT',
}

export function getMessageActionType(messageAction: O5DanteV1ServiceMessageAction | undefined): MessageActionType {
  if (messageAction?.action?.delete) {
    return MessageActionType.Delete;
  }

  if (messageAction?.action?.requeue) {
    return MessageActionType.Requeue;
  }

  if (messageAction?.action?.edit) {
    return MessageActionType.Edit;
  }

  return MessageActionType.Unspecified;
}

export const messageActionTypeLabels: Record<MessageActionType, string> = {
  [MessageActionType.Unspecified]: 'Unspecified',
  [MessageActionType.Delete]: 'Delete',
  [MessageActionType.Requeue]: 'Requeue',
  [MessageActionType.Edit]: 'Edit',
};

export const urgencyLabels: Record<O5DanteV1Urgency, string> = {
  [O5DanteV1Urgency.Unspecified]: 'Unspecified',
  [O5DanteV1Urgency.Low]: 'Low',
  [O5DanteV1Urgency.Medium]: 'Medium',
  [O5DanteV1Urgency.High]: 'High',
};
