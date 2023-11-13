import React from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { O5DempeV1GetMessageResponse, O5DempeV1Urgency } from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import {
  DeadMessageProblem,
  deadMessageProblemLabels,
  getDeadMessageProblem,
  getMessageActionType,
  messageActionTypeLabels,
  urgencyLabels,
} from '@/data/types/ui/dante.ts';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { JSONEditor } from '@/components/json-editor/json-editor.tsx';
import { InvariantViolationPayloadDialog } from '@/pages/dead-letter/invariant-violation-payload-dialog/invariant-violation-payload-dialog.tsx';

type Action = Required<O5DempeV1GetMessageResponse>['actions'][number];

const activityColumns: ColumnDef<Action>[] = [
  getRowExpander(),
  {
    header: 'Action ID',
    accessorFn: (row) => row.action?.id,
    cell: ({ getValue }) => {
      return <UUID short uuid={getValue<string>()} />;
    },
  },
  {
    header: 'Timestamp',
    accessorKey: 'timestamp',
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
  {
    header: 'Action',
    accessorFn: (row) => messageActionTypeLabels[getMessageActionType(row.action)],
  },
  {
    header: 'Note',
    accessorFn: (row) => row.action?.note,
  },
];

function renderSubRow({ row }: TableRow<Action>) {
  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {row.original.action?.action?.edit && (
        <NutritionFact vertical label="New JSON" value={<JSONEditor disabled value={row.original.action.action.edit.newMessageJson || ''} />} />
      )}
    </div>
  );
}

export function DeadLetter() {
  const { messageId } = useParams();
  const { data, error, isLoading } = useMessage({ messageId });
  useErrorHandler(error, 'Failed to load dead letter message');
  const problemType = getDeadMessageProblem(data?.message?.cause);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Dead Letter: {messageId ? <UUID uuid={messageId} /> : <Skeleton />}</h1>
        {messageId && <ActionActivator messageId={messageId} />}
      </div>
      <div className="w-full inline-flex gap-4 flex-wrap lg:flex-nowrap">
        <Card className="flex-grow lg:flex-grow-0 w-[325px] h-fit">
          <CardHeader className="text-lg font-semibold">Details</CardHeader>
          <CardContent className="w-full flex flex-col gap-4">
            <NutritionFact
              isLoading={isLoading}
              label="Infra Message ID"
              renderWhenEmpty="-"
              value={data?.message?.cause?.infraMessageId ? <UUID canCopy short uuid={data.message.cause.infraMessageId} /> : null}
            />
            <NutritionFact isLoading={isLoading} label="Queue Name" renderWhenEmpty="-" value={data?.message?.cause?.queueName} />
            <NutritionFact isLoading={isLoading} label="gRPC Name" renderWhenEmpty="-" value={data?.message?.cause?.grpcName} />
            <NutritionFact
              isLoading={isLoading}
              label="Rejected At"
              renderWhenEmpty="-"
              value={
                data?.message?.cause?.rejectedTimestamp ? (
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={data.message.cause.rejectedTimestamp}
                  />
                ) : null
              }
            />
            <NutritionFact
              isLoading={isLoading}
              label="Sent At"
              renderWhenEmpty="-"
              value={
                data?.message?.cause?.initialSentTimestamp ? (
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={data.message.cause.initialSentTimestamp}
                  />
                ) : null
              }
            />

            <NutritionFact
              isLoading={isLoading}
              label="Problem"
              renderWhenEmpty="-"
              value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}
            />

            {problemType === DeadMessageProblem.InvariantViolation && (
              <>
                <NutritionFact
                  isLoading={isLoading}
                  label="Description"
                  renderWhenEmpty="-"
                  value={data?.message?.cause?.problem?.invariantViolation?.description}
                />
                <NutritionFact
                  isLoading={isLoading}
                  label="Description"
                  renderWhenEmpty="-"
                  value={urgencyLabels[data?.message?.cause?.problem?.invariantViolation?.urgency || O5DempeV1Urgency.Unspecified]}
                />
                <NutritionFact
                  isLoading={isLoading}
                  label="Error"
                  renderWhenEmpty="-"
                  value={<InvariantViolationPayloadDialog payload={data?.message?.cause?.problem?.invariantViolation?.error?.json || ''} />}
                />
              </>
            )}

            {problemType === DeadMessageProblem.UnhandledError && (
              <NutritionFact isLoading={isLoading} label="Error" renderWhenEmpty="-" value={data?.message?.cause?.problem?.unhandledError?.error} />
            )}
          </CardContent>
        </Card>
        <Card className="flex-grow h-fit">
          <CardHeader className="text-lg font-semibold">Actions</CardHeader>
          <CardContent>
            <DataTable
              getRowCanExpand
              columns={activityColumns}
              data={data?.actions || []}
              renderSubComponent={renderSubRow}
              showSkeleton={Boolean(isLoading || error)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
