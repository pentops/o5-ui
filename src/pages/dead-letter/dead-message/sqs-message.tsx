import React from 'react';
import { O5DanteV1DeadMessageVersionSqsMessage } from '@/data/types';
import { buildDanteSQSMessageFacts } from '@/pages/dead-letter/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface SQSMessageProps {
  heading: React.ReactNode;
  isLoading?: boolean;
  message: O5DanteV1DeadMessageVersionSqsMessage | undefined;
  vertical?: boolean;
}

export function SQSMessage({ heading, isLoading, message, vertical }: SQSMessageProps) {
  const sqsMessageFacts = buildDanteSQSMessageFacts(message);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...sqsMessageFacts.queueUrl} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...sqsMessageFacts.attributes} />
    </>
  );
}
