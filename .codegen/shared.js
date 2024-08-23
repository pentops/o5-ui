import { capitalCase, kebabCase } from 'change-case';
import { match, P } from 'ts-pattern';

export const DEFAULT_MINOR_WORDS = [
  'and',
  'as',
  'but',
  'for',
  'if',
  'nor',
  'or',
  'so',
  'yet',
  'a',
  'an',
  'the',
  'as',
  'at',
  'by',
  'for',
  'in',
  'of',
  'off',
  'on',
  'per',
  'to',
  'up',
  'via',
  'with',
];

export const I18N_T_FUNCTION_TYPE_NAME = 'TFunction';

export function getPackageFileName(pkg) {
  if (pkg.label) {
    return kebabCase(pkg.label.toLowerCase());
  }

  return kebabCase(pkg.package.split('.')[0].toLowerCase());
}

export function getValidSchemaPackage(schema) {
  return match(schema)
    .with({ rawSchema: { enum: P.not(P.nullish) } }, (s) => {
      // if (s.rawSchema.enum.isDerivedHelperType) {
      //   return undefined;
      // }

      return s.parentPackage || s.rawSchema.enum.package;
    })
    .with({ rawSchema: { oneOf: P.not(P.nullish) } }, (s) => s.parentPackage || s.rawSchema.oneOf.package)
    .otherwise(() => undefined);
}

export function titleCaseName(name, forcedCaseWords = {}, minorWords = DEFAULT_MINOR_WORDS) {
  const lastKeyPart = name.split('.').pop() || name;
  const capitalCased = capitalCase(lastKeyPart);
  const split = capitalCased.split(' ');

  return split
    .map((word, i) => {
      const lowerCasedWord = word.toLowerCase();

      if (forcedCaseWords[lowerCasedWord]) {
        return forcedCaseWords[lowerCasedWord];
      }

      if (i !== 0 && minorWords.includes(lowerCasedWord)) {
        return lowerCasedWord;
      }

      return word;
    })
    .join(' ');
}

export const CASE_OVERRIDES = {
  api: 'API',
  id: 'ID',
  url: 'URL',
  psm: 'PSM',
  jwt: 'JWT',
  jti: 'JTI',
  http: 'HTTP',
  github: 'GitHub',
  json: 'JSON',
  yaml: 'YAML',
  xml: 'XML',
  cf: 'CF',
  pg: 'PG',
  aws: 'AWS',
  ecs: 'ECS',
};
