import { match, P } from 'ts-pattern';
import { NormalizedQueryPlugin } from '@pentops/j5-ts-generator-normalized-query-plugin';
import { kebabCase } from 'change-case';

export const normalizedQueryPlugin = new NormalizedQueryPlugin({
  files: (generatedSchemas, generatedClientFunctions) => {
    const files = [];

    for (const [, schema] of generatedSchemas) {
      const entity = match(schema.rawSchema)
        .with({ object: { entity: { primaryKeys: P.not(P.nullish) } } }, (s) => s)
        .otherwise(() => undefined);

      if (entity) {
        files.push({
          clearDirectoryBeforeWrite: true,
          clientFunctionFilter: false,
          directory: './src/data/entities/generated',
          fileName: `${kebabCase(schema.generatedName)}.ts`,
          schemaFilter: (s) => s.generatedName === schema.generatedName,
        });
      }
    }

    for (const method of generatedClientFunctions) {
      files.push({
        clearDirectoryBeforeWrite: true,
        clientFunctionFilter: (m) => m.generatedName === method.generatedName,
        directory: './src/data/api/hooks/generated',
        fileName: `${kebabCase(method.generatedName)}.ts`,
        schemaFilter: (s) => {
          const methodSchemas = [
            method.method.responseBodySchema?.generatedName,
            method.method.mergedRequestSchema?.generatedName,
            method.method.requestBodySchema?.generatedName,
            method.method.pathParametersSchema?.generatedName,
            method.method.queryParametersSchema?.generatedName,
          ].filter(Boolean);

          return methodSchemas.length && methodSchemas.includes(s.generatedName);
        },
      });
    }

    return files;
  },
});
