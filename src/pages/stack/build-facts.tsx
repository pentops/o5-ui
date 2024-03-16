import { deployerKeyValuePairsToJSON, O5DeployerV1CFStackOutput, O5DeployerV1CodeSourceType } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import React from 'react';
import { match, P } from 'ts-pattern';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export function buildCodeSourceFact(codeSource: O5DeployerV1CodeSourceType | undefined) {
  return (
    <NutritionFact
      label="Code Source"
      renderWhenEmpty="-"
      value={match(codeSource?.type)
        .with({ github: P.not(P.nullish) }, (t) => {
          let linkTo = `https://github.com/`;
          let sourceDetail = '';

          if (t.github.owner && t.github.repo) {
            linkTo += `${t.github.owner}/${t.github.repo}`;
            sourceDetail = `${t.github.owner}/${t.github.repo}`;

            if (t.github.branch) {
              linkTo += `/tree/${t.github.branch}`;
              sourceDetail = `${sourceDetail}:${t.github.branch}`;
            }
          }

          return (
            <a href={linkTo} className="flex gap-1 items-center" target="_blank">
              <GitHubLogoIcon />
              {`GitHub${sourceDetail ? ` (${sourceDetail})` : ''}`}
            </a>
          );
        })
        .otherwise(() => undefined)}
    />
  );
}

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
