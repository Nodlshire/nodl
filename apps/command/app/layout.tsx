import React from 'react';
import { CanonicalShell } from '@wnode/ui-core';
import AuthGuard from './components/AuthGuard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const providers = (
    <AuthGuard>
      {/* additional providers if needed */}
    </AuthGuard>
  );

  return (
    <html lang="en">
      <body data-portal="command">
        <CanonicalShell providers={providers}>
          {children}
        </CanonicalShell>
      </body>
    </html>
  );
}
