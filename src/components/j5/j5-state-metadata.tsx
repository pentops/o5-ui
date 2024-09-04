import React from 'react';
import { J5StateV1StateMetadata } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { buildJ5StateMetadataFacts } from '@/lib/metadata.tsx';

interface J5StateMetadataProps {
  heading?: React.ReactNode;
  metadata: J5StateV1StateMetadata | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function J5StateMetadata({ heading, metadata, isLoading, vertical }: J5StateMetadataProps) {
  const metadataFacts = buildJ5StateMetadataFacts(metadata);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact isLoading={isLoading} vertical={vertical} {...metadataFacts.createdAt} />

      <NutritionFact isLoading={isLoading} vertical={vertical} {...metadataFacts.updatedAt} />

      <NutritionFact isLoading={isLoading} vertical={vertical} {...metadataFacts.lastSequence} />
    </>
  );
}
