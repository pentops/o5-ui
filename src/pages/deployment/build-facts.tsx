import { NutritionFact, NutritionFactProps } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { match, P } from 'ts-pattern';
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { NumberFormat } from '@/components/format/number/number-format.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';
import { Link } from 'react-router-dom';
import {
  O5AwsDeployerV1CfChangesetOutput,
  O5AwsDeployerV1CfStackInput,
  O5AwsDeployerV1CfStackOutput,
  O5AwsDeployerV1CloudFormationStackParameter,
  O5AwsDeployerV1CloudFormationStackParameterType,
  O5AwsDeployerV1CloudFormationStackParameterTypeRulePriority,
  O5AwsDeployerV1DeploymentFlags,
  O5AwsDeployerV1DeploymentSpec,
  O5AwsDeployerV1DeploymentStep,
  O5AwsDeployerV1PostgresSpec,
  O5AwsDeployerV1S3Template,
} from '@/data/types';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { deployerKeyValuePairsToJSON } from '@/lib/aws.ts';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';

export function buildDeployerCloudFormationStackParameterTypeFacts(param: O5AwsDeployerV1CloudFormationStackParameterType | undefined) {
  return match(param)
    .with({ rulePriority: P.not(P.nullish) }, (t) => {
      const base: Record<keyof O5AwsDeployerV1CloudFormationStackParameterTypeRulePriority, NutritionFactProps> = {
        routeGroup: { renderWhenEmpty: '-', label: 'Route Group', value: t.rulePriority.routeGroup },
      };

      return { rulePriority: base } as Record<keyof O5AwsDeployerV1CloudFormationStackParameterType, typeof base>;
    })
    .with({ desiredCount: P.not(P.nullish) }, () => {
      return { desiredCount: {} } as Record<keyof O5AwsDeployerV1CloudFormationStackParameterType, {}>;
    })
    .otherwise(() => undefined);
}

export function buildDeployerCloudFormationStackParameterFacts(param: O5AwsDeployerV1CloudFormationStackParameter | undefined) {
  const base: Omit<Record<keyof O5AwsDeployerV1CloudFormationStackParameter, NutritionFactProps>, 'resolve'> = {
    name: { renderWhenEmpty: '-', label: 'Name', value: param?.name },
    value: { renderWhenEmpty: '-', label: 'Value', value: param?.value },
  };

  return base;
}

export function buildDeployerS3TemplateSpecFacts(spec: O5AwsDeployerV1S3Template | undefined) {
  const base: Record<keyof O5AwsDeployerV1S3Template, NutritionFactProps> = {
    bucket: { renderWhenEmpty: '-', label: 'Bucket', value: spec?.bucket },
    key: { renderWhenEmpty: '-', label: 'Key', value: spec?.key },
    region: { renderWhenEmpty: '-', label: 'Region', value: spec?.region },
  };

  return base;
}

export function buildDeployerPostgresSpecFacts(spec: O5AwsDeployerV1PostgresSpec | undefined) {
  const base: Record<keyof O5AwsDeployerV1PostgresSpec, NutritionFactProps> = {
    dbName: { renderWhenEmpty: '-', label: 'Database Name', value: spec?.dbName },
    dbExtensions: { renderWhenEmpty: '-', label: 'Extensions', value: spec?.dbExtensions?.join(', ') },
    rootSecretName: { renderWhenEmpty: '-', label: 'Root Secret Name', value: spec?.rootSecretName },
    secretOutputName: { renderWhenEmpty: '-', label: 'Secret Output Name', value: spec?.secretOutputName },
    migrationTaskOutputName: { renderWhenEmpty: '-', label: 'Migration Task Output Name', value: spec?.migrationTaskOutputName },
  };

  return base;
}

export function buildDeployerFlagsFacts(flags: O5AwsDeployerV1DeploymentFlags | undefined) {
  const base: Record<keyof O5AwsDeployerV1DeploymentFlags, NutritionFactProps> = {
    quickMode: { renderWhenEmpty: '-', label: <TranslatedText i18nKey="awsDeployer:flags.quickMode" />, value: flags?.quickMode ? 'Yes' : 'No' },
    rotateCredentials: {
      renderWhenEmpty: '-',
      label: <TranslatedText i18nKey="awsDeployer:flags.rotateCredentials" />,
      value: flags?.rotateCredentials ? 'Yes' : 'No',
    },
    cancelUpdates: {
      renderWhenEmpty: '-',
      label: <TranslatedText i18nKey="awsDeployer:flags.cancelUpdates" />,
      value: flags?.cancelUpdates ? 'Yes' : 'No',
    },
    infraOnly: { renderWhenEmpty: '-', label: <TranslatedText i18nKey="awsDeployer:flags.infraOnly" />, value: flags?.infraOnly ? 'Yes' : 'No' },
    dbOnly: { renderWhenEmpty: '-', label: <TranslatedText i18nKey="awsDeployer:flags.dbOnly" />, value: flags?.dbOnly ? 'Yes' : 'No' },
    importResources: {
      renderWhenEmpty: '-',
      label: <TranslatedText i18nKey="awsDeployer:flags.importResources" />,
      value: flags?.importResources ? 'Yes' : 'No',
    },
  };

  return base;
}

