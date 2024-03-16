import { O5DanteV1Problem, O5DanteV1Urgency, urgencyLabels } from '@/data/types';
import { match, P } from 'ts-pattern';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { InvariantViolationPayloadDialog } from '@/pages/dead-letter/invariant-violation-payload-dialog/invariant-violation-payload-dialog.tsx';
import React from 'react';

export function buildDeadMessageProblemFacts(problem: O5DanteV1Problem | undefined) {
  return match(problem?.type)
    .with({ invariantViolation: P.not(P.nullish) }, (p) => {
      return (
        <>
          <NutritionFact label="Description" renderWhenEmpty="-" value={p.invariantViolation?.description} />
          <NutritionFact
            label="Description"
            renderWhenEmpty="-"
            value={urgencyLabels[(p.invariantViolation?.urgency as O5DanteV1Urgency | undefined) || O5DanteV1Urgency.Unspecified]}
          />
          <NutritionFact
            label="Error"
            renderWhenEmpty="-"
            value={<InvariantViolationPayloadDialog payload={p.invariantViolation?.error?.json || ''} />}
          />
        </>
      );
    })
    .with({ unhandledError: P.not(P.nullish) }, (p) => {
      return <NutritionFact vertical label="Error" value={p.unhandledError.error} />;
    })
    .otherwise(() => null);
}
