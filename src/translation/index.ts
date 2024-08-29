/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: I18nPlugin) - do not edit */

import i18n, { type TFunction } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import enAwsDeployerNs from './translations/en/aws-deployer.json';
import enDanteNs from './translations/en/dante.json';
import enJ5Ns from './translations/en/j5.json';
import enO5Ns from './translations/en/o5.json';
import enPsmNs from './translations/en/psm.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      dante: enDanteNs,
      j5: enJ5Ns,
      o5: enO5Ns,
      awsDeployer: enAwsDeployerNs,
      psm: enPsmNs,
    },
  },
});

export { i18n, type TFunction, useTranslation };
