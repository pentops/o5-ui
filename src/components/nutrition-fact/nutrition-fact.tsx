import React from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';

interface NutritionFactProps {
  isLoading?: boolean;
  label: React.ReactNode;
  renderWhenEmpty?: React.ReactNode;
  value: React.ReactNode;
}

export function NutritionFact({ isLoading, label, renderWhenEmpty, value }: NutritionFactProps) {
  return (
    <div className="flex items-center place-content-between gap-4 text-sm">
      <span className="font-semibold">{label}</span>
      <span>{isLoading ? <Skeleton className="h-4 w-full min-w-[125px]" /> : value || renderWhenEmpty}</span>
    </div>
  );
}
