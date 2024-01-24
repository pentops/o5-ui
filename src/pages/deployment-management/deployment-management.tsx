import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { match, P } from 'ts-pattern';
import { useListDeployments } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { O5DeployerV1DeploymentState } from '@/data/types';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from '@/components/uuid/uuid.tsx';
import { applicationDemandLevels, deploymentStatusLabels, migrationStatusLabels, stackLifecycleLabels } from '@/data/types/ui/deployer.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

const columns: ColumnDef<O5DeployerV1DeploymentState>[] = [
  getRowExpander(),
  {
    header: 'ID',
    accessorKey: 'deploymentId',
    cell: ({ getValue }) => {
      return <UUID canCopy short to={getValue<string>()} uuid={getValue<string>()} />;
    },
  },
  {
    header: 'App',
    accessorFn: (row) => row.spec?.appName || '',
  },
  {
    header: 'Environment',
    accessorFn: (row) => row.spec?.environmentName || '',
  },
  {
    header: 'Version',
    accessorFn: (row) => row.spec?.version || '',
  },
  {
    header: 'Status',
    accessorFn: (row) => deploymentStatusLabels[row.status!] || '',
  },
  {
    header: 'Waiting on Remote Phase',
    accessorFn: (row) => (row.waitingOnRemotePhase ? 'Yes' : 'No'),
  },
  {
    header: 'Stack',
    accessorKey: 'stackName',
    cell: ({ getValue, row }) => <Link to={`/stack/${row.original.stackId}`}>{getValue<string>()}</Link>,
  },
  {
    header: 'Last Stack Lifecycle',
    accessorFn: (row) => stackLifecycleLabels[row.lastStackLifecycle!] || '',
  },
];

