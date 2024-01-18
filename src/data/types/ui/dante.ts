import { O5DanteV1DeadMessageEventType, O5DanteV1DeadMessageSpec } from '@/data/types';
import { O5DanteV1Urgency } from '@/data/types';

// ui-only enum to help with dead message problem oneOf
export enum DeadMessageProblem {
  Unspecified = 'DEAD_MESSAGE_PROBLEM_UNSPECIFIED',
  InvariantViolation = 'DEAD_MESSAGE_PROBLEM_INVARIANT_VIOLATION',
  UnhandledError = 'DEAD_MESSAGE_PROBLEM_UNHANDLED_ERROR',
}

export function getDeadMessageProblem(capturedMessage: O5DanteV1DeadMessageSpec | undefined): DeadMessageProblem {
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

export const urgencyLabels: Record<O5DanteV1Urgency, string> = {
  [O5DanteV1Urgency.Unspecified]: 'Unspecified',
  [O5DanteV1Urgency.Low]: 'Low',
  [O5DanteV1Urgency.Medium]: 'Medium',
  [O5DanteV1Urgency.High]: 'High',
};

// ui-only enum to help with rendering dead message event type names from oneOf
export enum DeadMessageEventType {
  Unspecified = 'DEAD_MESSAGE_EVENT_TYPE_UNSPECIFIED',
  Created = 'DEAD_MESSAGE_EVENT_TYPE_CREATED',
  Updated = 'DEAD_MESSAGE_EVENT_TYPE_UPDATED',
  Replayed = 'DEAD_MESSAGE_EVENT_TYPE_REPLAYED',
  Rejected = 'DEAD_MESSAGE_EVENT_TYPE_REJECTED',
}

export function getDeadMessageEventType(event: O5DanteV1DeadMessageEventType | undefined): DeadMessageEventType {
  if (event?.created) {
    return DeadMessageEventType.Created;
  }

  if (event?.updated) {
    return DeadMessageEventType.Updated;
  }

  if (event?.replayed) {
    return DeadMessageEventType.Replayed;
  }

  if (event?.rejected) {
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
