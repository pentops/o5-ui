import React from 'react';
import { O5EnvironmentV1CustomVariable, O5EnvironmentV1Environment } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { match, P } from 'ts-pattern';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';

function variablesToJSON(vars: O5EnvironmentV1CustomVariable[] | undefined) {
  const obj =
    vars?.map((v) => ({
      [v.name || 'Missing Name']: match(v.src)
        .with({ value: P.string }, (s) => s.value)
        .with({ join: P.not(P.nullish) }, (j) => {
          if (!j.join.delimiter || j.join.delimiter === ',') {
            return j.join.values;
          }

          return j.join.values?.join(j.join.delimiter);
        })
        .otherwise(() => undefined),
    })) || [];

  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '[]';
  }
}

export function buildEnvironmentCustomVariables(vars: O5EnvironmentV1CustomVariable[] | undefined) {
  return <CodeEditor disabled value={variablesToJSON(vars) || '[]'} language="json" />;
}

export function buildEnvironmentProvider(provider: O5EnvironmentV1Environment['provider'] | undefined) {
  return (
    <div className="flex flex-col gap-4 p-2 border border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
      {match(provider)
        .with({ aws: P.not(P.nullish) }, (p) => (
          <>
            <NutritionFact label="Provider" value="AWS" />

            <div className="grid grid-cols-2 gap-2">
              <NutritionFact renderWhenEmpty="-" label="Region" value={p.aws.region} />
              <NutritionFact renderWhenEmpty="-" label="Sidecar Image Repo" value={p.aws.sidecarImageRepo} />
              <NutritionFact renderWhenEmpty="-" label="Sidecar Image Version" value={p.aws.sidecarImageVersion} />
              <NutritionFact renderWhenEmpty="-" label="ECS Repo" value={p.aws.ecsRepo} />
              <NutritionFact renderWhenEmpty="-" label="ECS Cluster Name" value={p.aws.ecsClusterName} />
              <NutritionFact renderWhenEmpty="-" label="ECS Task Execution Role" value={p.aws.ecsTaskExecutionRole} />
              <NutritionFact renderWhenEmpty="-" label="S3 Bucket Name Space" value={p.aws.s3BucketNamespace} />
              <NutritionFact renderWhenEmpty="-" label="SNS Prefix" value={p.aws.snsPrefix} />
              <NutritionFact renderWhenEmpty="-" label="VPC ID" value={p.aws.vpcId} />
              <NutritionFact renderWhenEmpty="-" label="Listener ARN" value={p.aws.listenerArn} />
              <NutritionFact renderWhenEmpty="-" label="Host Header" value={p.aws.hostHeader} />
              <NutritionFact renderWhenEmpty="-" label="o5 Deployer Assume Role" value={p.aws.o5DeployerAssumeRole} />
              <NutritionFact renderWhenEmpty="-" label="o5 Deployer Grant Roles" value={p.aws.o5DeployerGrantRoles?.join('\n')} />
            </div>

            <h3>SES Identity</h3>
            <div className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
              <div className="grid grid-cols-2 gap-2">
                <NutritionFact renderWhenEmpty="-" label="Recipients" value={p.aws.sesIdentity?.recipients?.join('\n')} />
                <NutritionFact renderWhenEmpty="-" label="Senders" value={p.aws.sesIdentity?.senders?.join('\n')} />
              </div>
            </div>

            <h3>Environment Links</h3>
            <div className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
              {p.aws.environmentLinks?.map((l) => (
                <div
                  className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10"
                  key={l.fullName || l.snsPrefix}
                >
                  <NutritionFact renderWhenEmpty="-" label="Full Name" value={l.fullName} />
                  <NutritionFact renderWhenEmpty="-" label="SNS Prefix" value={l.snsPrefix} />
                </div>
              )) || '-'}
            </div>

            <h3>Grant Principals</h3>
            <div className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
              {p.aws.grantPrincipals?.map((g) => (
                <div
                  className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10"
                  key={g.name || g.roleArn}
                >
                  <NutritionFact renderWhenEmpty="-" label="Name" value={g.name} />
                  <NutritionFact renderWhenEmpty="-" label="Role ARN" value={g.roleArn} />
                </div>
              )) || '-'}
            </div>

            <h3>RDS Hosts</h3>
            <div className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
              {p.aws.rdsHosts?.map((r) => (
                <div className="grid grid-cols-2 gap-2 p-2" key={r.serverGroup}>
                  <NutritionFact renderWhenEmpty="-" label="Server Group" value={r.serverGroup} />
                  <NutritionFact renderWhenEmpty="-" label="Secret Name" value={r.secretName} />
                </div>
              )) || '-'}
            </div>
          </>
        ))
        .otherwise(() => '-')}
    </div>
  );
}