function renderSubRow({ row }: TableRow<O5DeployerV1DeploymentState>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3>Spec</h3>

        <div className="grid grid-cols-2 gap-2">
          <NutritionFact label="Template URL" value={row.original.spec?.templateUrl} />
          <NutritionFact label="ECS Cluster" value={row.original.spec?.ecsCluster} />
          <NutritionFact label="Cancel Updates" value={row.original.spec?.cancelUpdates ? 'Yes' : 'No'} />
          <NutritionFact label="Rotate Credentials" value={row.original.spec?.rotateCredentials ? 'Yes' : 'No'} />
          <NutritionFact label="Quick Mode" value={row.original.spec?.quickMode ? 'Yes' : 'No'} />
        </div>

        <h4>Databases</h4>
        {row.original.spec?.databases?.map((db) => (
          <div
            key={db.database?.name}
            className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10"
          >
            <NutritionFact label="Name" value={db.database?.name} />
            <NutritionFact label="Migration Task Output Name" value={db.migrationTaskOutputName} />
            <NutritionFact label="Secret Output Name" value={db.secretOutputName} />
            <NutritionFact label="RDS Host Server Group" value={db.rdsHost?.serverGroup} />
            <NutritionFact label="RDS Host Secret Name" value={db.rdsHost?.secretName} />

            {match(db.database?.engine)
              .with({ postgres: P.not(P.nullish) }, (d) => (
                <>
                  <NutritionFact label="Engine" value="PostgreSQL" />
                  <NutritionFact label="DB Name" value={d.postgres?.dbName} />
                  <NutritionFact label="Server Group" value={d.postgres?.serverGroup} />
                  <NutritionFact label="DB Extensions" value={d.postgres?.dbExtensions?.join(', ')} />
                  <NutritionFact label="Run Outbox" value={d.postgres?.runOutbox ? 'Yes' : 'No'} />
                  <NutritionFact label="Migrate Container Name" value={d.postgres?.migrateContainer?.name} />
                  <NutritionFact label="Migrate Container Command" value={JSON.stringify(d.postgres?.migrateContainer?.command || [])} />
                  <NutritionFact
                    label="Migrate Container Image"
                    value={match(d.postgres.migrateContainer?.source)
                      .with({ imageUrl: P.not(P.nullish) }, (i) => i.imageUrl)
                      .with({ image: P.not(P.nullish) }, (i) => `${i.image.registry} (${i.image.name}:${i.image.tag})`)
                      .otherwise(() => '')}
                  />
                  <NutritionFact
                    label="Migrate Container Demand"
                    value={d.postgres.migrateContainer?.demand ? applicationDemandLevels[d.postgres.migrateContainer.demand] : ''}
                  />
                  <NutritionFact
                    label="Migrate Container Environment Variables"
                    value={
                      <div>
                        {d.postgres?.migrateContainer?.envVars?.map((envVar) => {
                          return (
                            <div>
                              <span>{envVar.name}: </span>
                              <span>
                                {match(envVar.spec)
                                  .with({ value: P.string }, (v) => v.value)
                                  .with({ secret: P.not(P.nullish) }, (v) => `Name: ${v.secret.secretName}, JSON Key: ${v.secret.jsonKey}`)
                                  .with({ o5: P.not(P.nullish) }, (v) => v.o5)
                                  .with({ database: P.not(P.nullish) }, (v) => `Database Name: ${v.database.databaseName}`)
                                  .with(
                                    { blobstore: P.not(P.nullish) },
                                    (v) =>
                                      `Blobstore Name: ${v.blobstore.name}, Sub Path: ${v.blobstore.subPath}, S3 Direct: ${v.blobstore.format?.s3Direct}`,
                                  )
                                  .with({ envMap: P.not(P.nullish) }, () => 'Environment Map')
                                  .with({ fromEnv: P.not(P.nullish) }, (v) => v.fromEnv.name)
                                  .otherwise(() => '')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    }
                  />
                </>
              ))
              .otherwise(() => null)}
          </div>
        ))}

        <h4>Parameters</h4>
        {row.original.spec?.parameters?.map((param) => (
          <div key={param.name} className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
            <NutritionFact label="Name" value={param.name} />
            <NutritionFact
              label="Source"
              value={match(param.source)
                .with({ value: P.string }, (p) => p.value)
                .with({ resolve: P.not(P.nullish) }, (p) =>
                  match(p.resolve.type)
                    .with({ rulePriority: P.not(P.nullish) }, (s) => `Route Group: ${s.rulePriority.routeGroup}`)
                    .with({ desiredCount: P.not(P.nullish) }, () => `Desired Count`)
                    .otherwise(() => ''),
                )
                .otherwise(() => '')}
            />
          </div>
        ))}

        <h4>SNS Topics</h4>
        {row.original.spec?.snsTopics?.join(', ')}
      </div>

      <div className="flex flex-col gap-2">
        <h3>Stack Output</h3>
        <div className="grid grid-cols-2 gap-2">
          {row.original.stackOutput?.map((output) => <NutritionFact key={output.name} label={output.name} value={output.value} />)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3>Data Migrations</h3>
        {row.original.dataMigrations?.map((migration) => (
          <div
            key={migration.migrationId}
            className="flex flex-col gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10"
          >
            <UUID uuid={migration.migrationId} />

            <div className="grid grid-cols-2 gap-2">
              <NutritionFact label="DB Name" value={migration.dbName} />
              <NutritionFact label="Rotate Credentials" value={migration.rotateCredentials ? 'Yes' : 'No'} />
              <NutritionFact label="Status" value={migrationStatusLabels[migration.status!] || ''} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeploymentManagement() {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListDeployments();
  useErrorHandler(error, 'Failed to load deployments');
  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.deployments) {
        return [...acc, ...page.deployments];
      }

      return acc;
    }, [] as O5DeployerV1DeploymentState[]);
  }, [data?.pages]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl pb-4">Deployment Management</h1>
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        data={flatData}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        renderSubComponent={renderSubRow}
        showSkeleton={Boolean(isLoading || error)}
      />
    </div>
  );
}

export default DeploymentManagement;
