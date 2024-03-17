import {
  deploymentStepOutputTypeLabels,
  deploymentStepRequestTypeLabels,
  deploymentStepStatusLabels,
  getDeploymentStepOutputType,
  getDeploymentStepRequestType,
  O5DeployerV1CFStackInput,
  O5DeployerV1CloudFormationStackParameter,
  O5DeployerV1DeploymentSpec,
  O5DeployerV1DeploymentStep,
  O5DeployerV1PostgresSpec,
} from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { match, P } from 'ts-pattern';
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { NumberFormat } from '@/components/format/number/number-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';

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

export function buildDeploymentStepFacts(steps: O5DeployerV1DeploymentStep[] | undefined) {
  return (
    ((steps?.length || 0) > 0 && (
      <div className="flex flex-col gap-2">
        <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-start gap-1" type="button">
              <CaretDownIcon />
              <h4 className="text-lg">Steps</h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {steps?.map((step) => (
              <div
                key={step.id}
                className="flex flex-col gap-3 p-2 [&:not(:last-child)]:border-b border-slate-900/10 lg:border-1 dark:border-slate-300/10"
              >
                <div className="grid grid-cols-2 gap-2">
                  <NutritionFact renderWhenEmpty="-" label="ID" value={step.id ? <UUID short canCopy uuid={step.id} /> : undefined} />
                  <NutritionFact renderWhenEmpty="-" label="Name" value={step.name} />
                  <NutritionFact renderWhenEmpty="-" label="Depends On" value={step.dependsOn?.join(', ')} />
                  <NutritionFact renderWhenEmpty="-" label="Status" value={deploymentStepStatusLabels[step.status!]} />
                  <NutritionFact renderWhenEmpty="-" label="Error" value={step.error} />
                </div>

                {step.request && (
                  <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-start gap-1" type="button">
                        <CaretDownIcon />
                        <h4 className="text-lg">Request</h4>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 p-2">
                        <span>{deploymentStepRequestTypeLabels[getDeploymentStepRequestType(step.request)]}</span>

                        {match(step.request?.type)
                          .with({ cfCreate: P.not(P.nullish) }, (t) => (
                            <div className="flex flex-col gap-3">
                              {buildCFStackInput(t.cfCreate.spec)}

                              {buildCFStackOutput(t.cfCreate.output)}
                            </div>
                          ))
                          .with({ cfPlan: P.not(P.nullish) }, (t) => buildCFStackInput(t.cfPlan.spec))
                          .with({ cfScale: P.not(P.nullish) }, (t) => (
                            <div className="grid grid-cols-2 gap-2">
                              <NutritionFact renderWhenEmpty="-" label="Stack Name" value={t.cfScale.stackName} />
                              <NutritionFact
                                renderWhenEmpty="-"
                                label="Desired Count"
                                value={t.cfScale.desiredCount !== undefined ? <NumberFormat value={t.cfScale.desiredCount} /> : undefined}
                              />
                            </div>
                          ))
                          .with({ cfUpdate: P.not(P.nullish) }, (t) => (
                            <div className="flex flex-col gap-3">
                              {buildCFStackInput(t.cfUpdate.spec)}

                              {buildCFStackOutput(t.cfUpdate.output)}
                            </div>
                          ))
                          .with({ pgEvaluate: P.not(P.nullish) }, (t) => (
                            <div className="grid grid-cols-2 gap-2">
                              <NutritionFact renderWhenEmpty="-" label="Database Name" value={t.pgEvaluate.dbName} />
                            </div>
                          ))
                          .with({ pgCleanup: P.not(P.nullish) }, (t) => buildPostgresSpecFacts(t.pgCleanup.spec))

                          .with({ pgMigrate: P.not(P.nullish) }, (t) => (
                            <div className="grid grid-cols-2 gap-2">
                              <NutritionFact
                                renderWhenEmpty="-"
                                label="Infrastructure Output Step ID"
                                value={t.pgMigrate.infraOutputStepId ? <UUID canCopy uuid={t.pgMigrate.infraOutputStepId} /> : undefined}
                              />
                              {buildPostgresSpecFacts(t.pgMigrate.spec)}
                            </div>
                          ))
                          .with({ pgUpsert: P.not(P.nullish) }, (t) => (
                            <div className="grid grid-cols-2 gap-2">
                              <NutritionFact
                                renderWhenEmpty="-"
                                label="Infrastructure Output Step ID"
                                value={t.pgUpsert.infraOutputStepId ? <UUID canCopy uuid={t.pgUpsert.infraOutputStepId} /> : undefined}
                              />
                              {buildPostgresSpecFacts(t.pgUpsert.spec)}
                            </div>
                          ))
                          .otherwise(() => null)}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {step.output && (
                  <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-start gap-1" type="button">
                        <CaretDownIcon />
                        <h4 className="text-lg">Output</h4>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 p-2">
                        <span>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(step.output)]}</span>

                        {match(step.output?.type)
                          .with({ cfStatus: P.not(P.nullish) }, (t) => buildCFStackOutput(t.cfStatus.output))
                          .otherwise(() => null)}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )) || '-'}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )) ||
    null
  );
}
