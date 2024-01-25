import React from 'react';
import { match, P } from 'ts-pattern';
import { useParams } from 'react-router-dom';
import { useMessage } from '@/data/api';
import { useErrorHandler } from '@/lib/error.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { DataTable, TableRow } from '@/components/data-table/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { deadMessageEventTypeLabels, getDeadMessageEventType, O5DanteV1DeadMessageEvent, O5DanteV1Problem, O5DanteV1Urgency } from '@/data/types';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { DeadMessageProblem, deadMessageProblemLabels, getDeadMessageProblem, urgencyLabels } from '@/data/types/ui/dante.ts';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { JSONEditor } from '@/components/json-editor/json-editor.tsx';
import { InvariantViolationPayloadDialog } from '@/pages/dead-letter/invariant-violation-payload-dialog/invariant-violation-payload-dialog.tsx';

function renderProblem(problem: O5DanteV1Problem | undefined) {
  return match(problem?.type)
    .with({ invariantViolation: P.not(P.nullish) }, (p) => {
      return (
        <>
          <NutritionFact label="Description" renderWhenEmpty="-" value={p.invariantViolation?.description} />
          <NutritionFact
            label="Description"
            renderWhenEmpty="-"
            value={urgencyLabels[(p.invariantViolation?.urgency as O5DanteV1Urgency | undefined) || O5DanteV1Urgency.Unspecified]}
          />
          <NutritionFact
            label="Error"
            renderWhenEmpty="-"
            value={<InvariantViolationPayloadDialog payload={p.invariantViolation?.error?.json || ''} />}
          />
        </>
      );
    })
    .with({ unhandledError: P.not(P.nullish) }, (p) => {
      return <NutritionFact vertical label="Error" value={p.unhandledError.error} />;
    })
    .otherwise(() => null);
}

const eventColumns: ColumnDef<O5DanteV1DeadMessageEvent, any>[] = [
  getRowExpander(),
  {
    header: 'ID',
    accessorFn: (row) => row.metadata?.eventId,
    cell: ({ getValue }) => {
      return <UUID short uuid={getValue<string>()} />;
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
  {
    header: 'Type',
    accessorFn: (row) => deadMessageEventTypeLabels[getDeadMessageEventType(row.event)],
  },
];

function renderSubRow({ row }: TableRow<O5DanteV1DeadMessageEvent>) {
  const problemType = getDeadMessageProblem(row.original.event?.type?.created?.spec);

  return (
    <div className="flex flex-col gap-4">
      <NutritionFact vertical label="Actor" value="-" />

      {match(row.original.event?.type)
        .with({ updated: P.not(P.nullish) }, (e) => {
          return (
            <>
              <NutritionFact vertical label="Version ID" value={<UUID uuid={e.updated.spec?.versionId} />} />
              <NutritionFact vertical label="Queue Name" value={e.updated.spec?.queueName} />
              <NutritionFact vertical label="gRPC Name" value={e.updated.spec?.grpcName} />
              <NutritionFact vertical label="Infa Message ID" value={<UUID uuid={e.updated.spec?.infraMessageId} />} />
              <NutritionFact
                vertical
                label="Created At"
                value={
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={e.updated.spec?.createdAt}
                  />
                }
              />

              <NutritionFact
                label="Problem"
                renderWhenEmpty="-"
                value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}
              />

              {renderProblem(e.updated.spec?.problem)}

              <NutritionFact vertical label="JSON" value={<JSONEditor disabled value={e.updated.spec?.payload?.json || ''} />} />
            </>
          );
        })
        .with({ created: P.not(P.nullish) }, (e) => {
          return (
            <>
              <NutritionFact vertical label="Version ID" value={<UUID uuid={e.created.spec?.versionId} />} />
              <NutritionFact vertical label="Queue Name" value={e.created.spec?.queueName} />
              <NutritionFact vertical label="gRPC Name" value={e.created.spec?.grpcName} />
              <NutritionFact vertical label="Infa Message ID" value={<UUID uuid={e.created.spec?.infraMessageId} />} />
              <NutritionFact
                vertical
                label="Created At"
                value={
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={e.created.spec?.createdAt}
                  />
                }
              />

              <NutritionFact
                label="Problem"
                renderWhenEmpty="-"
                value={problemType !== DeadMessageProblem.Unspecified ? deadMessageProblemLabels[problemType] : null}
              />

              {renderProblem(e.created.spec?.problem)}

              <NutritionFact vertical label="JSON" value={<JSONEditor disabled value={e.created.spec?.payload?.json || ''} />} />
            </>
          );
        })
        .with({ rejected: P.not(P.nullish) }, (e) => {
          return <NutritionFact vertical label="Reason" value={e.rejected.reason} />;
        })
        .otherwise(() => null)}
    </div>
  );
}

export function DeadLetter() {
  const { messageId } = useParams();
  const { data, error, isLoading } = useMessage({ messageId });
  useErrorHandler(error, 'Failed to load dead letter message');
  const problemType = getDeadMessageProblem(data?.message?.currentSpec);

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
              value={data?.message?.currentSpec?.infraMessageId ? <UUID canCopy short uuid={data.message.currentSpec.infraMessageId} /> : null}
            />
            <NutritionFact isLoading={isLoading} label="Queue Name" renderWhenEmpty="-" value={data?.message?.currentSpec?.queueName} />
            <NutritionFact isLoading={isLoading} label="gRPC Name" renderWhenEmpty="-" value={data?.message?.currentSpec?.grpcName} />
            <NutritionFact
              isLoading={isLoading}
              label="Created At"
              renderWhenEmpty="-"
              value={
                data?.message?.currentSpec?.createdAt ? (
                  <DateFormat
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                    second="numeric"
                    month="2-digit"
                    timeZoneName="short"
                    year="numeric"
                    value={data.message.currentSpec.createdAt}
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

            {renderProblem(data?.message?.currentSpec?.problem)}
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
              showSkeleton={Boolean(data === undefined || isLoading || error)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
