// ui-only enum to help with dead message problem oneOf
import type { O5DempeV1DeadMessage, O5DempeV1MessageAction } from '@/data/types';
import { O5DempeV1Urgency } from '@/data/types';

export enum DeadMessageProblem {
  Unspecified = 'DEAD_MESSAGE_PROBLEM_UNSPECIFIED',
  InvariantViolation = 'DEAD_MESSAGE_PROBLEM_INVARIANT_VIOLATION',
  UnhandledError = 'DEAD_MESSAGE_PROBLEM_UNHANDLED_ERROR',
}

export function getDeadMessageProblem(capturedMessage: O5DempeV1DeadMessage | undefined): DeadMessageProblem {
  if (capturedMessage?.invariantViolation) {
    return DeadMessageProblem.InvariantViolation;
  }

  if (capturedMessage?.unhandledError) {
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

export function getMessageActionType(messageAction: O5DempeV1MessageAction | undefined): MessageActionType {
  if (messageAction?.delete) {
    return MessageActionType.Delete;
  }

  if (messageAction?.requeue) {
    return MessageActionType.Requeue;
  }

  if (messageAction?.edit) {
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

export const urgencyLabels: Record<O5DempeV1Urgency, string> = {
  [O5DempeV1Urgency.Unspecified]: 'Unspecified',
  [O5DempeV1Urgency.Low]: 'Low',
  [O5DempeV1Urgency.Medium]: 'Medium',
  [O5DempeV1Urgency.High]: 'High',
};
