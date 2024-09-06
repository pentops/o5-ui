import React from 'react';
import { O5AwsDeployerV1CfStackInput } from '@/data/types';
import { buildDeployerCFStackInputFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { S3Template } from '@/pages/deployment/spec/s3-template.tsx';
import { CFStackParameter } from '@/pages/deployment/spec/cf-stack-parameter.tsx';

interface StackInputProps {
  heading?: React.ReactNode;
  spec: O5AwsDeployerV1CfStackInput | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function StackInput({ heading, spec, isLoading, vertical }: StackInputProps) {
  const specFacts = buildDeployerCFStackInputFacts(spec);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.stackName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.emptyStack} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.snsTopics} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.desiredCount} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.templateBody} />

      <S3Template spec={spec?.s3Template} isLoading={isLoading} vertical={vertical} />

      <span>Parameters</span>

      {spec?.parameters?.map((parameter, index) => (
        <CFStackParameter spec={parameter} key={parameter.name || index} isLoading={isLoading} vertical={vertical} />
      ))}
    </>
  );
}
