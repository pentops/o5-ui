import React from 'react';
import { O5EnvironmentV1AwsEnvironment } from '@/data/types';
import { buildDeployerAWSEnvironment, getDeployerAWSEnvironmentLinkKey } from '@/pages/environment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { AWSEnvironmentLink } from '@/pages/environment/spec/aws-environment-link.tsx';

interface AWSEnvironmentProps {
  heading?: React.ReactNode;
  spec: O5EnvironmentV1AwsEnvironment | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function AWSEnvironment({ heading, spec, isLoading, vertical }: AWSEnvironmentProps) {
  const specFacts = buildDeployerAWSEnvironment(spec);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.hostHeader} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.iamPolicies} />

      <span>Links</span>

      {spec?.environmentLinks?.map((link, index) => (
        <AWSEnvironmentLink spec={link} key={getDeployerAWSEnvironmentLinkKey(link, index)} isLoading={isLoading} vertical={vertical} />
      ))}
    </>
  );
}
