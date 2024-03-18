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
        .with({ gitHub: P.not(P.nullish) }, (t) => {
          let linkTo = `https://gitHub.com/`;
          let sourceDetail = '';

          if (t.gitHub.owner && t.gitHub.repo) {
            linkTo += `${t.gitHub.owner}/${t.gitHub.repo}`;
            sourceDetail = `${t.gitHub.owner}/${t.gitHub.repo}`;

            if (t.gitHub.ref?.branch) {
              linkTo += `/tree/${t.gitHub.ref.branch}`;
              sourceDetail = `${sourceDetail}:${t.gitHub.ref.branch}`;
            } else if (t.gitHub?.ref?.commit) {
              linkTo += `/commit/${t.gitHub.ref.commit}`;
              sourceDetail = `${sourceDetail}@${t.gitHub.ref.commit}`;
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
