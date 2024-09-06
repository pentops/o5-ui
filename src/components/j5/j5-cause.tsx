import React from 'react';
import { match, P } from 'ts-pattern';
import { J5StateV1Cause } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { J5Actor } from '@/components/j5/j5-actor.tsx';
import { J5Fingerprint } from '@/components/j5/j5-fingerprint.tsx';
import { getYesNoOrUndefined } from '@/lib/bool.ts';

interface J5CauseProps {
  heading?: React.ReactNode;
  cause: J5StateV1Cause | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function J5Cause({ heading, cause, isLoading, vertical }: J5CauseProps) {
  return (
    <>
      {heading && <span>{heading}</span>}

      {match(cause)
        .with({ psmEvent: P.not(P.nullish) }, ({ psmEvent }) => (
          <>
            <span>PSM Event</span>

            <NutritionFact
              isLoading={isLoading}
              vertical={vertical}
              renderWhenEmpty="-"
              label="Event ID"
              value={psmEvent.eventId ? <UUID canCopy short uuid={psmEvent.eventId} /> : null}
            />
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="State Machine" value={psmEvent.stateMachine} />
          </>
        ))
        .with({ command: P.not(P.nullish) }, ({ command }) => (
          <>
            <span>Command</span>
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="Method" value={command.method} />

            <J5Actor actor={command.actor} isLoading={isLoading} vertical={vertical} />

            <J5Fingerprint fingerprint={command.fingerprint} isLoading={isLoading} vertical={vertical} />
          </>
        ))
        .with({ externalEvent: P.not(P.nullish) }, ({ externalEvent }) => (
          <>
            <span>External Event</span>
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="External ID" value={externalEvent.externalId} />
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="System Name" value={externalEvent.systemName} />
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="Event Name" value={externalEvent.eventName} />
          </>
        ))
        .with({ reply: P.not(P.nullish) }, ({ reply }) => (
          <>
            <span>Reply</span>
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="Aync" value={getYesNoOrUndefined(reply.async)} />

            <span>Request</span>
            <NutritionFact
              isLoading={isLoading}
              vertical={vertical}
              renderWhenEmpty="-"
              label=""
              value={reply.request?.eventId ? <UUID canCopy short uuid={reply.request.eventId} /> : undefined}
            />
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="State Machine" value={reply.request?.stateMachine} />
          </>
        ))
        .otherwise(() => null)}
    </>
  );
}
