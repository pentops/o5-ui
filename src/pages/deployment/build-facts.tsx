import { O5DeployerV1DeploymentSpec } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { match, P } from 'ts-pattern';
import React from 'react';

export function buildDeploymentSpecFacts(spec: O5DeployerV1DeploymentSpec | undefined) {
  return (
    <div className="flex flex-col gap-2">
      <h3>Spec</h3>

      <div className="grid grid-cols-2 gap-2">
        <NutritionFact label="Template URL" value={spec?.templateUrl} />
        <NutritionFact label="ECS Cluster" value={spec?.ecsCluster} />
      </div>

      <h4>Flags</h4>

      <div className="grid grid-cols-2 gap-2">
        <NutritionFact label="Cancel Updates" value={spec?.flags?.cancelUpdates ? 'Yes' : 'No'} />
        <NutritionFact label="Rotate Credentials" value={spec?.flags?.rotateCredentials ? 'Yes' : 'No'} />
        <NutritionFact label="Quick Mode" value={spec?.flags?.quickMode ? 'Yes' : 'No'} />
        <NutritionFact label="Infra Only" value={spec?.flags?.infraOnly ? 'Yes' : 'No'} />
        <NutritionFact label="Database Only" value={spec?.flags?.dbOnly ? 'Yes' : 'No'} />
      </div>

      <h4>Databases</h4>
      {spec?.databases?.map((db) => (
        <div key={db.dbName} className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
          <NutritionFact label="Name" value={db.dbName} />
          <NutritionFact label="Migration Task Output Name" value={db.migrationTaskOutputName} />
          <NutritionFact label="Root Secret Name" value={db.rootSecretName} />
          <NutritionFact label="Secret Output Name" value={db.secretOutputName} />
          <NutritionFact label="Extensions" value={db.dbExtensions?.join(', ')} />
        </div>
      ))}

      <h4>Parameters</h4>
      {spec?.parameters?.map((param) => (
        <div key={param.name} className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
          <NutritionFact label="Name" value={param.name} />
          <NutritionFact
            label="Source"
            value={match(param.source)
              .with({ value: P.string }, (p) => p.value)
              .with({ resolve: P.not(P.nullish) }, (p) =>
                match(p.resolve.type)
                  .with({ rulePriority: P.not(P.nullish) }, (s) => `Route Group: ${s.rulePriority.routeGroup}`)
                  .with({ desiredCount: P.not(P.nullish) }, () => 'Desired Count')
                  .otherwise(() => ''),
              )
              .otherwise(() => '')}
          />
        </div>
      ))}

      <h4>SNS Topics</h4>
      {spec?.snsTopics?.join(', ') || '-'}
    </div>
  );
}
