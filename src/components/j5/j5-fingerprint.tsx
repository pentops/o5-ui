import React from 'react';
import { J5AuthV1Fingerprint } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';

interface J5FingerprintProps {
  heading?: React.ReactNode;
  fingerprint: J5AuthV1Fingerprint | undefined;
  isLoading?: boolean;
  vertical?: boolean;
}

export function J5Fingerprint({ heading, fingerprint, isLoading, vertical }: J5FingerprintProps) {
  return (
    <>
      {heading && <span>{heading}</span>}

      <NutritionFact vertical={vertical} isLoading={isLoading} renderWhenEmpty="-" label="IP Address" value={fingerprint?.ipAddress} />
      <NutritionFact vertical={vertical} isLoading={isLoading} renderWhenEmpty="-" label="User-Agent" value={fingerprint?.userAgent} />
    </>
  );
}
