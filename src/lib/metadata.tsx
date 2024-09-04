import React from 'react';
import {
  J5AuthV1Actor,
  J5AuthV1AuthenticationMethod,
  J5AuthV1AuthenticationMethodExternal,
  J5AuthV1AuthenticationMethodJwt,
  J5AuthV1AuthenticationMethodSession,
  J5StateV1EventMetadata,
  J5StateV1StateMetadata,
} from '@/data/types';
import { NutritionFactProps } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { match, P } from 'ts-pattern';

export function buildJ5StateMetadataFacts(data: J5StateV1StateMetadata | undefined) {
  const base: Record<keyof J5StateV1StateMetadata, NutritionFactProps> = {
    createdAt: {
      renderWhenEmpty: '-',
      label: 'Created At',
      value: data?.createdAt ? (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={data.createdAt}
        />
      ) : null,
    },
    updatedAt: {
      renderWhenEmpty: '-',
      label: 'Updated At',
      value: data?.updatedAt ? (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={data.updatedAt}
        />
      ) : null,
    },
    lastSequence: { renderWhenEmpty: '-', label: 'Last Sequence', value: data?.lastSequence },
  };

  return base;
}

export function buildJ5AuthenticationMethodFacts(method: J5AuthV1AuthenticationMethod | undefined) {
  return match(method)
    .with({ jwt: P.not(P.nullish) }, ({ jwt }) => {
      const base: Record<keyof J5AuthV1AuthenticationMethodJwt, NutritionFactProps> = {
        jwtId: { renderWhenEmpty: '-', label: 'JWT ID', value: jwt.jwtId ? <UUID canCopy short uuid={jwt.jwtId} /> : null },
        issuer: { renderWhenEmpty: '-', label: 'Issuer', value: jwt.issuer },
        issuedAt: {
          renderWhenEmpty: '-',
          label: 'Issued At',
          value: jwt.issuedAt ? (
            <DateFormat
              day="2-digit"
              hour="numeric"
              minute="2-digit"
              second="numeric"
              month="2-digit"
              timeZoneName="short"
              year="numeric"
              value={jwt.issuedAt}
            />
          ) : null,
        },
      };

      return { jwt: base } as const;
    })
    .with({ session: P.not(P.nullish) }, ({ session }) => {
      const base: Record<keyof J5AuthV1AuthenticationMethodSession, NutritionFactProps> = {
        sessionManager: { renderWhenEmpty: '-', label: 'Session Manager', value: session.sessionManager },
        sessionId: { renderWhenEmpty: '-', label: 'Session ID', value: session.sessionId ? <UUID canCopy short uuid={session.sessionId} /> : null },
        verifiedAt: {
          renderWhenEmpty: '-',
          label: 'Verified At',
          value: session.verifiedAt ? (
            <DateFormat
              day="2-digit"
              hour="numeric"
              minute="2-digit"
              second="numeric"
              month="2-digit"
              timeZoneName="short"
              year="numeric"
              value={session.verifiedAt}
            />
          ) : null,
        },
        authenticatedAt: {
          renderWhenEmpty: '-',
          label: 'Authenticated At',
          value: session.authenticatedAt ? (
            <DateFormat
              day="2-digit"
              hour="numeric"
              minute="2-digit"
              second="numeric"
              month="2-digit"
              timeZoneName="short"
              year="numeric"
              value={session.authenticatedAt}
            />
          ) : null,
        },
      };

      return { session: base } as const;
    })
    .with({ external: P.not(P.nullish) }, ({ external }) => {
      let metadata: string | undefined;

      try {
        metadata = JSON.stringify(external.metadata, null, 2);
      } catch {}

      const base: Record<keyof J5AuthV1AuthenticationMethodExternal, NutritionFactProps> = {
        systemName: { renderWhenEmpty: '-', label: 'System Name', value: external.systemName },
        metadata: { renderWhenEmpty: '-', label: 'Metadata', value: metadata ? <CodeEditor disabled value={metadata} language="json" /> : null },
      };

      return { external: base } as const;
    })
    .otherwise(() => undefined);
}

export function buildJ5ActorFacts(actor: J5AuthV1Actor | undefined) {
  let tags: string | undefined;
  let claim: string | undefined;

  try {
    tags = JSON.stringify(actor?.actorTags, null, 2);
  } catch {}

  try {
    claim = JSON.stringify(actor?.claim, null, 2);
  } catch {}

  const base: Omit<Record<keyof J5AuthV1Actor, NutritionFactProps>, 'authenticationMethod'> = {
    actorTags: { renderWhenEmpty: '-', label: 'Actor Tags', value: tags ? <CodeEditor disabled value={tags} language="json" /> : null },
    claim: { renderWhenEmpty: '-', label: 'Claim', value: claim ? <CodeEditor disabled value={claim} language="json" /> : null },
    subjectId: { renderWhenEmpty: '-', label: 'Subject ID', value: actor?.subjectId ? <UUID canCopy short uuid={actor.subjectId} /> : null },
    subjectType: { renderWhenEmpty: '-', label: 'Subject Type', value: actor?.subjectType },
  };

  return base;
}

export function buildJ5EventMetadataFacts(data: J5StateV1EventMetadata | undefined) {
  const base: Omit<Record<keyof J5StateV1EventMetadata, NutritionFactProps>, 'cause'> = {
    eventId: { renderWhenEmpty: '-', label: 'Event ID', value: data?.eventId ? <UUID canCopy short uuid={data.eventId} /> : null },
    timestamp: {
      renderWhenEmpty: '-',
      label: 'Timestamp',
      value: data?.timestamp ? (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={data.timestamp}
        />
      ) : null,
    },
    sequence: { renderWhenEmpty: '-', label: 'Sequence', value: data?.sequence },
  };

  return base;
}
