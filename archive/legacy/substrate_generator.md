# Wnode Substrate Generation Pipeline

The Wnode network replaces handcrafted integration files with a unified, deterministic substrate generation pipeline. This guarantees that all 616 integrations are cryptographically secure, fully observable, and natively wired into both the Edge Node execution sandbox and the Distributed Engine orchestrator.

## Unified Substrate Architecture

The pipeline consists of three sequential generators driving a single `spec.yaml` into executable Go code:

1. **`intgen` (Integration Generator)**: Translates high-level YAML into the `integration.json` schema, emitting strict security boundaries (HMAC, Size Limits), RPC routing rules, and TypeScript SDK scaffolding.
2. **`nodegen` (Node Operator Job Generator)**: Translates `spec.node_job` into `wazero` native WASM execution handlers, strict hardware resource bounds (CPU/RAM limits), and structured telemetry loggers under `nodld/internal/node/`.
3. **`spacegen` (Distributed Engine Job Generator)**: Translates `spec.space_job` into Map-Reduce topologies under `nodld/internal/space/`, emitting exact sharding logic, quorum rules, and fault tolerance thresholds.

## End-to-End Pipeline Trace: Aave Liquidations

To demonstrate the deterministic pipeline, trace an "Aave Liquidator" integration from YAML to execution.

### 1. The Specification (`integrations/aave/spec.yaml`)
```yaml
id: "aave"
name: "Aave V3 Liquidator"
slug: "aave"
job_template:
  action: "aave_liquidate"
  node_job:
    job_name: "aave_liquidate"
    required_resources:
      CPU: "2.0"
      RAM: "4GB"
    execution_type: "native"
  space_job:
    sharding_strategy: "list"
    max_shards: 128
    reduce_strategy: "concat"
    fault_tolerance: "min_success=1/2"
```

### 2. Execution of `intgen`
```bash
go run nodld/cmd/intgen/main.go -f integrations/aave/spec.yaml
```
**Output**: 
- Validated `integrations/aave/integration.json`
- Deterministic WASM stub `integrations/aave/wasm/aave.wasm.stub`
- Typescript Client `integrations/aave/sdk/generated/sdk.ts`

### 3. Execution of `nodegen`
```bash
go run nodld/cmd/nodegen/main.go -f integrations/aave/spec.yaml
```
**Output**: 
- `nodld/internal/node/jobs/generated/aave/aave_liquidate_handler.go`: Binds to `wazero` sandbox.
- `nodld/internal/node/jobs/generated/aave/aave_liquidate_resources.go`: Caps execution strictly to 4GB RAM.

### 4. Execution of `spacegen`
```bash
go run nodld/cmd/spacegen/main.go -f integrations/aave/spec.yaml
```
**Output**: 
- `nodld/internal/space/jobs/generated/aave/aave_liquidate_shard.go`: Exposes logic to chunk liquidation requests.
- `nodld/internal/space/jobs/generated/aave/aave_liquidate_orchestrator.go`: Constructs state machine requiring 50% node quorum before final execution.

## Non-Destructive Invariants
All generators emit to `generated/` directories with `// AUTO-GENERATED` banners. Engineers authoring complex overrides write exclusively to `manual/` paths. If `spacegen` or `nodegen` detect manual shadowing, they safely bypass overwriting execution topologies while surfacing CLI warnings.
