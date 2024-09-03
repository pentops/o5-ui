import React from 'react';
import { O5AwsDeployerV1DeploymentSpec } from '@/data/types';
import { buildDeployerDeploymentSpecFacts, buildDeployerFlagsFacts, buildDeployerS3TemplateSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getPostgresSpecKey, PostgresSpec } from '@/pages/deployment/spec/postgres-spec.tsx';

interface DeploymentSpecProps {
  heading?: React.ReactNode;
  spec: O5AwsDeployerV1DeploymentSpec | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function DeploymentSpec({ heading, spec, isLoading, vertical }: DeploymentSpecProps) {
  const specFacts = buildDeployerDeploymentSpecFacts(spec);
  const flagFacts = buildDeployerFlagsFacts(spec?.flags);
  const templateFacts = buildDeployerS3TemplateSpecFacts(spec?.template);

  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.appName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.version} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.environmentId} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.environmentName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.ecsCluster} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.cfStackName} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...specFacts.snsTopics} />

      <span>Flags</span>
      <NutritionFact vertical={vertical} isLoading={isLoading} {...flagFacts.quickMode} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...flagFacts.rotateCredentials} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...flagFacts.cancelUpdates} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...flagFacts.dbOnly} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...flagFacts.infraOnly} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...flagFacts.importResources} />

      {spec?.databases?.length ? <span>Databases</span> : null}
      {spec?.databases?.map((db, index) => <PostgresSpec spec={db} key={getPostgresSpecKey(db, index)} isLoading={isLoading} vertical={vertical} />)}

      <span>Template</span>
      <NutritionFact vertical={vertical} isLoading={isLoading} {...templateFacts.bucket} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...templateFacts.key} />
      <NutritionFact vertical={vertical} isLoading={isLoading} {...templateFacts.region} />
    </>
  );
}
