# Wnode Canonical Integration Pattern

This document describes the canonical specification and generation pattern for all 616 integrations in the Wnode repository.

## The Canonical IntegrationSpec

Integrations are no longer hand-crafted metadata JSON files. They are authored using a high-level YAML specification (`spec.yaml`). This spec defines:
- **Core Identity**: ID, Name, Slug, Category, Version.
- **Security Boundaries**: `require_hmac`, `hmac_secret_env`, and optional IP allowlists.
- **RPC Routing**: The designated backend (`http`, `wss`, `evm`) and strict endpoints.
- **Trigger Logic**: A declarative mapping of inbound webhook events to internal `JobTemplate` actions.

Example `spec.yaml`:
```yaml
id: "stripe"
name: "Stripe Fiat Oracle"
slug: "stripe"
category: "payments"
activation: "active"
version: "1.0.0"
strict_mode: true
security:
  require_hmac: true
  hmac_secret_env: "STRIPE_WEBHOOK_SECRET"
rpc:
  backend: "http"
  endpoints: ["https://api.stripe.com/v1/"]
  timeout_ms: 3000
triggers:
  - event_name: "payment_intent.succeeded"
    action: "settle_fiat"
job_template:
  action: "stripe_settlement_process"
  priority: "high"
  shard_count: 1
  wasm_target: "stripe_settlement.wasm"
```

## Using the `intgen` Code Generator

To enforce strict repository standards, integrations are scaffolded via the `intgen` CLI tool.

### Command
```bash
go run nodld/cmd/intgen/main.go -f integrations/stripe/spec.yaml -o integrations/
```

### Generator Outputs
The generator safely orchestrates the directory structure:
1. **`integration.json`**: The YAML is strictly parsed and down-cast into the JSON format natively cached by `nodld`.
2. **`wasm/<id>.wasm.stub`**: Generates a deterministic `.wasm.stub` binary placeholder.
3. **`sdk/generated/sdk.ts`**: Emits the auto-generated TypeScript mappings. (Manual extensions belong strictly in `sdk/manual/`).

> [!TIP]
> The generator is non-destructive. Re-running it will overwrite `integration.json` and `sdk/generated/` to sync changes, but will skip any existing `wasm` binaries or manual files.

## Trigger to Sandbox Lifecycle

1. **Webhook Intercept**: The inbound payload hits `/integrations/:slug`.
2. **Replay Protection**: The `X-Integration-Nonce` and `X-Integration-Timestamp` are validated against a 30-second clock skew and 5-minute time-bucketed GC cache.
3. **HMAC Signing**: The `SecurityGater` concatenates `Nonce + Timestamp + Payload` and verifies the SHA-256 signature against the target `HMACSecretEnv`.
4. **Trigger Evaluation**: Evaluated within a `200ms` max context boundary (`max 32 triggers`).
5. **RPC Validation**: Resolves the backend (`evm`, `wss`, etc.) from the pluggable `RPCBackendRegistry` and dispatches validation calls.
6. **Execution**: Wraps the envelope into the mapped `JobTemplate` and queues it to the `DistributedEngine`.
