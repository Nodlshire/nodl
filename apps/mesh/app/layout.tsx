import React from 'react';
import { CanonicalShell } from '@wnode/ui-core';
import { AuthProvider } from './components/AuthProvider';
import { BillingProvider } from './components/BillingProvider';
import { JobsProvider } from './components/JobsProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const providers = (
    <AuthProvider>
      <BillingProvider>
        <JobsProvider>
        </JobsProvider>
      </BillingProvider>
    </AuthProvider>
  );

  return (
    <html lang="en">
      <body data-portal="mesh">
        <CanonicalShell providers={providers}>
          {children}
        </CanonicalShell>
      </body>
    </html>
  );
}