export function buildDeployerDeploymentSpecFacts(spec: O5AwsDeployerV1DeploymentSpec | undefined) {
  const base: Omit<Record<keyof O5AwsDeployerV1DeploymentSpec, NutritionFactProps>, 'databases' | 'flags' | 'template' | 'parameters'> = {
    appName: { renderWhenEmpty: '-', label: 'App Name', value: spec?.appName },
    version: { renderWhenEmpty: '-', label: 'Version', value: spec?.version },
    environmentId: {
      renderWhenEmpty: '-',
      label: 'Environment ID',
      value: spec?.environmentId ? <UUID canCopy short uuid={spec.environmentId} to={`/environment/${spec.environmentId}`} /> : undefined,
    },
    environmentName: { renderWhenEmpty: '-', label: 'Environment Name', value: spec?.environmentName },
    ecsCluster: { renderWhenEmpty: '-', label: 'ECS Cluster', value: spec?.ecsCluster },
    cfStackName: { renderWhenEmpty: '-', label: 'CF Stack Name', value: spec?.cfStackName },
    snsTopics: { renderWhenEmpty: '-', label: 'SNS Topics', value: spec?.snsTopics?.join(', ') },
  };

  return base;
}

export function buildDeployerCloudFormationStackOutputFacts(output: O5AwsDeployerV1CfStackOutput | undefined) {
  const base: Record<keyof O5AwsDeployerV1CfStackOutput, NutritionFactProps> = {
    lifecycle: {
      renderWhenEmpty: '-',
      label: 'Lifecycle',
      value: output?.lifecycle ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1CfLifecycle.${output.lifecycle}`} /> : undefined,
    },
    outputs: {
      renderWhenEmpty: '-',
      label: 'Outputs',
      value: output?.outputs ? <CodeEditor disabled value={deployerKeyValuePairsToJSON(output.outputs)} /> : undefined,
    },
  };

  return base;
}

export function buildDeployerCloudFormationChangeSetOutputFacts(output: O5AwsDeployerV1CfChangesetOutput | undefined) {
  const base: Record<keyof O5AwsDeployerV1CfChangesetOutput, NutritionFactProps> = {
    lifecycle: {
      renderWhenEmpty: '-',
      label: 'Lifecycle',
      value: output?.lifecycle ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1CfChangesetLifecycle.${output.lifecycle}`} /> : undefined,
    },
  };

  return base;
}

