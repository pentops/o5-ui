import { factory } from 'typescript';
import { getImportPath } from '@pentops/jsonapi-jdef-ts-generator';
import { defaultTranslationPathOrGetter } from '@pentops/j5-ts-generator-i18n-plugin';
import { PSMTableConfigPlugin } from '@pentops/j5-ts-generator-psm-table-config-plugin';
import {
  CASE_OVERRIDES,
  getPackageFileName,
  getValidSchemaPackage,
  I18N_T_FUNCTION_TYPE_NAME,
  titleCaseName,
  TRANSLATION_DIRECTORY,
} from './shared.js';

const T_FUNCTION_NAME = 't';

export const psmTableConfigPlugin = new PSMTableConfigPlugin({
  files: [
    {
      directory: './src/data/table-config/generated',
      fileName: 'index.ts',
    },
  ],
  filter: {
    labelWriter: (options) => {
      const pkg = getValidSchemaPackage(options.filterEnum);
      const schemaI18nTranslationPath = defaultTranslationPathOrGetter(options.filterEnum);
      const keyName = options.filterEnum.generatedValueNames?.get(options.field.name);

      if (pkg && schemaI18nTranslationPath && keyName) {
        const i18nNamespace = getPackageFileName(pkg);

        options.file.addManualImport(
          getImportPath(TRANSLATION_DIRECTORY, 'index.ts', options.file.config.directory, options.file.config.fileName),
          [I18N_T_FUNCTION_TYPE_NAME],
          [I18N_T_FUNCTION_TYPE_NAME],
        );
        options.file.addGeneratedTypeImport(options.filterEnum.generatedName);
        options.injectDependency(T_FUNCTION_NAME, I18N_T_FUNCTION_TYPE_NAME);

        return factory.createCallExpression(factory.createIdentifier(T_FUNCTION_NAME), undefined, [
          factory.createTemplateExpression(factory.createTemplateHead(`${i18nNamespace}:enum.${options.filterEnum.generatedName}.`), [
            factory.createTemplateSpan(
              factory.createPropertyAccessExpression(factory.createIdentifier(options.filterEnum.generatedName), keyName),
              factory.createTemplateTail(''),
            ),
          ]),
        ]);
      }

      return options.field.name.split('.').pop() || options.field.name;
    },
    typeDefinitionWriterConfig: {
      enumOptionLabelWriter: (options) => {
        if (options.generatedFieldSchema) {
          const pkg = getValidSchemaPackage(options.generatedFieldSchema);
          const schemaI18nTranslationPath = defaultTranslationPathOrGetter(options.generatedFieldSchema);
          const keyName = options.generatedFieldSchema.generatedValueNames?.get(options.field.name);

          if (pkg && schemaI18nTranslationPath && keyName) {
            const i18nNamespace = getPackageFileName(pkg);

            options.file.addManualImport(
              getImportPath(TRANSLATION_DIRECTORY, 'index.ts', options.file.config.directory, options.file.config.fileName),
              [I18N_T_FUNCTION_TYPE_NAME],
              [I18N_T_FUNCTION_TYPE_NAME],
            );
            options.file.addGeneratedTypeImport(options.generatedFieldSchema.generatedName);
            options.injectDependency(T_FUNCTION_NAME, I18N_T_FUNCTION_TYPE_NAME);

            return factory.createCallExpression(factory.createIdentifier(T_FUNCTION_NAME), undefined, [
              factory.createTemplateExpression(factory.createTemplateHead(`${i18nNamespace}:enum.${options.generatedFieldSchema.generatedName}.`), [
                factory.createTemplateSpan(
                  factory.createPropertyAccessExpression(factory.createIdentifier(options.generatedFieldSchema.generatedName), keyName),
                  factory.createTemplateTail(''),
                ),
              ]),
            ]);
          }
        }

        return titleCaseName(options.field.name.split('.').pop() || options.field.name, CASE_OVERRIDES);
      },
    },
  },
});
