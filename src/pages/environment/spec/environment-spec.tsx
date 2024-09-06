import React from 'react';
import { O5EnvironmentV1Environment } from '@/data/types';
import { buildDeployerEnvironment } from '@/pages/environment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { AWSEnvironment } from '@/pages/environment/spec/aws-environment.tsx';

interface EnvironmentSpecProps {
  heading?: React.ReactNode;
  spec: O5EnvironmentV1Environment | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function EnvironmentSpec({ heading, spec, isLoading, vertical }: EnvironmentSpecProps) {
  const specFacts = buildDeployerEnvironment(spec);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.fullName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.clusterName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.trustJwks} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.corsOrigins} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.vars} />

      <AWSEnvironment spec={spec?.aws} heading="AWS" isLoading={isLoading} vertical={vertical} />
    </>
  );
}
