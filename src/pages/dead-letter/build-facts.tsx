import React from 'react';
import { match, P } from 'ts-pattern';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { O5MessagingV1Problem } from '@/data/types';

export function buildDeadMessageProblemFacts(problem: O5MessagingV1Problem | undefined) {
  return match(problem)
    .with({ unhandledError: P.not(P.nullish) }, (p) => {
      return <NutritionFact vertical label="Error" value={p.unhandledError.error} />;
    })
    .otherwise(() => null);
}
