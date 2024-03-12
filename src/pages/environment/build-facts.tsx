import React from 'react';
import { O5EnvironmentV1CustomVariable, O5EnvironmentV1Environment } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { match, P } from 'ts-pattern';
import { UUID } from '@/components/uuid/uuid.tsx';

export function buildEnvironmentCustomVariables(vars: O5EnvironmentV1CustomVariable[] | undefined) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
      {vars?.map((v) => (
        <NutritionFact
          key={v.name}
          label={v.name || 'Missing Name'}
          value={match(v.src)
            .with({ value: P.string }, (s) => s.value)
            .with({ join: P.not(P.nullish) }, (j) => j.join.values?.join(j.join.delimiter || ', '))
            .otherwise(() => undefined)}
        />
      )) || '-'}
    </div>
  );
}

export function buildEnvironmentProvider(provider: O5EnvironmentV1Environment['provider'] | undefined) {
  return (
    <div className="flex flex-col gap-4 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
      {match(provider)
        .with({ aws: P.not(P.nullish) }, (p) => (
          <>
            <NutritionFact label="Provider" value="AWS" />

            <div className="grid grid-cols-2 gap-2">
              <NutritionFact label="Region" value={p.aws.region} />
              <NutritionFact label="Sidecar Image Repo" value={p.aws.sidecarImageRepo} />
              <NutritionFact label="Sidecar Image Version" value={p.aws.sidecarImageVersion} />
              <NutritionFact label="ECS Repo" value={p.aws.ecsRepo} />
              <NutritionFact label="ECS Cluster Name" value={p.aws.ecsClusterName} />
              <NutritionFact label="ECS Task Execution Role" value={p.aws.ecsTaskExecutionRole} />
              <NutritionFact label="S3 Bucket Name Space" value={p.aws.s3BucketNamespace} />
              <NutritionFact label="SNS Prefix" value={p.aws.snsPrefix} />
              <NutritionFact label="VPC ID" value={<UUID short uuid={p.aws.vpcId} />} />
              <NutritionFact label="Listener ARN" value={p.aws.listenerArn} />
              <NutritionFact label="Host Header" value={p.aws.hostHeader} />
              <NutritionFact label="o5 Deployer Assume Role" value={p.aws.o5DeployerAssumeRole} />
              <NutritionFact label="o5 Deployer Grant Roles" value={p.aws.o5DeployerGrantRoles?.join('\n')} />
            </div>

            <h3>SES Identity</h3>
            <div className="grid grid-cols-2 gap-2">
              <NutritionFact label="Recipients" value={p.aws.sesIdentity?.recipients?.join('\n')} />
              <NutritionFact label="Senders" value={p.aws.sesIdentity?.senders?.join('\n')} />
            </div>

            <h3>Environment Links</h3>
            {p.aws.environmentLinks?.map((l) => (
              <div className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10" key={l.fullName}>
                <NutritionFact label="Full Name" value={l.fullName} />
                <NutritionFact label="SNS Prefix" value={l.snsPrefix} />
              </div>
            )) || '-'}

            <h3>Grant Principals</h3>
            {p.aws.grantPrincipals?.map((g) => (
              <div className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10" key={g.name}>
                <NutritionFact label="Name" value={g.name} />
                <NutritionFact label="Role ARN" value={g.roleArn} />
              </div>
            )) || '-'}

            <h3>RDS Hosts</h3>
            {p.aws.rdsHosts?.map((r) => (
              <div
                className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10"
                key={r.serverGroup}
              >
                <NutritionFact label="Server Group" value={r.serverGroup} />
                <NutritionFact label="Secret Name" value={r.secretName} />
              </div>
            )) || '-'}
          </>
        ))
        .otherwise(() => '-')}
    </div>
  );
}
