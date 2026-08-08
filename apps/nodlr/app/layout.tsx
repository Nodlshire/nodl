import React from 'react';
import { CanonicalShell } from '@wnode/ui-core';
import { AuthProvider } from './components/AuthProvider';
import { PageTitleProvider } from './components/PageTitleContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const providers = (
    <AuthProvider>
      <PageTitleProvider>
      </PageTitleProvider>
    </AuthProvider>
  );

  return (
    <html lang="en">
      <body data-portal="nodlr">
        <CanonicalShell providers={providers}>
          {children}
        </CanonicalShell>
      </body>
    </html>
  );
}
