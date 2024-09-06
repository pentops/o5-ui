import { camelCase } from 'change-case';
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
  search: {
    labelWriter: (options) => {
      const pkg = getValidSchemaPackage(options.fieldEnum);
      const schemaI18nTranslationPath = defaultTranslationPathOrGetter(options.fieldEnum);
      const keyName = options.fieldEnum.generatedValueNames?.get(options.field.name);

      if (pkg && schemaI18nTranslationPath && keyName) {
        const i18nNamespace = camelCase(getPackageFileName(pkg));

        options.file.addManualImport(
          getImportPath(TRANSLATION_DIRECTORY, 'index.ts', options.file.config.directory, options.file.config.fileName),
          [I18N_T_FUNCTION_TYPE_NAME],
          [I18N_T_FUNCTION_TYPE_NAME],
        );
        options.file.addGeneratedTypeImport(options.fieldEnum.generatedName);
        options.injectDependency(T_FUNCTION_NAME, I18N_T_FUNCTION_TYPE_NAME);

        return factory.createCallExpression(factory.createIdentifier(T_FUNCTION_NAME), undefined, [
          factory.createTemplateExpression(factory.createTemplateHead(`${i18nNamespace}:enum.${options.fieldEnum.generatedName}.`), [
            factory.createTemplateSpan(
              factory.createPropertyAccessExpression(factory.createIdentifier(options.fieldEnum.generatedName), keyName),
              factory.createTemplateTail(''),
            ),
          ]),
        ]);
      }

      return options.field.name.split('.').pop() || options.field.name;
    },
  },
  filter: {
    labelWriter: (options) => {
      const pkg = getValidSchemaPackage(options.fieldEnum);
      const schemaI18nTranslationPath = defaultTranslationPathOrGetter(options.fieldEnum);
      const keyName = options.fieldEnum.generatedValueNames?.get(options.field.name);

      if (pkg && schemaI18nTranslationPath && keyName) {
        const i18nNamespace = camelCase(getPackageFileName(pkg));

        options.file.addManualImport(
          getImportPath(TRANSLATION_DIRECTORY, 'index.ts', options.file.config.directory, options.file.config.fileName),
          [I18N_T_FUNCTION_TYPE_NAME],
          [I18N_T_FUNCTION_TYPE_NAME],
        );
        options.file.addGeneratedTypeImport(options.fieldEnum.generatedName);
        options.injectDependency(T_FUNCTION_NAME, I18N_T_FUNCTION_TYPE_NAME);

        return factory.createCallExpression(factory.createIdentifier(T_FUNCTION_NAME), undefined, [
          factory.createTemplateExpression(factory.createTemplateHead(`${i18nNamespace}:enum.${options.fieldEnum.generatedName}.`), [
            factory.createTemplateSpan(
              factory.createPropertyAccessExpression(factory.createIdentifier(options.fieldEnum.generatedName), keyName),
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
            const i18nNamespace = camelCase(getPackageFileName(pkg));

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
