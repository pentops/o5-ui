import React from 'react';
import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';

interface NutritionFactProps {
  isLoading?: boolean;
  label: React.ReactNode;
  renderWhenEmpty?: React.ReactNode;
  value: React.ReactNode;
  vertical?: boolean;
}

export function NutritionFact({ isLoading, label, renderWhenEmpty, value, vertical }: NutritionFactProps) {
  return (
    <div className={clsx('flex place-content-between text-sm', vertical ? 'flex-col items-start gap-2' : 'items-center gap-4')}>
      <span className={clsx('font-semibold', vertical && 'w-full')}>{label}</span>
      <span className={clsx('text-right', vertical && 'w-full')}>
        {isLoading ? <Skeleton className="h-4 w-full min-w-[125px]" /> : value || renderWhenEmpty}
      </span>
    </div>
  );
}
