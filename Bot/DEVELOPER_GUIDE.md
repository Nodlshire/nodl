# Developer Guide

This guide provides a concise overview of how to work with the wnode codebase.  
It complements the Contributing Guidelines and the Security Model.

---

## Local Development

### Requirements
- Node.js 20+
- Docker + Docker Compose
- npm 10+

### Install
```
npm ci
npm run dev
```

The dev server runs with hot reload and minimal dependencies.

---

## Building for Production

```
npm run build
```

The build output is used by the multi‑stage Dockerfile to produce a minimal runtime image.

---

## Running with Docker

```
docker compose up -d --no-build --force-recreate wnode
```

The server always pulls prebuilt images; it never builds locally in production.

---

## Testing

### Unit Tests
```
npm test
```

### Smoke Tests
Executed automatically in CI after the Docker image is built.

All tests must pass before a PR can be merged.

---

## Project Structure

- `nodld/` — Go-based backend (Coordinator, Dispatcher, P2P, and Node Worker)
- `apps/mesh/` — Mesh Portal (Next.js) for job submission and node monitoring
  - `app/lib/splitAndSubmit.ts` — Core utility for client-side automated splitting and aggregation.
- `apps/wnoder/` — Operator Dashboard (Next.js) for node management
- `apps/command/` — Governance Portal (Next.js) for system oversight
- `docs/` — Comprehensive documentation for the Sovereign Beta 1.0

---

## Automated Job Splitting

Large jobs (>512KB) are automatically split by the client. Developers working on the Mesh UI should use the `splitAndSubmit` utility:

```typescript
import { splitAndSubmit } from '../lib/splitAndSubmit';

const result = await splitAndSubmit(file, metadata, API_BASE);
```

This utility handles:
- Parallel submission (max concurrency: 2)
- Polling for sub-job completion
- Unified result aggregation

---

## Architectural Principles

- RAM‑only execution  
- Zero storage of job data  
- Streaming‑based compute pipeline  
- Ephemeral encryption  
- Immutable Mesh Client IDs  
- Steward as operator, not owner  

These principles guide all development decisions.

---

## Summary

This guide provides the essentials for contributing code safely and effectively.  
For contribution rules, see `CONTRIBUTING.md`.  
For security architecture, see `Security Model`.  
For vulnerability reporting, see `SECURITY.md`.
