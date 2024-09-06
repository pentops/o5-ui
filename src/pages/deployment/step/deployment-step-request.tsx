import React from 'react';
import { match, P } from 'ts-pattern';
import { O5AwsDeployerV1StepRequestType } from '@/data/types';
import { StackInput } from '@/pages/deployment/spec/stack-input.tsx';
import { StackOutput } from '@/pages/stack/spec/stack-output.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getYesNoOrUndefined } from '@/lib/bool.ts';
import { NumberFormat } from '@/components/format/number/number-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { PostgresSpec } from '@/pages/deployment/spec/postgres-spec.tsx';

interface DeploymentStepRequestProps {
  heading?: React.ReactNode;
  request: O5AwsDeployerV1StepRequestType | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function DeploymentStepRequest({ heading, request, isLoading, vertical }: DeploymentStepRequestProps) {
  return (
    <>
      {heading && <span>{heading}</span>}

      {match(request)
        .with({ evalJoin: P.not(P.nullish) }, () => null)
        .with({ cfCreate: P.not(P.nullish) }, (r) => (
          <>
            <NutritionFact
              renderWhenEmpty="-"
              isLoading={isLoading}
              vertical={vertical}
              label="Empty Stack"
              value={getYesNoOrUndefined(r.cfCreate.emptyStack)}
            />
            <StackInput spec={r.cfCreate.spec} heading="Spec" isLoading={isLoading} vertical={vertical} />
            <StackOutput output={r.cfCreate.output} heading="Output" isLoading={isLoading} vertical={vertical} />
          </>
        ))
        .with({ cfPlan: P.not(P.nullish) }, (r) => (
          <>
            <NutritionFact
              renderWhenEmpty="-"
              isLoading={isLoading}
              vertical={vertical}
              label="Import Resources"
              value={getYesNoOrUndefined(r.cfPlan.importResources)}
            />
            <StackInput spec={r.cfPlan.spec} heading="Spec" isLoading={isLoading} vertical={vertical} />
          </>
        ))
        .with({ cfUpdate: P.not(P.nullish) }, (r) => (
          <>
            <StackInput spec={r.cfUpdate.spec} heading="Spec" isLoading={isLoading} vertical={vertical} />
            <StackOutput output={r.cfUpdate.output} heading="Output" isLoading={isLoading} vertical={vertical} />
          </>
        ))
        .with({ cfScale: P.not(P.nullish) }, (r) => (
          <>
            <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="Stack Name" value={r.cfScale.stackName} />
            <NutritionFact
              isLoading={isLoading}
              vertical={vertical}
              renderWhenEmpty="-"
              label="Desired Count"
              value={r.cfScale.desiredCount !== undefined ? <NumberFormat value={r.cfScale.desiredCount} /> : undefined}
            />
          </>
        ))
        .with({ pgUpsert: P.not(P.nullish) }, (r) => (
          <>
            <NutritionFact
              isLoading={isLoading}
              vertical={vertical}
              renderWhenEmpty="-"
              label="Infra Output Step ID"
              value={r.pgUpsert.infraOutputStepId ? <UUID canCopy short uuid={r.pgUpsert.infraOutputStepId} /> : undefined}
            />
            <NutritionFact
              renderWhenEmpty="-"
              isLoading={isLoading}
              vertical={vertical}
              label="Rotate Credentials"
              value={getYesNoOrUndefined(r.pgUpsert.rotateCredentials)}
            />
            <PostgresSpec spec={r.pgUpsert.spec} heading="Spec" isLoading={isLoading} vertical={vertical} />
          </>
        ))
        .with({ pgEvaluate: P.not(P.nullish) }, (r) => (
          <NutritionFact isLoading={isLoading} vertical={vertical} renderWhenEmpty="-" label="Database Name" value={r.pgEvaluate.dbName} />
        ))
        .with({ pgCleanup: P.not(P.nullish) }, (r) => (
          <PostgresSpec spec={r.pgCleanup.spec} heading="Spec" isLoading={isLoading} vertical={vertical} />
        ))
        .with({ pgMigrate: P.not(P.nullish) }, (r) => (
          <>
            <NutritionFact
              isLoading={isLoading}
              vertical={vertical}
              renderWhenEmpty="-"
              label="ECS Cluster Name"
              value={r.pgMigrate.ecsClusterName}
            />
            <NutritionFact
              isLoading={isLoading}
              vertical={vertical}
              renderWhenEmpty="-"
              label="Infra Output Step ID"
              value={r.pgMigrate.infraOutputStepId ? <UUID canCopy short uuid={r.pgMigrate.infraOutputStepId} /> : undefined}
            />
            <PostgresSpec spec={r.pgMigrate.spec} heading="Spec" isLoading={isLoading} vertical={vertical} />
          </>
        ))
        .otherwise(() => null)}
    </>
  );
}
