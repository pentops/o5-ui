import React from 'react';
import { O5DanteV1DeadMessageVersion } from '@/data/types';
import { SQSMessage } from '@/pages/dead-letter/dead-message/sqs-message.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { O5Message } from '@/pages/dead-letter/dead-message/o5-message.tsx';

interface DeadMessageVersionProps {
  heading?: React.ReactNode;
  isLoading?: boolean;
  version: O5DanteV1DeadMessageVersion | undefined;
  vertical?: boolean;
}

export function DeadMessageVersion({ heading, isLoading, version, vertical }: DeadMessageVersionProps) {
  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact
        vertical
        label="Version ID"
        renderWhenEmpty="-"
        value={version?.versionId ? <UUID canCopy short uuid={version?.versionId} /> : undefined}
      />

      <O5Message message={version?.message} heading="Message" isLoading={isLoading} vertical={vertical} />

      <SQSMessage heading="SQS Message" isLoading={isLoading} message={version?.sqsMessage} vertical={vertical} />
    </>
  );
}
