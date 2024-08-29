import React from 'react';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { O5MessagingV1DeadMessage } from '@/data/types';
import { buildMessagingInfraFacts } from '@/pages/dead-letter/build-facts.tsx';
import { O5Message } from '@/pages/dead-letter/dead-message/o5-message.tsx';
import { MessageProblem } from '@/pages/dead-letter/dead-message/message-problem.tsx';

interface DeadMessageProps {
  deadMessage: O5MessagingV1DeadMessage | undefined;
  heading?: React.ReactNode;
  isLoading?: boolean;
  vertical?: boolean;
}

export function DeadMessage({ deadMessage, heading, isLoading, vertical }: DeadMessageProps) {
  const infraFacts = buildMessagingInfraFacts(deadMessage?.infra);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact
        vertical={vertical}
        isLoading={isLoading}
        label="Death ID"
        renderWhenEmpty="-"
        value={deadMessage?.deathId ? <UUID canCopy short uuid={deadMessage?.deathId} /> : undefined}
      />

      <NutritionFact vertical={vertical} isLoading={isLoading} label="Handler App" renderWhenEmpty="-" value={deadMessage?.handlerApp} />

      <NutritionFact vertical={vertical} isLoading={isLoading} label="Handler Environment" renderWhenEmpty="-" value={deadMessage?.handlerEnv} />

      <O5Message message={deadMessage?.message} heading="Message" isLoading={isLoading} vertical={vertical} />

      {deadMessage?.problem && <MessageProblem problem={deadMessage?.problem} isLoading={isLoading} vertical={vertical} />}

      {deadMessage?.infra && (
        <>
          <span>Infra</span>

          <NutritionFact vertical={vertical} isLoading={isLoading} {...infraFacts.type} />
          <NutritionFact vertical={vertical} isLoading={isLoading} {...infraFacts.metadata} />
        </>
      )}
    </>
  );
}
