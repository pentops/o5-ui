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
import { buildCFStackInput, buildDeploymentSpecFacts, buildPostgresSpecFacts } from '@/pages/deployment/build-facts.tsx';
import { buildCFStackOutput } from '@/pages/stack/build-facts.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { NumberFormat } from '@/components/format/number/number-format.tsx';

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
        {(row.original.steps?.length || 0) > 0 && (
          <Collapsible className="py-2 px-1 border rounded-md border-slate-900/10 lg:px-2 lg:border-1 dark:border-slate-300/10">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-start gap-1" type="button">
                <CaretDownIcon />
                <h4 className="text-lg">Steps</h4>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {row.original.steps?.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col gap-3 p-2 [&:not(:last-child)]:border-b border-slate-900/10 lg:border-1 dark:border-slate-300/10"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <NutritionFact renderWhenEmpty="-" label="ID" value={step.id ? <UUID short canCopy uuid={step.id} /> : undefined} />
                    <NutritionFact renderWhenEmpty="-" label="Name" value={step.name} />
                    <NutritionFact renderWhenEmpty="-" label="Depends On" value={step.dependsOn?.join(', ')} />
                    <NutritionFact renderWhenEmpty="-" label="Status" value={deploymentStepStatusLabels[step.status!]} />
                    <NutritionFact renderWhenEmpty="-" label="Error" value={step.error} />
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
                          <span>{deploymentStepRequestTypeLabels[getDeploymentStepRequestType(step.request)]}</span>

                          {match(step.request?.type)
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

                            .with({ pgMigrate: P.not(P.nullish) }, (t) => (
                              <div className="grid grid-cols-2 gap-2">
                                <NutritionFact
                                  renderWhenEmpty="-"
                                  label="Infrastructure Output Step ID"
                                  value={t.pgMigrate.infraOutputStepId ? <UUID canCopy uuid={t.pgMigrate.infraOutputStepId} /> : undefined}
                                />
                                {buildPostgresSpecFacts(t.pgMigrate.spec)}
                              </div>
                            ))
                            .with({ pgUpsert: P.not(P.nullish) }, (t) => (
                              <div className="grid grid-cols-2 gap-2">
                                <NutritionFact
                                  renderWhenEmpty="-"
                                  label="Infrastructure Output Step ID"
                                  value={t.pgUpsert.infraOutputStepId ? <UUID canCopy uuid={t.pgUpsert.infraOutputStepId} /> : undefined}
                                />
                                {buildPostgresSpecFacts(t.pgUpsert.spec)}
                              </div>
                            ))
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
                          <span>{deploymentStepOutputTypeLabels[getDeploymentStepOutputType(step.output)]}</span>

                          {match(step.output?.type)
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
        )}
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
