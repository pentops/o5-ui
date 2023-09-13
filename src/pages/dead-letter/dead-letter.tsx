import React from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { DataTable } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { O5DempeV1MessageAction, O5DempeV1Urgency } from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import {
  DeadMessageProblem,
  deadMessageProblemLabels,
  getDeadMessageProblem,
  getMessageActionType,
  messageActionTypeLabels,
  urgencyLabels,
} from '@/data/types/ui/dempe.ts';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

// TODO: make expandable to show actor & edited JSON where applicable
const activityColumns: ColumnDef<O5DempeV1MessageAction>[] = [
  {
    header: 'Timestamp',
    accessorKey: 'timestamp',
    cell: ({ getValue }) => {
      return <DateFormat value={getValue<string>()} />;
    },
  },
  {
    header: 'Action',
    accessorFn: (row) => messageActionTypeLabels[getMessageActionType(row)],
  },
  {
    header: 'Note',
    accessorKey: 'note',
  },
];

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
      <div className="w-full inline-flex gap-4">
        <Card className="flex-grow-0 w-[325px]">
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
              value={data?.message?.cause?.rejectedTimestamp ? <DateFormat value={data.message.cause.rejectedTimestamp} /> : null}
            />
            <NutritionFact
              isLoading={isLoading}
              label="Sent At"
              renderWhenEmpty="-"
              value={data?.message?.cause?.initialSentTimestamp ? <DateFormat value={data.message.cause.initialSentTimestamp} /> : null}
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
                  value={data?.message?.cause?.invariantViolation?.description}
                />
                <NutritionFact
                  isLoading={isLoading}
                  label="Description"
                  renderWhenEmpty="-"
                  value={urgencyLabels[data?.message?.cause?.invariantViolation?.urgency || O5DempeV1Urgency.Unspecified]}
                />
                {/* TODO: render activator for dialog showing payload JSON */}
              </>
            )}

            {problemType === DeadMessageProblem.UnhandledError && (
              <NutritionFact isLoading={isLoading} label="Error" renderWhenEmpty="-" value={data?.message?.cause?.unhandledError?.error} />
            )}
          </CardContent>
        </Card>
        <Card className="flex-grow">
          <CardHeader className="text-lg font-semibold">Actions</CardHeader>
          <CardContent>
            <DataTable columns={activityColumns} data={data?.actions || []} showSkeleton={Boolean(isLoading || error)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
