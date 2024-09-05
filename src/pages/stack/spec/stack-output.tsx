import React from 'react';
import { O5AwsDeployerV1CfStackOutput } from '@/data/types';
import { buildDeployerCloudFormationStackOutputFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface StackOutputProps {
  heading?: React.ReactNode;
  output: O5AwsDeployerV1CfStackOutput | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function StackOutput({ heading, output, isLoading, vertical }: StackOutputProps) {
  const stackOutputFacts = buildDeployerCloudFormationStackOutputFacts(output);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...stackOutputFacts.lifecycle} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...stackOutputFacts.outputs} />
    </>
  );
}
