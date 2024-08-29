import React, { useMemo, useState } from 'react';
import { CustomColumnDef, DataTable } from '@/components/data-table/data-table.tsx';
import {
  getOneOfType,
  O5DanteV1DeadMessageQueryServiceListDeadMessagesListDeadMessagesRequest,
  O5DanteV1DeadMessageState,
  O5MessagingV1ProblemOneOfValue,
  O5MessagingV1WireEncoding,
} from '@/data/types';
import { ActionActivator } from '@/pages/dead-letter-management/action-activator/action-activator.tsx';
import { UUID } from '@/components/uuid/uuid.tsx';
import { useErrorHandler } from '@/lib/error.ts';
import { useTableState } from '@/components/data-table/state.ts';
import { getRowExpander } from '@/components/data-table/row-expander/row-expander.tsx';
import { TableRowType } from '@/components/data-table/body.tsx';
import { useO5DanteV1DeadMessageQueryServiceListDeadMessages } from '@/data/api/hooks/generated';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { O5_DANTE_V1_DEAD_MESSAGE_QUERY_SERVICE_LIST_DEAD_MESSAGES_DEFAULT_SORTS } from '@/data/table-config/generated';
import { DateFormat } from '@/components/format/date/date-format.tsx';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { MessageProblem } from '@/pages/dead-letter/dead-message/message-problem.tsx';
import { match } from 'ts-pattern';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

function getColumns(t: TFunction): CustomColumnDef<O5DanteV1DeadMessageState>[] {
  return [
    getRowExpander(),
    {
      header: 'Message ID',
      id: 'messageId',
      minSize: 110,
      size: 110,
      maxSize: 110,
      accessorFn: (row) => row.messageId,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? <UUID canCopy short to={`/dead-letter/${value}`} uuid={value} /> : null;
      },
    },
    {
      header: 'Status',
      id: 'status',
      minSize: 120,
      size: 120,
      maxSize: 150,
      accessorFn: (row) => (row.status ? t(`dante:enum.O5DanteV1MessageStatus.${row.status}`) : ''),
    },
    {
      header: 'Handler App',
      id: 'data.notification.handlerApp',
      accessorFn: (row) => row.data?.notification?.handlerApp,
    },
    {
      header: 'Handler Environment',
      id: 'data.notification.handlerEnv',
      accessorFn: (row) => row.data?.notification?.handlerEnv,
    },
    {
      header: 'Queue URL',
      id: 'data.currentVersion.sqsMessage.queueUrl',
      accessorFn: (row) => row.data?.currentVersion?.sqsMessage?.queueUrl,
    },
    {
      header: 'Problem',
      id: 'data.notification.problem',
      accessorFn: (row) => getOneOfType(row.data?.notification?.problem),
      cell: ({ getValue }) => {
        const value = getValue<O5MessagingV1ProblemOneOfValue>();
        return value ? <TranslatedText i18nKey={`o5:oneOf.O5MessagingV1Problem.${value}`} /> : null;
      },
      size: 225,
      maxSize: 225,
      minSize: 225,
    },
    {
      header: 'Created At',
      id: 'metadata.createdAt',
      size: 225,
      maxSize: 225,
      minSize: 225,
      accessorFn: (row) => row.metadata?.createdAt,
      cell: ({ getValue }) => {
        const value = getValue<string>();

        return value ? (
          <DateFormat
            day="2-digit"
            hour="numeric"
            minute="2-digit"
            second="numeric"
            month="2-digit"
            timeZoneName="short"
            year="numeric"
            value={value}
          />
        ) : null;
      },
    },
    {
      header: () => {
        return <div className="block w-[40px]" />;
      },
      size: 75,
      minSize: 75,
      maxSize: 75,
      id: 'actions',
      align: 'right',
      accessorFn: (row) => row.messageId,
      cell: ({ getValue }) => {
        return <ActionActivator messageId={getValue<string>()} />;
      },
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSubRowRenderer(_decodeB64: boolean, _setDecodeB64: (value: boolean) => void) {
  return function renderSubRow({ row }: TableRowType<O5DanteV1DeadMessageState>) {
    return (
      <div className="flex flex-col gap-4">
        {row.original.data?.notification?.problem && <MessageProblem vertical heading="Problem" problem={row.original.data?.notification?.problem} />}

        <div className="flex gap-2 items-center">
          <h3 className="text-lg">Body</h3>

          <NutritionFact label="Type" renderWhenEmpty="-" value={row.original.data?.notification?.message?.body?.typeUrl} />

          {match(row.original.data?.notification?.message?.body)
            .with({ encoding: O5MessagingV1WireEncoding.Protojson }, (b) => <CodeEditor value={b.value || ''} language="json" />)
            .otherwise((b) => b?.value)}
          {/*{hasEncodedB64 && (*/}
          {/*  <button*/}
          {/*    className="bg-background border border-r-2 hover:bg-slate-900 text-white font-bold py-1 px-2 rounded flex gap-2 items-center text-sm w-fit"*/}
          {/*    onClick={() => {*/}
          {/*      setDecodeB64(!decodeB64);*/}
          {/*    }}*/}
          {/*    type="button"*/}
          {/*  >*/}
          {/*    <MagicWandIcon />*/}
          {/*    {decodeB64 ? 'Encode' : 'Decode'}*/}
          {/*  </button>*/}
          {/*)}*/}
        </div>
        {/*<CodeEditor disabled value={formatJSONString(row.original?.currentSpec?.payload?.json || '', decodeB64)} />*/}
      </div>
    );
  };
}

function DeadLetterManagement() {
  const { t } = useTranslation('dante');
  const [decodeB64, setDecodeB64] = useState<boolean>(false);
  const columns = useMemo(() => getColumns(t), [t]);
  const { sortValues, setSortValues, setFilterValues, filterValues, psmQuery } = useTableState<
    O5DanteV1DeadMessageQueryServiceListDeadMessagesListDeadMessagesRequest['query']
  >({
    initialSort: O5_DANTE_V1_DEAD_MESSAGE_QUERY_SERVICE_LIST_DEAD_MESSAGES_DEFAULT_SORTS,
    // initialFilters: O5_DANTE_V1_DEAD_MESSAGE_QUERY_SERVICE_LIST_DEAD_MESSAGES_DEFAULT_FILTERS,
  });
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useO5DanteV1DeadMessageQueryServiceListDeadMessages({
    query: psmQuery,
  });
  useErrorHandler(error, 'Failed to load dead letter messages');
  const flatData = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      if (page?.messages) {
        return [...acc, ...page.messages];
      }

      return acc;
    }, [] as O5DanteV1DeadMessageState[]);
  }, [data?.pages]);

  const renderSubRow = useMemo(() => getSubRowRenderer(decodeB64, setDecodeB64), [decodeB64]);

  return (
    <div className="w-full">
      <div className="flex items-end place-content-between w-full pb-4">
        <h1 className="text-2xl">Dead Letter Management</h1>
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

export default DeadLetterManagement;
