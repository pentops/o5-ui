import { deployerKeyValuePairsToJSON, O5DeployerV1CFStackOutput } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import React from 'react';

export function buildCFStackOutput(output: O5DeployerV1CFStackOutput | undefined) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NutritionFact label="Lifecycle" value={output?.lifecycle} />
      <NutritionFact label="Outputs" value={<CodeEditor value={deployerKeyValuePairsToJSON(output?.outputs)} />} />
    </div>
  );
}