export function buildDeployerDeploymentStepFacts(step: O5AwsDeployerV1DeploymentStep | undefined) {
  const base: Omit<Record<keyof O5AwsDeployerV1DeploymentStep, NutritionFactProps>, 'request' | 'output'> = {
    id: { renderWhenEmpty: '-', label: 'ID', value: step?.id ? <UUID canCopy short uuid={step.id} /> : undefined },
    name: { renderWhenEmpty: '-', label: 'Name', value: step?.name },
    status: {
      renderWhenEmpty: '-',
      label: 'Status',
      value: step?.status ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1StepStatus.${step.status}`} /> : undefined,
    },
    error: { renderWhenEmpty: '-', label: 'Error', value: step?.error },
    dependsOn: { renderWhenEmpty: '-', label: 'Depends On', value: step?.dependsOn?.join(', ') },
  };

  return base;
}

export function buildCFStackInput(spec: O5AwsDeployerV1CfStackInput | undefined) {
  return (
    <div className="flex flex-col gap-2">
      <h6 className="text-lg">Spec</h6>
      <div className="grid grid-cols-2 gap-2">
        <NutritionFact renderWhenEmpty="-" label="Stack Name" value={spec?.stackName} />
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
                  <NutritionFact label="Value" value={param.value} />
                </div>
              )) || '-'}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function buildPostgresSpecFacts(spec: O5AwsDeployerV1PostgresSpec | undefined) {
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

export function buildDeploymentSpecFacts(
  spec: O5AwsDeployerV1DeploymentSpec | undefined,
  exclude?: (keyof O5AwsDeployerV1DeploymentSpec)[],
  isLoading?: boolean,
) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl">Spec</h3>

      <div className="grid grid-cols-2 gap-2">
        {!exclude?.includes('appName') && <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="App Name" value={spec?.appName} />}
        {!exclude?.includes('environmentName') && (
          <NutritionFact
            renderWhenEmpty="-"
            isLoading={isLoading}
            label="Environment"
            value={
              spec?.environmentId ? (
                <Link to={`/environment/${spec.environmentId}`}>{spec.environmentName || spec.environmentId}</Link>
              ) : (
                spec?.environmentName
              )
            }
          />
        )}
        {!exclude?.includes('version') && (
          <NutritionFact renderWhenEmpty="-" label="Version" value={spec?.version ? <UUID canCopy short uuid={spec.version} /> : undefined} />
        )}
        {/*{!exclude?.includes('templateUrl') && (*/}
        {/*  <NutritionFact*/}
        {/*    renderWhenEmpty="-"*/}
        {/*    isLoading={isLoading}*/}
        {/*    label="Template URL"*/}
        {/*    value={*/}
        {/*      spec?.templateUrl ? (*/}
        {/*        <a href={spec.templateUrl} target="_blank">*/}
        {/*          {spec.templateUrl}*/}
        {/*        </a>*/}
        {/*      ) : undefined*/}
        {/*    }*/}
        {/*  />*/}
        {/*)}*/}
        {!exclude?.includes('ecsCluster') && <NutritionFact renderWhenEmpty="-" label="ECS Cluster" value={spec?.ecsCluster} />}
        {/*{!exclude?.includes('source') && buildCodeSourceFact(spec?.source, isLoading)}*/}
      </div>

      <h4 className="text-lg">Flags</h4>

      <div className="grid grid-cols-2 gap-2">
        <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="Cancel Updates" value={spec?.flags?.cancelUpdates ? 'Yes' : 'No'} />
        <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="Rotate Credentials" value={spec?.flags?.rotateCredentials ? 'Yes' : 'No'} />
        <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="Quick Mode" value={spec?.flags?.quickMode ? 'Yes' : 'No'} />
        <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="Infra Only" value={spec?.flags?.infraOnly ? 'Yes' : 'No'} />
        <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="Database Only" value={spec?.flags?.dbOnly ? 'Yes' : 'No'} />
        <NutritionFact renderWhenEmpty="-" isLoading={isLoading} label="Import Resources" value={spec?.flags?.importResources ? 'Yes' : 'No'} />
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
                <NutritionFact label="Value" value={param.value} />
              </div>
            )) || '-'}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function buildDeploymentStepFacts(steps: O5AwsDeployerV1DeploymentStep[] | undefined) {
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
                  <NutritionFact
                    renderWhenEmpty="-"
                    label="Depends On"
                    value={
                      step.dependsOn ? (
                        <ul>
                          {step.dependsOn?.reduce<React.ReactNode[]>((acc, curr) => {
                            const match = steps.find((s) => s.id === curr);

                            return [
                              ...acc,
                              <li key={curr}>
                                <UUID canCopy short uuid={curr} />
                                {match?.name ? ` (${match.name})` : null}
                              </li>,
                            ];
                          }, [])}
                        </ul>
                      ) : undefined
                    }
                  />
                  <NutritionFact
                    renderWhenEmpty="-"
                    label="Status"
                    value={step.status ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1StepStatus.${step.status}`} /> : undefined}
                  />
                  {step.error && <NutritionFact renderWhenEmpty="-" label="Error" value={step.error} />}
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
                        {/*<span>{deploymentStepRequestTypeLabels[getDeploymentStepRequestType(step.request)]}</span>*/}

                        {match(step.request)
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

                          .with({ pgMigrate: P.not(P.nullish) }, (t) => {
                            const matchingInfraOutputStep = steps.find((s) => s.id === t.pgMigrate.infraOutputStepId)?.name;

                            return (
                              <div className="grid grid-cols-2 gap-2">
                                <NutritionFact
                                  renderWhenEmpty="-"
                                  label="Infrastructure Output Step ID"
                                  value={
                                    t.pgMigrate.infraOutputStepId ? (
                                      <>
                                        <UUID canCopy short uuid={t.pgMigrate.infraOutputStepId} />
                                        {matchingInfraOutputStep ? ` (${matchingInfraOutputStep})` : null}
                                      </>
                                    ) : undefined
                                  }
                                />
                                {buildPostgresSpecFacts(t.pgMigrate.spec)}
                              </div>
                            );
                          })
                          .with({ pgUpsert: P.not(P.nullish) }, (t) => {
                            const matchingInfraOutputStep = steps.find((s) => s.id === t.pgUpsert.infraOutputStepId)?.name;

                            return (
                              <div className="grid grid-cols-2 gap-2">
                                <NutritionFact
                                  renderWhenEmpty="-"
                                  label="Infrastructure Output Step ID"
                                  value={
                                    t.pgUpsert.infraOutputStepId ? (
                                      <>
                                        <UUID canCopy short uuid={t.pgUpsert.infraOutputStepId} />
                                        {matchingInfraOutputStep ? ` (${matchingInfraOutputStep})` : null}
                                      </>
                                    ) : undefined
                                  }
                                />
                                {buildPostgresSpecFacts(t.pgUpsert.spec)}
                              </div>
                            );
                          })
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
                        {/*<span>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(step.output)]}</span>*/}

                        {match(step.output)
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
