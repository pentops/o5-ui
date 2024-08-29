import React from 'react';
import { O5MessagingV1Message } from '@/data/types';
import { buildMessagingMessageFacts } from '@/pages/dead-letter/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface O5MessageProps {
  message: O5MessagingV1Message | undefined;
  heading?: React.ReactNode;
  isLoading?: boolean;
  vertical?: boolean;
}

export function O5Message({ message, heading, isLoading, vertical }: O5MessageProps) {
  const messageFacts = buildMessagingMessageFacts(message);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.messageId} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.timestamp} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.grpcService} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.grpcMethod} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.sourceApp} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.sourceEnv} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.destinationTopic} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.headers} />

      {messageFacts.body && (
        <>
          <span>Body</span>
          <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.body.typeUrl} />
          <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.body.value} />
        </>
      )}

      {messageFacts.request && (
        <>
          <span>Request</span>
          <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.request.replyTo} />
        </>
      )}

      {messageFacts.reply && (
        <>
          <span>Reply</span>
          <NutritionFact vertical={vertical} isLoading={isLoading} {...messageFacts.reply.replyTo} />
        </>
      )}
    </>
  );
}
