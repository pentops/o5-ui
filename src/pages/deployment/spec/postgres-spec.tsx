import React from 'react';
import { O5AwsDeployerV1PostgresSpec } from '@/data/types';
import { buildDeployerPostgresSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface PostgresSpecProps {
  heading?: React.ReactNode;
  spec: O5AwsDeployerV1PostgresSpec | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function getPostgresSpecKey(spec: O5AwsDeployerV1PostgresSpec, index: number) {
  return spec?.dbName || spec?.rootSecretName || spec?.migrationTaskOutputName || index;
}

export function PostgresSpec({ heading, spec, isLoading, vertical }: PostgresSpecProps) {
  const specFacts = buildDeployerPostgresSpecFacts(spec);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.dbName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.dbExtensions} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.rootSecretName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.secretOutputName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.migrationTaskOutputName} />
    </>
  );
}
