import { deployerKeyValuePairsToJSON, O5DeployerV1CFStackOutput } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import React from 'react';

export function buildCFStackOutput(output: O5DeployerV1CFStackOutput | undefined) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NutritionFact renderWhenEmpty="-" label="Lifecycle" value={output?.lifecycle} />
      <NutritionFact
        renderWhenEmpty="-"
        label="Outputs"
        value={output?.outputs ? <CodeEditor value={deployerKeyValuePairsToJSON(output?.outputs)} /> : ''}
      />
    </div>
  );
}
