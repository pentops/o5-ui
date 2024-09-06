import { match, P } from 'ts-pattern';
import { J5ListV1QueryRequest } from '@/data/types';
import { type BaseTableFilter, ExtractFilterField, ExtractSearchField, ExtractSortField } from '@pentops/react-table-state-psm';
import { CustomColumnDef } from '@/components/data-table/data-table.tsx';
import { TableFilter } from '@/components/data-table/state.ts';

export function getSafeColumnId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}

export function extendColumnsWithPSMFeatures<
  TData,
  T extends J5ListV1QueryRequest<ExtractSearchField<T>, ExtractSortField<T>, ExtractFilterField<T>> | undefined,
  TDef extends CustomColumnDef<TData> = CustomColumnDef<TData>,
>(columnDefinitions: TDef[], filters: BaseTableFilter<ExtractFilterField<T>>[], sortFields: ExtractSortField<T>[] | undefined): TDef[] {
  return columnDefinitions.reduce<TDef[]>((acc, curr) => {
    const base = { ...curr };

    base.enableSorting = base.enableSorting ?? Boolean(sortFields?.find((f) => f === curr.id));

    const matchingFilter = filters.find((f) => f.id === curr.id);

    if (matchingFilter) {
      if (!base.filter) {
        const filterType = match(matchingFilter.type)
          .returnType<TableFilter['type'] | undefined>()
          .with({ enum: P.not(P.nullish) }, (s) => ({ select: { options: s.enum.options, isMultiple: true } }))
          .with({ oneOf: P.not(P.nullish) }, (s) => ({ select: { options: s.oneOf.options, isMultiple: true } }))
          .with({ numeric: P.not(P.nullish) }, () => ({
            numeric: { isFlexible: true, exactLabel: 'Value', minLabel: 'Min', maxLabel: 'Max' },
          }))
          .with({ date: P.not(P.nullish) }, (s) => ({
            date: { allowTime: s.date.allowTime, isFlexible: true, exactLabel: 'Pick a date', startLabel: 'Min', endLabel: 'Max' },
          }))
          .otherwise(() => undefined);

        if (filterType) {
          base.filter = {
            type: filterType,
          };
        }
      }
    }

    return acc;
  }, []);
}
