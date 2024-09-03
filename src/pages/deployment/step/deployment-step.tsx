import React from 'react';
import { O5AwsDeployerV1DeploymentStep } from '@/data/types';
import { buildDeployerDeploymentStepFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { StepOutput } from '@/pages/deployment/step/step-output.tsx';

interface DeploymentStepProps {
  heading?: React.ReactNode;
  step: O5AwsDeployerV1DeploymentStep | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function DeploymentStep({ heading, step, isLoading, vertical }: DeploymentStepProps) {
  const stepFacts = buildDeployerDeploymentStepFacts(step);

  return (
    <>
      {heading && <span>{heading}</span>}

      <div className="grid grid-cols-2 gap-2">
        <NutritionFact isLoading={isLoading} vertical={vertical} {...stepFacts.id} />
        <NutritionFact isLoading={isLoading} vertical={vertical} {...stepFacts.name} />
        <NutritionFact isLoading={isLoading} vertical={vertical} {...stepFacts.status} />
      </div>

      <NutritionFact isLoading={isLoading} vertical={vertical} {...stepFacts.error} />
      <NutritionFact isLoading={isLoading} vertical={vertical} {...stepFacts.dependsOn} />

      <StepOutput isLoading={isLoading} vertical={vertical} heading="Output" output={step?.output} />

      {/* TODO: request */}
    </>
  );
}
