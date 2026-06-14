# Ticket: Fix production chunk resolution for Nodlr (`@swc/helpers` missing vendor chunks)

## Description
Production server fails at runtime with missing vendored chunks after `pnpm build` succeeds.
Example errors from `nodlr_prod.log`:
```text
⨯ [Error: Cannot find module './vendor-chunks/@swc+helpers@0.5.15.js']
⨯ [Error: Cannot find module './305.js']
```
* **Affected File**: `.next/server/webpack-runtime.js` (runtime resolution of vendor chunks).
* **Environment**: Nodlshire monorepo, Next.js 15.1.0, pnpm v10.
* **Status**: Development mode is stable; production mode is blocked by this resolution issue.

## Likely Causes
1. **Next.js 15 Output Tracing + pnpm**: Interference between Next.js internal tracing and the pnpm workspace symlink layout.
2. **Config Misconfiguration**: `outputFileTracingRoot` or `experimental/esmExternals` might need adjustment for cross-workspace vendor chunks.
3. **Hoisting Behavior**: pnpm hoisting/dedupe behavior during the build step might be placing chunks in locations that the runtime bundler expects to be local.

## Steps to Investigate
1. **Local Repro**: Run `pnpm build && pnpm start` in `apps/nodlr`. Capture `.next/server` directory tree and compare with chunk references in `webpack-runtime.js`.
2. **Config Audit**: Inspect `apps/nodlr/next.config.mjs` for `outputFileTracingRoot` or `webpack` overrides.
3. **Path Adjustment**: Test setting `outputFileTracingRoot: path.join(__dirname, '../../')` in `next.config.mjs`.
4. **Symlink Test**: Run a build with `pnpm install --shamefully-hoist` to see if flat `node_modules` resolves the chunk paths.
5. **Stopgap**: If needed, implement a `postbuild` script to manually copy vendor chunks into the expected `.next/server/vendor-chunks/` directory.

## Acceptance Criteria
- `pnpm start` serves the production build without `Cannot find module` errors.
- UI loads successfully and all static assets resolve on port 3002.

**Priority**: High (Blocks production testing/deployment)
**Assignee**: Build/DevOps / Senior Dev
