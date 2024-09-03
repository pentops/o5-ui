import React from 'react';
import { J5StateV1StateMetadata } from '@/data/types';
import { NutritionFactProps } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { DateFormat } from '@/components/format/date/date-format.tsx';

export function buildJ5StateMetadataFacts(data: J5StateV1StateMetadata | undefined) {
  const base: Record<keyof J5StateV1StateMetadata, NutritionFactProps> = {
    createdAt: {
      renderWhenEmpty: '-',
      label: 'Created At',
      value: data?.createdAt ? (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={data.createdAt}
        />
      ) : undefined,
    },
    updatedAt: {
      renderWhenEmpty: '-',
      label: 'Updated At',
      value: data?.updatedAt ? (
        <DateFormat
          day="2-digit"
          hour="numeric"
          minute="2-digit"
          second="numeric"
          month="2-digit"
          timeZoneName="short"
          year="numeric"
          value={data.updatedAt}
        />
      ) : undefined,
    },
    lastSequence: { renderWhenEmpty: '-', label: 'Last Sequence', value: data?.lastSequence },
  };

  return base;
}
