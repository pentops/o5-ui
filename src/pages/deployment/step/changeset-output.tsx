import React from 'react';
import { O5AwsDeployerV1CfChangesetOutput } from '@/data/types';
import { buildDeployerCloudFormationChangeSetOutputFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface ChangesetOutputProps {
  heading?: React.ReactNode;
  output: O5AwsDeployerV1CfChangesetOutput | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function ChangesetOutput({ heading, output, isLoading, vertical }: ChangesetOutputProps) {
  const changeSetOutputFacts = buildDeployerCloudFormationChangeSetOutputFacts(output);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...changeSetOutputFacts.lifecycle} />
    </>
  );
}
