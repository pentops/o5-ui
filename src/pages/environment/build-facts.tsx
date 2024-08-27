import React from 'react';
import { O5EnvironmentV1CustomVariable } from '@/data/types';
import { match, P } from 'ts-pattern';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';

function variablesToJSON(vars: O5EnvironmentV1CustomVariable[] | undefined) {
  const obj =
    vars?.map((v) => ({
      [v.name || 'Missing Name']: match(v)
        .with({ value: P.string }, (s) => s.value)
        .with({ join: P.not(P.nullish) }, (j) => {
          if (!j.join.delimiter || j.join.delimiter === ',') {
            return j.join.values;
          }

          return j.join.values?.join(j.join.delimiter);
        })
        .otherwise(() => undefined),
    })) || [];

  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '[]';
  }
}

export function buildEnvironmentCustomVariables(vars: O5EnvironmentV1CustomVariable[] | undefined) {
  return <CodeEditor disabled value={variablesToJSON(vars) || '[]'} language="json" />;
}

// export function buildAWSEnvironment(provider: O5EnvironmentV1AwsEnvironment | undefined) {
//   return (
//     <div className="p-2 flex flex-col gap-2">
//       <strong>AWS</strong>
//     </div>
//   );
// }
