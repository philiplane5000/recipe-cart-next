import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { isRTL } from 'react-aria-components';
import { ClientProviders } from './provider';
import { nunitoSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Recipe Cart',
  description:
    'A modern web application that simplifies meal planning by allowing users to curate recipes, dynamically generate shopping lists from their weekly meal selections, and more.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const acceptLanguage = (await headers()).get('accept-language');
  const lang = acceptLanguage?.split(/[,;]/)[0] || 'en-US';
  return (
    <html lang={lang} dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <body className={`${nunitoSans.variable} antialiased`}>
        <ClientProviders lang={lang}>{children}</ClientProviders>
      </body>
    </html>
  );
}
