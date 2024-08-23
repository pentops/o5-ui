import React, { Suspense } from 'react';
import { TOptions } from 'i18next';
import { Trans } from 'react-i18next';
import { useTranslation } from '../../translation';

interface TranslatedTextProps {
  children?: React.ReactNode;
  i18nKey: string;
  variables?: TOptions;
}

const useTranslationProps = ({ children, i18nKey, variables, ...rest }: TranslatedTextProps) => {
  const namespace = i18nKey.split(':')[0];
  const { t } = useTranslation(namespace);

  return {
    ...rest,
    'data-i18n-key': i18nKey,
    'children': children ? (
      <Trans t={t} i18nKey={i18nKey} values={variables}>
        {children}
      </Trans>
    ) : (
      t(i18nKey, variables || {})
    ),
  };
};

function TextInner(props: TranslatedTextProps) {
  const tProps = useTranslationProps(props);

  return <span {...tProps} />;
}

export function TranslatedText(props: TranslatedTextProps) {
  return (
    <Suspense fallback={null}>
      <TextInner {...props} />
    </Suspense>
  );
}
