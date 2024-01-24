import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDeployment } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import {
  applicationDemandLevels,
  deploymentEventTypeLabels,
  getDeploymentEventType,
  O5DeployerV1DeploymentEvent,
  stackLifecycleLabels,
} from '@/data/types';
import { ColumnDef } from '@tanstack/react-table';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { match, P } from 'ts-pattern';
import { NumberFormat } from '@/components/format/number/number-format.tsx';

const eventColumns: ColumnDef<O5DeployerV1DeploymentEvent>[] = [
  getRowExpander(),
  {
    header: 'ID',
    accessorFn: (row) => row.metadata?.eventId,
    cell: ({ getValue }) => {
      return <UUID canCopy short uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Type',
    accessorFn: (row) => {
      const type = getDeploymentEventType(row);
      return row.event ? deploymentEventTypeLabels[type] : '';
    },
  },
  {
    header: 'Timestamp',
    accessorFn: (row) => row.metadata?.timestamp,
    cell: ({ getValue }) => {
      return (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={getValue<string>()}
        />
      );
    },
  },
];

function renderSubRow({ row }: TableRow<O5DeployerV1DeploymentEvent>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ created: P.not(P.nullish) }, (e) => (
          <div className="flex flex-col gap-2">
            <h3>Spec</h3>

            <div className="grid grid-cols-2 gap-2">
              <NutritionFact label="Template URL" value={e.created.spec?.templateUrl} />
              <NutritionFact label="ECS Cluster" value={e.created.spec?.ecsCluster} />
              <NutritionFact label="Cancel Updates" value={e.created.spec?.cancelUpdates ? 'Yes' : 'No'} />
              <NutritionFact label="Rotate Credentials" value={e.created.spec?.rotateCredentials ? 'Yes' : 'No'} />
              <NutritionFact label="Quick Mode" value={e.created.spec?.quickMode ? 'Yes' : 'No'} />
            </div>

            <h4>Databases</h4>
            {e.created.spec?.databases?.map((db) => (
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
            {e.created.spec?.parameters?.map((param) => (
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
            {e.created.spec?.snsTopics?.join(', ')}
          </div>
        ))
        .with({ stackScale: P.not(P.nullish) }, (e) => (
          <NutritionFact label="Desired Count" value={<NumberFormat value={e.stackScale.desiredCount} />} />
        ))
        .with({ stackTrigger: P.not(P.nullish) }, (e) => <NutritionFact label="Phase" value={e.stackTrigger.phase} />)
        .with({ stackStatus: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Lifecycle" value={e.stackStatus.lifecycle ? stackLifecycleLabels[e.stackStatus.lifecycle] : undefined} />
          </>
        ))
        .with({ migrateData: P.not(P.nullish) }, (e) => (
          <NutritionFact
            label="Databases"
            value={e.migrateData.databases?.map((db) => (
              <span key={db.migrationId}>
                <span>{db.dbName}</span>
                <UUID uuid={db.migrationId} />
              </span>
            ))}
          />
        ))
        .with({ dbMigrateStatus: P.not(P.nullish) }, (e) => (
          <>
            <NutritionFact label="Database Name" value={e.dbMigrateStatus.dbName} />
            <NutritionFact label="Migration ID" value={<UUID uuid={e.dbMigrateStatus.migrationId} />} />
            <NutritionFact label="Status" value={e.dbMigrateStatus.status} />
            <NutritionFact label="Error" value={e.dbMigrateStatus.error} />
          </>
        ))
        .with({ error: P.not(P.nullish) }, (e) => <NutritionFact label="Error" value={e.error?.error} />)
        .otherwise(() => null)}
    </div>
  );
}

export function Deployment() {
  const { deploymentId } = useParams();
  const { data, isLoading, error } = useDeployment({ deploymentId });
  useErrorHandler(error, 'Failed to load deployment');

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Deployment: {deploymentId ? <UUID uuid={deploymentId} /> : <Skeleton />}</h1>
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact
              isLoading={isLoading}
              label="Stack"
              renderWhenEmpty="-"
              value={data?.state?.stackName ? <Link to={`/stack/${data.state.stackId}`}>{data.state.stackName}</Link> : undefined}
            />
          </CardContent>
        </Card>

        <Card className="flex-grow h-fit">
          <CardHeader className="text-lg font-semibold">Events</CardHeader>
          <CardContent>
            <DataTable
              getRowCanExpand
              columns={eventColumns}
              data={data?.events || []}
              renderSubComponent={renderSubRow}
              showSkeleton={Boolean(isLoading || error)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
