import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useErrorHandler } from '@/lib/error.ts';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { TriggerDeploymentDialog } from '@/pages/deployment/trigger-deployment-dialog/trigger-deployment-dialog.tsx';
import { ConfirmTerminateDeploymentAlert } from '@/pages/deployment/confirm-terminate-deployment-alert/confirm-terminate-deployment-alert.tsx';
import { useTableState } from '@/components/data-table/state.ts';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { TableRowType } from '@/components/data-table/body.tsx';
import {
  O5AwsDeployerV1DeploymentQueryServiceListDeploymentsRequest,
  O5AwsDeployerV1DeploymentState,
  O5AwsDeployerV1DeploymentStatus,
} from '@/data/types';
import { useO5AwsDeployerV1DeploymentQueryServiceListDeployments } from '@/data/api/hooks/generated';
import { useTranslation } from 'react-i18next';
import { J5StateMetadata } from '@/components/j5/j5-state-metadata.tsx';
import { DeploymentStep } from '@/pages/deployment/step/deployment-step.tsx';
import { DeploymentSpec } from '@/pages/deployment/spec/deployment-spec.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

function getColumns(t: TFunction): CustomColumnDef<O5AwsDeployerV1DeploymentState>[] {
  return [
    getRowExpander(),
    {
      header: 'ID',
      accessorKey: 'deploymentId',
      id: 'deploymentId',
      size: 110,
      minSize: 110,
      maxSize: 110,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short to={`/deployment/${value}`} uuid={value} /> : null;
      },
    },
    {
      header: 'App',
      id: 'spec.appName',
      size: 120,
      minSize: 120,
      maxSize: 140,
      accessorFn: (row) => row.data?.spec?.appName || '',
    },
    {
      header: 'Environment',
      id: 'spec.environmentName',
      size: 120,
      minSize: 120,
      maxSize: 140,
      accessorFn: (row) => row.data?.spec?.environmentName || '',
      cell: ({ getValue, row }) => {
        const value = getValue<string>();
        return row.original.data?.spec?.environmentId ? <Link to={`/environment/${row.original.data?.spec.environmentId}`}>{value}</Link> : value;
      },
    },
    {
      header: 'Version',
      id: 'spec.version',
      size: 110,
      minSize: 110,
      maxSize: 110,
      accessorFn: (row) => row.data?.spec?.version || '',
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short uuid={value} /> : null;
      },
    },
    {
      header: 'Status',
      id: 'status',
      size: 120,
      minSize: 120,
      maxSize: 150,
      accessorFn: (row) => (row.status ? t(`awsDeployer:enum.O5AwsDeployerV1DeploymentStatus.${row.status}`) : ''),
    },
    {
      header: 'Stack',
      accessorKey: 'stackName',
      id: 'stackName',
      cell: ({ getValue, row }) => {
        const value = getValue<string>();
        return row.original.stackId ? <Link to={`/stack/${row.original.stackId}`}>{value}</Link> : value;
      },
    },
    {
      header: 'Created At',
      id: 'metadata.createdAt',
      accessorFn: (row) => row.metadata?.createdAt,
      enableSorting: true,
      minSize: 135,
      maxSize: 215,
      size: 215,
      cell: ({ getValue }) => {
        const createdAt = getValue<string>();

        return createdAt ? (
          <DateFormat
            day="2-digit"
            hour="numeric"
            minute="2-digit"
            second="numeric"
            month="2-digit"
            timeZoneName="short"
            year="numeric"
            value={createdAt}
          />
        ) : undefined;
      },
    },
    {
      header: () => {
        return <div className="block w-[65px]" />;
      },
      align: 'right',
      id: 'actions',
      size: 65,
      minSize: 65,
      maxSize: 65,
      accessorFn: (row) => row.deploymentId,
      cell: ({ getValue, row }) => {
        const value = getValue<string>();

        return (
          <div className="flex items-center justify-end gap-2">
            <TriggerDeploymentDialog deploymentId={value} />
            {![O5AwsDeployerV1DeploymentStatus.Done, O5AwsDeployerV1DeploymentStatus.Failed, O5AwsDeployerV1DeploymentStatus.Terminated].includes(
              row.original.status!,
            ) && <ConfirmTerminateDeploymentAlert deploymentId={value} />}
          </div>
        );
      },
    },
  ];
}

function renderSubRow({ row }: TableRowType<O5AwsDeployerV1DeploymentState>) {
  return (
    <div className="flex flex-col gap-4">
      <J5StateMetadata vertical metadata={row.original.metadata} heading="Metadata" />

      <DeploymentSpec vertical heading="Spec" spec={row.original.data?.spec} />

      {row.original.data?.request ? (
        <>
          <span>Request</span>
          <NutritionFact vertical renderWhenEmpty="-" label="Context" value={row.original.data.request.context} />
          <NutritionFact vertical renderWhenEmpty="-" label="Reply To" value={row.original.data.request.replyTo} />
        </>
      ) : null}

      {row.original.data?.steps?.length ? <span>Steps</span> : null}
      {row.original.data?.steps?.map((step, index) => <DeploymentStep vertical step={step} key={step.id || step.name || index} />)}
    </div>
  );
}

function DeploymentManagement() {
  const { t } = useTranslation('awsDeployer');
  const { sortValues, setSortValues, setFilterValues, filterValues, psmQuery } =
    useTableState<O5AwsDeployerV1DeploymentQueryServiceListDeploymentsRequest['query']>();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useO5AwsDeployerV1DeploymentQueryServiceListDeployments({
    query: psmQuery,
  });
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
    }, [] as O5AwsDeployerV1DeploymentState[]);
  }, [data?.pages]);

  const columns = useMemo(() => getColumns(t), [t]);

  return (
    <div className="w-full overflow-auto">
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
        // onSearch={setSearchValue}
        // onSearchFieldChange={setSearchFields}
        pagination={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        renderSubComponent={renderSubRow}
        // searchValue={searchValue}
        // searchFields={searchableFields}
        // searchFieldSelections={searchFields}
        showSkeleton={Boolean(data === undefined || isLoading || error)}
      />
    </div>
  );
}

export default DeploymentManagement;
