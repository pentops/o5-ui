import React from 'react';
import { O5AwsDeployerV1S3Template } from '@/data/types';
import { buildDeployerS3TemplateSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface S3TemplateProps {
  heading?: React.ReactNode;
  spec: O5AwsDeployerV1S3Template | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function S3Template({ heading, spec, isLoading, vertical }: S3TemplateProps) {
  const templateFacts = buildDeployerS3TemplateSpecFacts(spec);

  return (
    <>
      {heading && <span>{heading}</span>}
      <NutritionFact vertical={vertical} isLoading={isLoading} {...templateFacts.bucket} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...templateFacts.key} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...templateFacts.region} />
    </>
  );
}
