import { match, P } from 'ts-pattern';
import { I18NEXT_IMPORT_PATH, I18nPlugin } from '@pentops/j5-ts-generator-i18n-plugin';
import {
  CASE_OVERRIDES,
  getPackageFileName,
  getValidSchemaPackage,
  I18N_T_FUNCTION_TYPE_NAME,
  titleCaseName,
  TRANSLATION_DIRECTORY,
} from './shared.js';

const REACT_I18NEXT_IMPORT_PATH = 'react-i18next';
const REACT_I18NEXT_MIDDLEWARE_NAME = 'initReactI18next';
const REACT_I18NEXT_USE_TRANSLATION_HOOK_NAME = 'useTranslation';

const i18nTranslationWriter = (schema, schemaPath) =>
  match(schema)
    .with({ rawSchema: { oneOf: P.not(P.nullish) } }, (s) =>
      Array.from(s.rawSchema.oneOf.properties.values()).map((property) => ({
        key: `${schemaPath}.${property.name}`,
        value: titleCaseName(property.name, CASE_OVERRIDES),
      })),
    )
    .with({ rawSchema: { enum: P.not(P.nullish) } }, (s) =>
      s.rawSchema.enum.options.map((value) => ({
        key: `${schemaPath}.${value.name}`,
        value: titleCaseName(value.name, CASE_OVERRIDES),
      })),
    )
    .otherwise(() => undefined);

export const i18nPlugin = new I18nPlugin({
  indexFile: {
    preWriteHook: (file) => {
      file.addManualImport(I18NEXT_IMPORT_PATH, [I18N_T_FUNCTION_TYPE_NAME], [I18N_T_FUNCTION_TYPE_NAME]);
      file.addManualImport(REACT_I18NEXT_IMPORT_PATH, [REACT_I18NEXT_USE_TRANSLATION_HOOK_NAME]);

      file.addManualExport(undefined, {
        namedExports: [I18N_T_FUNCTION_TYPE_NAME, REACT_I18NEXT_USE_TRANSLATION_HOOK_NAME],
        typeOnlyExports: [I18N_T_FUNCTION_TYPE_NAME],
      });
    },
    directory: TRANSLATION_DIRECTORY,
    fileName: 'index.ts',
    middleware: [{ importSpecifier: REACT_I18NEXT_MIDDLEWARE_NAME, importPath: REACT_I18NEXT_IMPORT_PATH }],
    addGeneratedResources: true,
    initOptions: {
      lng: 'en', // remove if multiple locales are supported at some point
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    },
  },
  files: (generatedSchemas) => {
    const directory = `${TRANSLATION_DIRECTORY}/translations/en`;
    const files = new Map();

    function getFilterFunction(fullGrpcPackageName) {
      return (s) => getValidSchemaPackage(s)?.package === fullGrpcPackageName;
    }

    for (const [, generatedSchema] of generatedSchemas) {
      const pkg = getValidSchemaPackage(generatedSchema);

      if (pkg) {
        const jsonName = getPackageFileName(pkg);

        if (!files.has(jsonName)) {
          files.set(jsonName, {
            directory,
            language: 'en',
            fileName: `${jsonName}.json`,
            translationWriter: i18nTranslationWriter,
            schemaFilter: getFilterFunction(pkg.package),
          });
        }
      }
    }

    return Array.from(files.values());
  },
});
