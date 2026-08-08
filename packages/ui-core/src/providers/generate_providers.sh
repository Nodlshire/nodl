#!/bin/bash
set -e

# command
cat << 'TS' > CommandAuthGuard.tsx
export { default as CommandAuthGuard } from '../../../../../apps/command/app/components/AuthGuard';
TS

cat << 'TS' > CommandPageTitleProvider.tsx
export { PageTitleProvider as CommandPageTitleProvider } from '../../../../../apps/command/app/components/PageTitleContext';
TS

# mesh
cat << 'TS' > MeshAuthProvider.tsx
export { AuthProvider as MeshAuthProvider } from '../../../../../apps/mesh/app/components/AuthProvider';
TS

cat << 'TS' > MeshBillingProvider.tsx
export { BillingProvider as MeshBillingProvider } from '../../../../../apps/mesh/app/components/BillingProvider';
TS

cat << 'TS' > MeshJobsProvider.tsx
export { JobsProvider as MeshJobsProvider } from '../../../../../apps/mesh/app/components/JobsProvider';
TS

# nodlr
cat << 'TS' > NodlrAuthProvider.tsx
export { AuthProvider as NodlrAuthProvider } from '../../../../../apps/nodlr/app/components/AuthProvider';
TS

cat << 'TS' > NodlrPageTitleProvider.tsx
export { PageTitleProvider as NodlrPageTitleProvider } from '../../../../../apps/nodlr/app/components/PageTitleContext';
TS

echo "export * from './CommandAuthGuard';" > index.ts
echo "export * from './CommandPageTitleProvider';" >> index.ts
echo "export * from './MeshAuthProvider';" >> index.ts
echo "export * from './MeshBillingProvider';" >> index.ts
echo "export * from './MeshJobsProvider';" >> index.ts
echo "export * from './NodlrAuthProvider';" >> index.ts
echo "export * from './NodlrPageTitleProvider';" >> index.ts
