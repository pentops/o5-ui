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
import { CustomColumnDef, DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { deploymentStatusLabels } from '@/data/types/ui/deployer.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { buildDeploymentSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';
import { useTableState } from '@/components/data-table/state.ts';

const columns: CustomColumnDef<O5DeployerV1DeploymentState>[] = [
  getRowExpander(),
  {
    header: 'ID',
    accessorKey: 'deploymentId',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
    },
  },
  {
    header: 'App',
    accessorFn: (row) => row.spec?.appName || '',
  },
  {
    header: 'Environment',
    accessorFn: (row) => row.spec?.environmentName || '',
    cell: ({ getValue, row }) => {
      const value = getValue<string>();
      return row.original.spec?.environmentId ? <Link to={`/environment/${row.original.spec.environmentId}`}>{value}</Link> : value;
    },
  },
  {
    header: 'Version',
    accessorFn: (row) => row.spec?.version || '',
  },
  {
    header: 'Status',
    id: 'status',
    accessorFn: (row) => deploymentStatusLabels[row.status!] || '',
    filter: {
      type: {
        select: {
          isMultiple: true,
          options: Object.entries(deploymentStatusLabels).map(([value, label]) => ({ value, label })),
        },
      },
    },
  },
  {
    header: 'Stack',
    accessorKey: 'stackName',
    cell: ({ getValue, row }) => {
      const value = getValue<string>();
      return row.original.stackId ? <Link to={`/stack/${row.original.stackId}`}>{value}</Link> : value;
    },
  },
  {
    header: () => {
      return <div className="block w-[65px]" />;
    },
    align: 'right',
    id: 'actions',
    accessorFn: (row) => row.deploymentId,
    cell: ({ getValue, row }) => {
      const value = getValue<string>();

      return (
        <div className="flex items-center justify-end gap-2">
          <TriggerDeploymentDialog deploymentId={value} />
          {![O5DeployerV1DeploymentStatus.Done, O5DeployerV1DeploymentStatus.Failed, O5DeployerV1DeploymentStatus.Terminated].includes(
            row.original.status!,
          ) && <ConfirmTerminateDeploymentAlert deploymentId={value} />}
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
            <div className="grid grid-cols-2 gap-2 py-2 px-1 border border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
              <NutritionFact renderWhenEmpty="-" label="Name" value={step.name} />
              <NutritionFact renderWhenEmpty="-" label="ID" value={<UUID short uuid={step.id} />} />
              <NutritionFact renderWhenEmpty="-" label="Depends On" value={step.dependsOn?.join(', ')} />
              <NutritionFact renderWhenEmpty="-" label="Status" value={deploymentStepStatusLabels[step.status!]} />
              <NutritionFact renderWhenEmpty="-" label="Error" value={step.error} />
            </div>

            <h4>Request</h4>

            <div className="flex flex-col gap-2">
              <span>{deploymentStepRequestTypeLabels[getDeploymentStepRequestType(step.request)]}</span>

              {match(step.request?.type)
                .with({ cfCreate: P.not(P.nullish) }, (t) => (
                  <div className="flex flex-col gap-2">
                    <h6>Spec</h6>
                    <div className="grid grid-cols-2 gap-2">
                      <NutritionFact renderWhenEmpty="-" label="Stack Name" value={t.cfCreate.spec?.stackName} />
                      <NutritionFact renderWhenEmpty="-" label="Template URL" value={t.cfCreate.spec?.templateUrl} />
                      <NutritionFact renderWhenEmpty="-" label="Desired Count" value={t.cfCreate.spec?.desiredCount} />
                      <NutritionFact renderWhenEmpty="-" label="SNS Topics" value={t.cfCreate.spec?.snsTopics?.join(', ')} />
                      <NutritionFact
                        renderWhenEmpty="-"
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
              <span>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(step.output)]}</span>

              {match(step.output?.type)
                .with({ cfStatus: P.not(P.nullish) }, (t) => buildCFStackOutput(t.cfStatus.output))
                .otherwise(() => null)}
            </div>
          </div>
        )) || '-'}
      </div>
    </div>
  );
}

function DeploymentManagement() {
  const { sortValues, setSortValues, setFilterValues, filterValues, psmQuery } = useTableState();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListDeployments({ query: psmQuery });
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
        <h1 className="text-2xl">Deployment Management</h1>
        <TriggerDeploymentDialog />
      </div>

      <DataTable
        getRowCanExpand
        columns={columns}
        controlledColumnSort={sortValues}
        data={flatData}
        filterValues={filterValues}
        onColumnSort={setSortValues}
        onFilter={setFilterValues}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        renderSubComponent={renderSubRow}
        showSkeleton={Boolean(data === undefined || isLoading || error)}
      />
    </div>
  );
}

export default DeploymentManagement;
