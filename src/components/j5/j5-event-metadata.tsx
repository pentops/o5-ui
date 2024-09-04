import React from 'react';
import { J5StateV1EventMetadata } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { buildJ5EventMetadataFacts } from '@/lib/metadata.tsx';
import { J5Cause } from '@/components/j5/j5-cause.tsx';

interface J5EventMetadataProps {
  heading?: React.ReactNode;
  metadata: J5StateV1EventMetadata | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function J5EventMetadata({ heading, metadata, isLoading, vertical }: J5EventMetadataProps) {
  const metadataFacts = buildJ5EventMetadataFacts(metadata);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact isLoading={isLoading} vertical={vertical} {...metadataFacts.eventId} />

      <NutritionFact isLoading={isLoading} vertical={vertical} {...metadataFacts.timestamp} />

      <NutritionFact isLoading={isLoading} vertical={vertical} {...metadataFacts.sequence} />

      <J5Cause heading="Cause" cause={metadata?.cause} isLoading={isLoading} vertical={vertical} />
    </>
  );
}
