import React from 'react';
const CanonicalShell = ({ providers: Providers, children }: any) => {
  const content = (
    <div className="min-h-screen bg-background text-foreground">
      <main>{children}</main>
    </div>
  );
  return Providers ? <Providers>{content}</Providers> : content;
};
export default CanonicalShell;
