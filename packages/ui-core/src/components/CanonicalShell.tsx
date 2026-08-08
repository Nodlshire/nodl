import React from 'react';
const CanonicalShell = ({ providers, children }: any) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {providers}
      <main>{children}</main>
    </div>
  );
};
export default CanonicalShell;
