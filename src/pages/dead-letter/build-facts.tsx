import React from 'react';
import { match, P } from 'ts-pattern';
import { type NutritionFactProps } from '@/components/nutrition-fact/nutrition-fact.tsx';
import {
  O5DanteV1DeadMessageVersionSqsMessage,
  O5MessagingV1Any,
  O5MessagingV1Infra,
  O5MessagingV1Message,
  O5MessagingV1MessageReply,
  O5MessagingV1MessageRequest,
  O5MessagingV1Problem,
  O5MessagingV1ProblemOneOfValue,
  O5MessagingV1ProblemUnhandledError,
  O5MessagingV1WireEncoding,
} from '@/data/types';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';

export function buildMessagingMessageReplyFacts(reply: O5MessagingV1MessageReply | undefined) {
  const built: Record<keyof O5MessagingV1MessageReply, NutritionFactProps> = {
    replyTo: { renderWhenEmpty: '-', label: 'Reply To', value: reply?.replyTo },
  };

  return built;
}

export function buildMessagingMessageRequestFacts(reply: O5MessagingV1MessageRequest | undefined) {
  const built: Record<keyof O5MessagingV1MessageRequest, NutritionFactProps> = {
    replyTo: { renderWhenEmpty: '-', label: 'Reply To', value: reply?.replyTo },
  };

  return built;
}

export function buildMessagingAnyFacts(any: O5MessagingV1Any | undefined) {
  const built: Omit<Record<keyof O5MessagingV1Any, NutritionFactProps>, 'encoding'> = {
    typeUrl: { renderWhenEmpty: '-', label: 'Type URL', value: any?.typeUrl },
    value: {
      renderWhenEmpty: '-',
      label: 'Value',
      value: match(any)
        .with({ value: P.not(P.nullish), encoding: O5MessagingV1WireEncoding.Protojson }, (a) => (
          <CodeEditor disabled value={a.value} language="json" />
        ))
        .otherwise(() => any?.value),
    },
  };

  return built;
}

export function buildMessagingMessageFacts(message: O5MessagingV1Message | undefined) {
  let headers: string | undefined;
  try {
    headers = JSON.stringify(message?.headers, null, 2);
  } catch {}

  const baseBuilt: Omit<Record<keyof O5MessagingV1Message, NutritionFactProps>, 'reply' | 'body' | 'request'> = {
    messageId: { renderWhenEmpty: '-', label: 'Message ID', value: message?.messageId ? <UUID canCopy short uuid={message.messageId} /> : undefined },
    timestamp: {
      renderWhenEmpty: '-',
      label: 'Timestamp',
      value: message?.timestamp ? (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={message.timestamp}
        />
      ) : undefined,
    },
    grpcService: { renderWhenEmpty: '-', label: 'gRPC Service', value: message?.grpcService },
    grpcMethod: { renderWhenEmpty: '-', label: 'gRPC Method', value: message?.grpcMethod },
    sourceApp: { renderWhenEmpty: '-', label: 'Source App', value: message?.sourceApp },
    sourceEnv: { renderWhenEmpty: '-', label: 'Source Environment', value: message?.sourceEnv },
    destinationTopic: { renderWhenEmpty: '-', label: 'Destination Topic', value: message?.destinationTopic },
    headers: { renderWhenEmpty: '-', label: 'Headers', value: headers ? <CodeEditor disabled value={headers} language="json" /> : undefined },
  };

  return {
    ...baseBuilt,
    reply: buildMessagingMessageReplyFacts(message?.reply),
    request: buildMessagingMessageRequestFacts(message?.request),
    body: buildMessagingAnyFacts(message?.body),
  };
}

export function buildMessagingProblemFacts(problem: O5MessagingV1Problem | undefined) {
  return match(problem)
    .with({ unhandledError: P.not(P.nullish) }, (p) => {
      const base: Record<keyof O5MessagingV1ProblemUnhandledError, NutritionFactProps> = {
        error: { renderWhenEmpty: '-', label: 'Error', value: p.unhandledError.error },
      };

      return { unhandledError: base } as Record<O5MessagingV1ProblemOneOfValue, typeof base>;
    })
    .otherwise(() => undefined);
}

export function buildMessagingInfraFacts(infra: O5MessagingV1Infra | undefined) {
  let metadata: string | undefined;

  try {
    metadata = JSON.stringify(infra?.metadata, null, 2);
  } catch {}

  const built: Record<keyof O5MessagingV1Infra, NutritionFactProps> = {
    type: { renderWhenEmpty: '-', label: 'Type', value: infra?.type },
    metadata: { renderWhenEmpty: '-', label: 'Metadata', value: metadata ? <CodeEditor disabled value={metadata} language="json" /> : undefined },
  };

  return built;
}

export function buildDanteSQSMessageFacts(message: O5DanteV1DeadMessageVersionSqsMessage | undefined) {
  let attributes: string | undefined;

  try {
    attributes = JSON.stringify(message?.attributes, null, 2);
  } catch {}

  const built: Record<keyof O5DanteV1DeadMessageVersionSqsMessage, NutritionFactProps> = {
    queueUrl: { renderWhenEmpty: '-', label: 'Queue URL', value: message?.queueUrl },
    attributes: {
      renderWhenEmpty: '-',
      label: 'Attributes',
      value: attributes ? <CodeEditor disabled value={attributes} language="json" /> : undefined,
    },
  };

  return built;
}
