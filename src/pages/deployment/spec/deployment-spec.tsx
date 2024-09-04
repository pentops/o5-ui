import React from 'react';
import { O5AwsDeployerV1DeploymentSpec } from '@/data/types';
import { buildDeployerDeploymentSpecFacts, buildDeployerFlagsFacts } from '@/pages/deployment/build-facts.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getPostgresSpecKey, PostgresSpec } from '@/pages/deployment/spec/postgres-spec.tsx';
import { S3Template } from '@/pages/deployment/spec/s3-template.tsx';

interface DeploymentSpecProps {
  heading?: React.ReactNode;
  spec: O5AwsDeployerV1DeploymentSpec | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function DeploymentSpec({ heading, spec, isLoading, vertical }: DeploymentSpecProps) {
  const specFacts = buildDeployerDeploymentSpecFacts(spec);
  const flagFacts = buildDeployerFlagsFacts(spec?.flags);

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

      <S3Template spec={spec?.template} isLoading={isLoading} vertical={vertical} />
    </>
  );
}
