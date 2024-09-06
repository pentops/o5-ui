import React from 'react';
import { match, P } from 'ts-pattern';
import { J5AuthV1Actor } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { buildJ5ActorFacts, buildJ5AuthenticationMethodFacts } from '@/lib/metadata.tsx';

interface J5ActorProps {
  heading?: React.ReactNode;
  actor: J5AuthV1Actor | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function J5Actor({ heading, actor, isLoading, vertical }: J5ActorProps) {
  const actorFacts = buildJ5ActorFacts(actor);
  const authMethodFacts = buildJ5AuthenticationMethodFacts(actor?.authenticationMethod);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...actorFacts.subjectId} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...actorFacts.subjectType} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...actorFacts.claim} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...actorFacts.actorTags} />

      <span>Authentication Method</span>

      {match(authMethodFacts)
        .with({ jwt: P.not(P.nullish) }, ({ jwt }) => (
          <>
            <NutritionFact vertical={vertical} isLoading={isLoading} {...jwt.jwtId} />
            <NutritionFact vertical={vertical} isLoading={isLoading} {...jwt.issuer} />
            <NutritionFact vertical={vertical} isLoading={isLoading} {...jwt.issuedAt} />
          </>
        ))
        .with({ session: P.not(P.nullish) }, ({ session }) => (
          <>
            <NutritionFact vertical={vertical} isLoading={isLoading} {...session.sessionId} />
            <NutritionFact vertical={vertical} isLoading={isLoading} {...session.sessionManager} />
            <NutritionFact vertical={vertical} isLoading={isLoading} {...session.authenticatedAt} />
            <NutritionFact vertical={vertical} isLoading={isLoading} {...session.verifiedAt} />
          </>
        ))
        .with({ external: P.not(P.nullish) }, ({ external }) => (
          <>
            <NutritionFact vertical={vertical} isLoading={isLoading} {...external.systemName} />
            <NutritionFact vertical={vertical} isLoading={isLoading} {...external.metadata} />
          </>
        ))
        .otherwise(() => (isLoading ? null : <span>-</span>))}
    </>
  );
}
