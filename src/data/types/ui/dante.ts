import { O5DanteV1DeadMessageEventType, O5DanteV1DeadMessageSpec, O5DanteV1MessageStatus } from '@/data/types';
import { O5DanteV1Urgency } from '@/data/types';

// ui-only enum to help with dead message problem oneOf
export enum DeadMessageProblem {
  Unspecified = 'DEAD_MESSAGE_PROBLEM_UNSPECIFIED',
  InvariantViolation = 'DEAD_MESSAGE_PROBLEM_INVARIANT_VIOLATION',
  UnhandledError = 'DEAD_MESSAGE_PROBLEM_UNHANDLED_ERROR',
}

export function getDeadMessageProblem(capturedMessage: O5DanteV1DeadMessageSpec | undefined): DeadMessageProblem {
  if (capturedMessage?.problem?.type?.invariantViolation) {
    return DeadMessageProblem.InvariantViolation;
  }

  if (capturedMessage?.problem?.type?.unhandledError) {
    return DeadMessageProblem.UnhandledError;
  }

  return DeadMessageProblem.Unspecified;
}

export const deadMessageProblemLabels: Record<DeadMessageProblem, string> = {
  [DeadMessageProblem.Unspecified]: 'Unspecified',
  [DeadMessageProblem.InvariantViolation]: 'Invariant Violation',
  [DeadMessageProblem.UnhandledError]: 'Unhandled Error',
};

export const urgencyLabels: Record<O5DanteV1Urgency, string> = {
  [O5DanteV1Urgency.Unspecified]: 'Unspecified',
  [O5DanteV1Urgency.Low]: 'Low',
  [O5DanteV1Urgency.Medium]: 'Medium',
  [O5DanteV1Urgency.High]: 'High',
};

// ui-only enum to help with rendering dead message event type names from oneOf
export enum DeadMessageEventType {
  Unspecified = 'unspecified',
  Created = 'created',
  Updated = 'updated',
  Replayed = 'replayed',
  Rejected = 'rejected',
}

export function getDeadMessageEventType(event: O5DanteV1DeadMessageEventType | undefined): DeadMessageEventType {
  if (event?.type?.created) {
    return DeadMessageEventType.Created;
  }

  if (event?.type?.updated) {
    return DeadMessageEventType.Updated;
  }

  if (event?.type?.replayed) {
    return DeadMessageEventType.Replayed;
  }

  if (event?.type?.rejected) {
    return DeadMessageEventType.Rejected;
  }

  return DeadMessageEventType.Unspecified;
}

export const deadMessageEventTypeLabels: Record<DeadMessageEventType, string> = {
  [DeadMessageEventType.Unspecified]: 'Unspecified',
  [DeadMessageEventType.Created]: 'Created',
  [DeadMessageEventType.Updated]: 'Updated',
  [DeadMessageEventType.Replayed]: 'Replayed',
  [DeadMessageEventType.Rejected]: 'Rejected',
};

export const deadMessageStatusLabels: Record<O5DanteV1MessageStatus, string> = {
  [O5DanteV1MessageStatus.Unspecified]: 'Unspecified',
  [O5DanteV1MessageStatus.Created]: 'Created',
  [O5DanteV1MessageStatus.Rejected]: 'Rejected',
  [O5DanteV1MessageStatus.Replayed]: 'Replayed',
  [O5DanteV1MessageStatus.Updated]: 'Updated',
};
