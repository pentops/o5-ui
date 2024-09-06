import React from 'react';
import { match, P } from 'ts-pattern';
import { getOneOfType, O5AwsDeployerV1StepOutputType } from '@/data/types';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { StackOutput } from '@/pages/stack/spec/stack-output.tsx';
import { ChangesetOutput } from '@/pages/deployment/step/changeset-output.tsx';

interface StepOutputProps {
  heading?: React.ReactNode;
  output: O5AwsDeployerV1StepOutputType | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function StepOutput({ heading, output, isLoading, vertical }: StepOutputProps) {
  const outputType = getOneOfType(output);

  return (
    <>
      {heading && <span>{heading}</span>}

      {outputType && <TranslatedText i18nKey={`awsDeployer:oneOf.O5AwsDeployerV1StepOutputType.${outputType}`} />}

      {match(output)
        .with({ cfStatus: P.not(P.nullish) }, (o) => (
          <StackOutput vertical={vertical} isLoading={isLoading} heading="Output" output={o.cfStatus.output} />
        ))
        .with({ cfPlanStatus: P.not(P.nullish) }, (o) => (
          <ChangesetOutput vertical={vertical} isLoading={isLoading} heading="Output" output={o.cfPlanStatus.output} />
        ))
        .otherwise(() => null)}
    </>
  );
}
