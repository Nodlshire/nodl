# Native Execution Engine

The Native Execution Engine handles pre-compiled, built-in functions designed for immediate, high-performance execution without the overhead of sandboxing.

## 1. Native Task Runner

The native runner (`workload.nativeExecutor`) evaluates the `action` specified in the task payload. These actions are hardcoded into the binary of the operator node, ensuring they represent trusted, foundational functions of the network.

Supported native actions typically include:
- `echo`: Returns the input payload back to the router (used for network latency tests and diagnostics).
- `uppercase`: A basic string manipulation function.
- `hash_sha256`: A compute-intensive operation natively executed by the Go standard library for cryptographic hashing.

## 2. Native Shard Execution

When a job is sharded natively, the `TaskRequestPayload` is passed directly to the corresponding Go function. 
Since these are native Go calls:
- There is no compilation delay.
- Memory allocation is highly efficient and managed entirely by the Go garbage collector.
- The execution happens synchronously, blocking the specific worker goroutine but generating results significantly faster than the WASM engine.

## 3. Performance Metrics

Because native execution does not carry sandbox overhead, the time-to-completion is used as a baseline for the node's performance metrics:
- `execution_time_ms` is strictly calculated around the native function call.
- Extremely fast native execution times contribute positively to the node's rolling `IoScore` and `CpuScore`, maintaining tier stability.
- Native tasks yield fewer Work Units (e.g., 1-2 WU) compared to WASM, but they can be executed at a much higher frequency.

## 4. Error Handling

- **Invalid Actions**: If a native task specifies an unrecognized action, the engine immediately aborts and returns an `Unsupported Action` error status.
- **Panic Recovery**: Each native execution is wrapped in a `defer recover()` block. If a poorly formatted payload causes a native library to panic (e.g., a nil pointer dereference during string parsing), the node catches the panic, constructs an error message, and returns a failed `TaskResultPayload` rather than crashing the entire operator binary.
