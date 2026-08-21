# Environment Variables

This document catalogs the critical environment variables required to run the Wnode Mesh, configure the execution bounds of operator nodes, and connect the internal Go backend to external platforms (CMD / Stripe).

## Security Notice

Environment configurations must never be committed to source control. Local development overrides should be stored safely within a `.env` file that is ignored by Git.

## Stripe Integrations (Payouts & Billing)

Required for the Payout Engine (`core/payouts`) to instantiate and create Connect accounts or issue transfers.

- `STRIPE_SECRET_KEY`: The primary secret key provided by Stripe. Must begin with `sk_test_` during development or `sk_live_` in production.
- `STRIPE_WEBHOOK_SECRET`: (Optional) The cryptographic signing secret used to verify incoming webhook payloads regarding operator KYC status changes.

## Mesh Configuration

Controls the binding and authorization properties of the WebSocket router.

- `MESH_PORT`: Determines the TCP port that the WebSocket server will listen on. (e.g., `8080`)
- `MESH_DEBUG_PORT`: The local HTTP port dedicated strictly to `GET /debug/*` endpoints. Defaults to `3037`.
- `MESH_AUTHORIZATION_KEY`: (Optional) A shared secret payload that operator nodes must pass during the initial `announce` handshake to prevent rogue hardware from saturating the registry.

## CRM Configuration

Authorizes the `CRMClient` (`core/crmsync`) to securely push data payloads backwards into the Next.js portal.

- `CRM_BASE_URL`: The fully qualified domain name or IP of the CMD interface. (e.g., `http://localhost:4000` or `https://cmd.wnode.one`)
- `CRM_API_KEY`: A shared Bearer token used explicitly by the Mesh to authorize updates to the `/api/operators` and `/api/customers` endpoints without user session cookies.

## Subsystem Thresholds (Time & Limits)

These variables tune the behavior of the internal subsystems. If unset, the backend falls back to strictly enforced hardcoded defaults.

- `WASM_MEMORY_LIMIT_MB`: Constrains the linear memory space allocated per `wazero` instance. (Default: `128`)
- `WASM_TIMEOUT_MS`: Context deadline enforcing execution bounds for untrusted binaries. (Default: `5000`)
- `CRM_SYNC_INTERVAL_MINS`: Modifies the ticker loop dictating how frequently billing and operator aggregates are pushed to the CMD. (Default: `10`)
- `PAYOUT_INTERVAL_HOURS`: Overrides the daily payout cycle, useful for testing transfers. (Default: `24`)

## Pricing Configuration

- `PRICING_MATRIX_URL`: Optional remote URL used by the `StartPricingRefresher` background job. If defined, the Mesh will periodically fetch a JSON payload overriding the internal pricing constants (e.g., USD base rates for Tiny, Standard, Ultra tiers).
