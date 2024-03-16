import {
  O5DeployerV1CFStackInput,
  O5DeployerV1CloudFormationStackParameter,
  O5DeployerV1DeploymentSpec,
  O5DeployerV1PostgresSpec,
} from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { match, P } from 'ts-pattern';
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { NumberFormat } from '@/components/format/number/number-format.tsx';

export function getStackParameterSourceValue(source: O5DeployerV1CloudFormationStackParameter['source'] | undefined) {
  return match(source)
    .with({ value: P.string }, (p) => p.value)
    .with({ resolve: P.not(P.nullish) }, (p) =>
      match(p.resolve.type)
        .with({ rulePriority: P.not(P.nullish) }, (s) => `Route Group: ${s.rulePriority.routeGroup}`)
        .with({ desiredCount: P.not(P.nullish) }, () => 'Desired Count')
        .otherwise(() => '-'),
    )
    .otherwise(() => '-');
}

export function buildCFStackInput(spec: O5DeployerV1CFStackInput | undefined) {
  return (
    <div className="flex flex-col gap-2">
      <h6 className="text-lg">Spec</h6>
      <div className="grid grid-cols-2 gap-2">
        <NutritionFact renderWhenEmpty="-" label="Stack Name" value={spec?.stackName} />
        <NutritionFact
          renderWhenEmpty="-"
          label="Template URL"
          value={
            spec?.templateUrl ? (
              <a href={spec.templateUrl} target="_blank">
                {spec.templateUrl}
              </a>
            ) : undefined
          }
        />
        <NutritionFact
          renderWhenEmpty="-"
          label="Desired Count"
          value={spec?.desiredCount !== undefined ? <NumberFormat value={spec.desiredCount} /> : undefined}
        />
        <NutritionFact renderWhenEmpty="-" label="SNS Topics" value={spec?.snsTopics?.join(', ')} />
      </div>

      {(spec?.parameters?.length || 0) > 0 && (
        <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-start gap-1" type="button">
              <CaretDownIcon />
              <h4 className="text-lg">Parameters</h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 p-2">
              {spec?.parameters?.map((param) => (
                <div
                  key={param.name}
                  className="grid grid-cols-2 gap-2 py-2 px-1 [&:not(:last-child)]:border-b border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10"
                >
                  <NutritionFact label="Name" value={param.name} />
                  <NutritionFact label="Source" value={getStackParameterSourceValue(param.source)} />
                </div>
              )) || '-'}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function buildPostgresSpecFacts(spec: O5DeployerV1PostgresSpec | undefined) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NutritionFact label="Name" value={spec?.dbName} />
      <NutritionFact label="Migration Task Output Name" value={spec?.migrationTaskOutputName} />
      <NutritionFact label="Root Secret Name" value={spec?.rootSecretName} />
      <NutritionFact label="Secret Output Name" value={spec?.secretOutputName} />
      <NutritionFact label="Extensions" value={spec?.dbExtensions?.join(', ')} />
    </div>
  );
}

export function buildDeploymentSpecFacts(spec: O5DeployerV1DeploymentSpec | undefined) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl">Spec</h3>

      <div className="grid grid-cols-2 gap-2">
        <NutritionFact
          label="Template URL"
          value={
            spec?.templateUrl ? (
              <a href={spec.templateUrl} target="_blank">
                {spec.templateUrl}
              </a>
            ) : undefined
          }
        />
        <NutritionFact label="ECS Cluster" value={spec?.ecsCluster} />
      </div>

      <h4 className="text-lg">Flags</h4>

      <div className="grid grid-cols-2 gap-2">
        <NutritionFact label="Cancel Updates" value={spec?.flags?.cancelUpdates ? 'Yes' : 'No'} />
        <NutritionFact label="Rotate Credentials" value={spec?.flags?.rotateCredentials ? 'Yes' : 'No'} />
        <NutritionFact label="Quick Mode" value={spec?.flags?.quickMode ? 'Yes' : 'No'} />
        <NutritionFact label="Infra Only" value={spec?.flags?.infraOnly ? 'Yes' : 'No'} />
        <NutritionFact label="Database Only" value={spec?.flags?.dbOnly ? 'Yes' : 'No'} />
      </div>

      {(spec?.snsTopics?.length || 0) > 0 && (
        <>
          <h4 className="text-lg">SNS Topics</h4>
          {spec?.snsTopics?.join(', ') || '-'}
        </>
      )}

      {(spec?.databases?.length || 0) > 0 && (
        <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-start gap-1" type="button">
              <CaretDownIcon />
              <h4 className="text-lg">Databases</h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {spec?.databases?.map((db) => (
              <div
                key={db.dbName}
                className="flex flex-col gap-2 p-2 [&:not(:last-child)]:border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10"
              >
                {buildPostgresSpecFacts(db)}
              </div>
            )) || '-'}
          </CollapsibleContent>
        </Collapsible>
      )}

      {(spec?.parameters?.length || 0) > 0 && (
        <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-start gap-1" type="button">
              <CaretDownIcon />
              <h4 className="text-lg">Parameters</h4>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            {spec?.parameters?.map((param) => (
              <div
                key={param.name}
                className="grid grid-cols-2 gap-2 py-2 px-1 [&:not(:last-child)]:border-b border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10"
              >
                <NutritionFact label="Name" value={param.name} />
                <NutritionFact label="Source" value={getStackParameterSourceValue(param.source)} />
              </div>
            )) || '-'}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
