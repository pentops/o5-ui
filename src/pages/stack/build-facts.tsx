import { O5AwsDeployerV1CfStackOutput } from '@/data/types';
import { NutritionFact } from '@/components/nutrition-fact/nutrition-fact.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import React from 'react';
import { TranslatedText } from '@/components/translated-text/translated-text.tsx';
import { deployerKeyValuePairsToJSON } from '@/lib/aws.ts';

// export function buildCodeSourceFact(codeSource: O5DeployerV1CodeSourceType | undefined, isLoading?: boolean) {
//   return (
//     <NutritionFact
//       label="Code Source"
//       isLoading={isLoading}
//       renderWhenEmpty="-"
//       value={match(codeSource?.type)
//         .with({ github: P.not(P.nullish) }, (t) => {
//           let linkTo = `https://github.com/`;
//           let sourceDetail = '';
//
//           if (t.github.owner && t.github.repo) {
//             linkTo += `${t.github.owner}/${t.github.repo}`;
//             sourceDetail = `${t.github.owner}/${t.github.repo}`;
//
//             if (t.github.commit) {
//               linkTo += `/commit/${t.github.commit}`;
//               sourceDetail = `${sourceDetail}@${t.github.commit}`;
//             }
//           }
//
//           return (
//             <a href={linkTo} className="flex gap-1 items-center" target="_blank">
//               <GitHubLogoIcon />
//               {`GitHub${sourceDetail ? ` (${sourceDetail})` : ''}`}
//             </a>
//           );
//         })
//         .otherwise(() => undefined)}
//     />
//   );
// }

export function buildCFStackOutput(output: O5AwsDeployerV1CfStackOutput | undefined) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NutritionFact
        renderWhenEmpty="-"
        label="Lifecycle"
        value={output?.lifecycle ? <TranslatedText i18nKey={`awsDeployer:enum.O5AwsDeployerV1CfLifecycle.${output.lifecycle}`} /> : undefined}
      />
      <NutritionFact
        renderWhenEmpty="-"
        label="Outputs"
        value={output?.outputs ? <CodeEditor value={deployerKeyValuePairsToJSON(output?.outputs)} /> : ''}
      />
    </div>
  );
}
