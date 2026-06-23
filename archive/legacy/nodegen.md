# Nodegen: Node Operator Job Generator

`nodegen` is a deterministic code generator that translates a high-level `SpecNodeJob` configuration into native Go execution handlers for the Node Operator daemon.

## Architecture

`nodegen` reads from an integration's `spec.yaml` and targets the `node_job` configuration inside the `job_template`. It generates three primary components under `nodld/internal/node/jobs/generated/<integration_id>/`:

1. **`*_handler.go`**: Defines the `Execute(ctx, payload)` interface. It prepares the execution context based on `execution_type` (native, script, container), validates envelopes, and emits telemetry.
2. **`*_resources.go`**: Generates a struct strictly bounding the job's CPU, RAM, and GPU requirements to protect the node's host OS.
3. **`*_telemetry.go`**: Provides structured `stdout`/`stderr` capturing and emission functions.

## Execution Contexts

Nodegen supports three distinct execution isolation modes:
- **`native` (Default)**: Direct execution of WASM binaries using `wazero`. Zero host IO access.
- **`script`**: Execution of pre-approved bash/python scripts in a restricted chroot.
- **`container`**: Spawning a short-lived Docker container for the workload.

## Overrides & Non-Destructive Behavior

Generated handlers are designed to be entirely disposable. They will be overwritten on every execution of `nodegen`.
If a custom handler implementation is required, engineers must write it in `nodld/internal/node/jobs/manual/<integration_id>/`.
`nodegen` actively checks the `manual/` directory. If it detects a manual override (e.g., `manual/stripe_handler.go`), it will emit a CLI warning and the `nodld` routing registry will prioritize the manual handler.
