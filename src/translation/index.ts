/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: I18nPlugin) - do not edit */

import i18n, { type TFunction } from 'i18next';
import enDanteNs from './translations/en/dante.json';
import enO5Ns from './translations/en/o5.json';
import enJ5Ns from './translations/en/j5.json';
import enAwsDeployerNs from './translations/en/aws-deployer.json';
import { initReactI18next, useTranslation } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      dante: enDanteNs,
      o5: enO5Ns,
      j5: enJ5Ns,
      awsDeployer: enAwsDeployerNs,
    },
  },
});

export { i18n, type TFunction, useTranslation };
