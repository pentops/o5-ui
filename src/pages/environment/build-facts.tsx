import React from 'react';
import {
  O5EnvironmentV1AwsEnvironment,
  O5EnvironmentV1AwsLink,
  O5EnvironmentV1CustomVariable,
  O5EnvironmentV1Environment,
  O5EnvironmentV1NamedIamPolicy,
} from '@/data/types';
import { match, P } from 'ts-pattern';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { NutritionFactProps } from '@/components/nutrition-fact/nutrition-fact.tsx';

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

export function buildDeployerEnvironment(spec: O5EnvironmentV1Environment | undefined) {
  const base: Omit<Record<keyof O5EnvironmentV1Environment, NutritionFactProps>, 'aws'> = {
    fullName: { renderWhenEmpty: '-', label: 'Full Name', value: spec?.fullName },
    clusterName: { renderWhenEmpty: '-', label: 'Cluster Name', value: spec?.clusterName },
    trustJwks: { renderWhenEmpty: '-', label: 'Trust JWKS', value: spec?.trustJwks?.join('\n') },
    vars: { renderWhenEmpty: '-', label: 'Variables', value: <CodeEditor disabled value={variablesToJSON(spec?.vars) || '[]'} language="json" /> },
    corsOrigins: { renderWhenEmpty: '-', label: 'CORS Origins', value: spec?.corsOrigins?.join('\n') },
  };

  return base;
}

export function deployerAWSNamedIAMPoliciesToJSON(iamPolicies: O5EnvironmentV1NamedIamPolicy[] | undefined) {
  const obj = (iamPolicies || []).reduce<Record<string, string>>(
    (acc, curr) => ({
      ...acc,
      [curr.name || 'Missing Name']: curr.policyArn || 'Missing Policy ARN',
    }),
    {},
  );

  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '{}';
  }
}

export function getDeployerAWSEnvironmentLinkKey(spec: O5EnvironmentV1AwsLink, index: number) {
  return spec.lookupName || spec.fullName || spec.snsPrefix || index;
}

export function buildDeployerAWSEnvironmentLink(spec: O5EnvironmentV1AwsLink | undefined) {
  const base: Record<keyof O5EnvironmentV1AwsLink, NutritionFactProps> = {
    fullName: { renderWhenEmpty: '-', label: 'Full Name', value: spec?.fullName },
    lookupName: { renderWhenEmpty: '-', label: 'Lookup Name', value: spec?.lookupName },
    snsPrefix: { renderWhenEmpty: '-', label: 'SNS Prefix', value: spec?.snsPrefix },
  };

  return base;
}

export function buildDeployerAWSEnvironment(spec: O5EnvironmentV1AwsEnvironment | undefined) {
  const base: Omit<Record<keyof O5EnvironmentV1AwsEnvironment, NutritionFactProps>, 'environmentLinks'> = {
    hostHeader: { renderWhenEmpty: '-', label: 'Host Header', value: spec?.hostHeader },
    iamPolicies: {
      renderWhenEmpty: '-',
      label: 'IAM Policies',
      value: <CodeEditor disabled value={deployerAWSNamedIAMPoliciesToJSON(spec?.iamPolicies) || '[]'} language="json" />,
    },
  };

  return base;
}
