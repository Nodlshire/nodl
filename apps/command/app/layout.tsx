import React from 'react';
import { CanonicalShell } from '@wnode/ui-core';
import AuthGuard from './components/AuthGuard';
import { PageTitleProvider } from './components/PageTitleContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ProvidersWrapper = ({ children: providerChildren }: { children: React.ReactNode }) => (
    <AuthGuard>
      <PageTitleProvider>
        {providerChildren}
      </PageTitleProvider>
    </AuthGuard>
  );

  return (
    <html lang="en">
      <body data-portal="command">
        <CanonicalShell providers={ProvidersWrapper}>
          {children}
        </CanonicalShell>
      </body>
    </html>
  );
}
