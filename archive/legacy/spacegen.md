# Spacegen: Distributed Engine Job Generator

`spacegen` is a deterministic CLI tool designed to translate a high-level `SpecSpaceJob` from `spec.yaml` into fully functional Orchestrator logic for the Distributed Sharding Engine.

## Architecture

`spacegen` targets the `space_job` parameter of an integration's `spec.yaml`. It generates complex orchestrator topologies under `nodld/internal/space/jobs/generated/<integration_id>/`:

1. **`*_shard.go`**: Generates `ShardInput([]byte) ([][]byte, error)` defining how a single massive payload is deterministically chunked.
2. **`*_reduce.go`**: Generates `ReduceResults([][]byte) ([]byte, error)` defining how partial shard proofs from disparate nodes are mathematically merged.
3. **`*_orchestrator.go`**: Generates the state machine governing node assignment, retry handling, and fault tolerance.

## Sharding Strategies

If omitted from `spec.yaml`, `spacegen` defaults to:
- **Strategy**: `range`
- **Shard Size**: `8`
- **Max Shards**: `64`

Available Strategies:
- **`range`**: Divides datasets sequentially by index offsets.
- **`hash`**: Distributes workloads based on consistent hashing of input keys.
- **`list`**: Distributes explicitly defined arrays of tasks to nodes 1:1.

## Reduce & Fault Tolerance Patterns

- **Reduce**: Supports `concat` (append bytes) or `sum` (math addition).
- **Fault Tolerance**: Defines consensus strictness (e.g., `min_success=2/3` requires 66% quorum among executed shards before reduction).

## Manual Overrides

Spacegen output is safe to overwrite. Advanced map-reduce topologies must be hand-authored inside `nodld/internal/space/jobs/manual/<integration_id>/`. `spacegen` will warn if it detects manual logic shadowing the generated orchestrator.
