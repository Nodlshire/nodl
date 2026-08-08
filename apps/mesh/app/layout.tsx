import React from 'react';
import { CanonicalShell } from '@wnode/ui-core';
import { AuthProvider } from './components/AuthProvider';
import { BillingProvider } from './components/BillingProvider';
import { JobsProvider } from './components/JobsProvider';

import { BasketProvider } from './components/BasketContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ProvidersWrapper = ({ children: providerChildren }: { children: React.ReactNode }) => (
    <AuthProvider>
      <BillingProvider>
        <JobsProvider>
          <BasketProvider>
            {providerChildren}
          </BasketProvider>
        </JobsProvider>
      </BillingProvider>
    </AuthProvider>
  );

  return (
    <html lang="en">
      <body data-portal="mesh">
        <CanonicalShell providers={ProvidersWrapper}>
          {children}
        </CanonicalShell>
      </body>
    </html>
  );
}
