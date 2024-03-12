import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { match, P } from 'ts-pattern';
import { useListDeployments } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import {
  deploymentStepOutputTypeLabels,
  deploymentStepRequestTypeLabels,
  deploymentStepStatusLabels,
  getDeploymentStepOutputType,
  getDeploymentStepRequestType,
  O5DeployerV1DeploymentState,
  O5DeployerV1DeploymentStatus,
} from '@/data/types';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deploymentStatusLabels } from '@/data/types/ui/deployer.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { buildDeploymentSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';

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
    cell: ({ getValue, row }) => <Link to={`/environment/${row.original.spec?.environmentId}`}>{getValue<string>()}</Link>,
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
    header: 'Stack',
    accessorKey: 'stackName',
    cell: ({ getValue, row }) => <Link to={`/stack/${row.original.stackId}`}>{getValue<string>()}</Link>,
  },
  {
    header: () => {
      return <div className="block w-[65px]" />;
    },
    id: 'actions',
    accessorFn: (row) => row.deploymentId,
    cell: ({ getValue, row }) => {
      return (
        <div className="flex items-center justify-end gap-2">
          <TriggerDeploymentDialog deploymentId={getValue<string>()} />
          {![O5DeployerV1DeploymentStatus.Done, O5DeployerV1DeploymentStatus.Failed, O5DeployerV1DeploymentStatus.Terminated].includes(
            row.original.status!,
          ) && <ConfirmTerminateDeploymentAlert deploymentId={getValue<string>()} />}
        </div>
      );
    },
  },
];

function renderSubRow({ row }: TableRow<O5DeployerV1DeploymentState>) {
  return (
    <div className="flex flex-col gap-4">
      {buildDeploymentSpecFacts(row.original.spec)}

      <div className="flex flex-col gap-2">
        <h3>Steps</h3>
        {row.original.steps?.map((step) => (
          <div className="flex flex-col gap-2" key={step.id}>
            <div className="grid grid-cols-2 gap-2 p-2 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
              <NutritionFact label="Name" value={step.name} />
              <NutritionFact label="ID" value={<UUID short uuid={step.id} />} />
              <NutritionFact label="Depends On" value={step.dependsOn?.join(', ')} />
              <NutritionFact label="Status" value={deploymentStepStatusLabels[step.status!]} />
              <NutritionFact label="Error" value={step.error} />
            </div>

            <h4>Request</h4>

            <div className="flex flex-col gap-2">
              <h5>{deploymentStepRequestTypeLabels[getDeploymentStepRequestType(step.request)]}</h5>

              {match(step.request?.type)
                .with({ cfCreate: P.not(P.nullish) }, (t) => (
                  <div className="flex flex-col gap-2">
                    <h6>Spec</h6>
                    <div className="grid grid-cols-2 gap-2">
                      <NutritionFact label="Stack Name" value={t.cfCreate.spec?.stackName} />
                      <NutritionFact label="Template URL" value={t.cfCreate.spec?.templateUrl} />
                      <NutritionFact label="Desired Count" value={t.cfCreate.spec?.desiredCount} />
                      <NutritionFact label="SNS Topics" value={t.cfCreate.spec?.snsTopics?.join(', ')} />
                      <NutritionFact
                        label="Parameters"
                        value={t.cfCreate.spec?.parameters
                          ?.map(
                            (param) =>
                              `${param.name}: ${match(param.source)
                                .with({ value: P.string }, (p) => p.value)
                                .with({ resolve: P.not(P.nullish) }, (p) =>
                                  match(p.resolve.type)
                                    .with({ rulePriority: P.not(P.nullish) }, (s) => `Route Group: ${s.rulePriority.routeGroup}`)
                                    .with({ desiredCount: P.not(P.nullish) }, () => 'Desired Count')
                                    .otherwise(() => 'UNKNOWN'),
                                )
                                .otherwise(() => 'UNKNOWN')}`,
                          )
                          .join('\n')}
                      />
                    </div>
                  </div>
                ))
                .otherwise(() => null)}
            </div>

            <h4>Output</h4>

            <div className="flex flex-col gap-2">
              <h5>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(step.output)]}</h5>

              {match(step.output?.type)
                .with({ cfStatus: P.not(P.nullish) }, (t) => buildCFStackOutput(t.cfStatus.output))
                .otherwise(() => null)}
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
        <TriggerDeploymentDialog />
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        data={flatData}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        renderSubComponent={renderSubRow}
        showSkeleton={Boolean(data === undefined || isLoading || error)}
      />
    </div>
  );
}

export default DeploymentManagement;
