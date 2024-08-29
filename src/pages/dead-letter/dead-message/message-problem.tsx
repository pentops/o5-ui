import React from 'react';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { match, P } from 'ts-pattern';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getOneOfType, O5MessagingV1Problem } from '@/data/types';
import { buildMessagingProblemFacts } from '@/pages/dead-letter/build-facts.tsx';

interface MessageProblemProps {
  heading?: React.ReactNode;
  problem: O5MessagingV1Problem | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function MessageProblem({ heading, problem, isLoading, vertical }: MessageProblemProps) {
  const problemType = getOneOfType(problem);
  const problemFacts = buildMessagingProblemFacts(problem);

  return (
    <>
      {heading && <span>{heading}</span>}

      {problemType && <TranslatedText i18nKey={`dante:oneOf.O5MessagingV1Problem.${problemType}`} />}

      {match(problemFacts)
        .with({ unhandledError: P.not(P.nullish) }, (p) => <NutritionFact vertical={vertical} isLoading={isLoading} {...p.unhandledError.error} />)
        .otherwise(() => null)}
    </>
  );
}
