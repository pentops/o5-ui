import React from 'react';
import { O5EnvironmentV1AwsLink } from '@/data/types';
import { buildDeployerAWSEnvironmentLink } from '@/pages/environment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface AWSEnvironmentLinkProps {
  heading?: React.ReactNode;
  spec: O5EnvironmentV1AwsLink | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function AWSEnvironmentLink({ heading, spec, isLoading, vertical }: AWSEnvironmentLinkProps) {
  const specFacts = buildDeployerAWSEnvironmentLink(spec);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.fullName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.lookupName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.snsPrefix} />
    </>
  );
}
