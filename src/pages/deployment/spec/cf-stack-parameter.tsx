import React from 'react';
import { match, P } from 'ts-pattern';
import { getOneOfType, O5AwsDeployerV1CloudFormationStackParameter } from '@/data/types';
import {
  buildDeployerCloudFormationStackParameterFacts,
  buildDeployerCloudFormationStackParameterTypeFacts,
} from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';

interface CFStackParameterProps {
  heading?: React.ReactNode;
  spec: O5AwsDeployerV1CloudFormationStackParameter | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function CFStackParameter({ heading, spec, isLoading, vertical }: CFStackParameterProps) {
  const parameterFacts = buildDeployerCloudFormationStackParameterFacts(spec);
  const typeFacts = buildDeployerCloudFormationStackParameterTypeFacts(spec?.resolve);
  const oneOfType = getOneOfType(spec?.resolve);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...parameterFacts.name} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...parameterFacts.value} />

      {typeFacts && oneOfType && (
        <>
          <TranslatedText i18nKey={`deployment.oneOf.O5AwsDeployerV1CloudFormationStackParameterType.${oneOfType}`} />

          {match(typeFacts)
            .with({ rulePriority: P.not(P.nullish) }, (r) => (
              <NutritionFact vertical={vertical} isLoading={isLoading} {...r.rulePriority.routeGroup} />
            ))
            .otherwise(() => null)}
        </>
      )}
    </>
  );
}
