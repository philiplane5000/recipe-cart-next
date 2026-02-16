'use client';

import { ReactNode } from 'react';
import { I18nProvider } from 'react-aria-components';

export function ClientProviders({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  return <I18nProvider locale={lang}>{children}</I18nProvider>;
}
