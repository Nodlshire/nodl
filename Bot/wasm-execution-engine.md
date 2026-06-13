# WASM Execution Engine

The WebAssembly (WASM) execution engine provides a highly secure, zero-trust sandbox environment for running untrusted third-party code submitted by clients.

## 1. WASM Sandbox

The engine relies on `wazero`, a pure Go implementation of WebAssembly. This ensures that operators do not require native C bindings or external dependencies (like Docker) to safely run workloads. The sandbox achieves isolation by:
- Detaching the WASM binary from the host's memory map.
- Strictly controlling imports. The engine only exposes necessary I/O bindings (like standard output and standard error) and blocks access to the host file system, network, and environment variables.

## 2. WASM Execution Pipeline

The execution of a WASM job follows a linear, encapsulated pipeline (`workload.wasmExecutor`):

1. **Instantiation**: The WASM binary payload (typically passed as base64 or a direct binary buffer within the `TaskRequestPayload`) is compiled into the `wazero` runtime environment.
2. **Configuration**: Memory limits, execution timeouts, and input arguments are injected into the runtime configuration.
3. **Execution**: The runtime invokes the exported `_start` (or designated main) function of the WASM module.
4. **Capture**: Standard output and error streams are buffered securely in memory.
5. **Teardown**: The module is immediately closed, and memory is garbage collected to prevent leaks.

## 3. Resource Limits

To protect operator hardware from abusive loops or memory exhaustion attacks, strict limits are enforced during execution:
- **Timeouts**: Every execution is wrapped in a `context.WithTimeout`. If the WASM execution exceeds the allotted limit (e.g., 5 seconds), it is forcefully terminated.
- **Memory Caps**: The WASM memory pages are strictly bound. The runtime prevents the WASM module from dynamically growing memory beyond a predefined safe threshold.

## 4. Error Handling

- **Compilation Errors**: If the binary is malformed or incompatible, the engine traps the error before execution begins. The task is marked as `failed`, and the exact compilation error is returned.
- **Runtime Traps**: Illegal operations (e.g., division by zero, out-of-bounds memory access) trigger a WASM trap. The `wazero` engine catches this, halting execution without crashing the host process.
- **Timeouts**: Triggers a `context deadline exceeded` error, logged as a timeout failure.
- In all failure modes, the operator's `TaskResultPayload` returns the exact `ErrorMessage` but still protects the operator's core reputation from drastic penalties, provided the failure was due to the payload and not the node.

## 5. WASM vs Native Earnings Split

WASM workloads inherently command a higher base value due to the overhead of sandboxing and the complexity of generalized computation.
- While Native actions (like `echo` or `hash_sha256`) yield 1-2 Work Units (WU), a standard `wasm_execute` action yields a baseline of 5 WU.
- Because WASM execution allows arbitrary user code, the platform charges customers a premium, which translates directly into higher aggregate WU generation for operators supporting WASM capabilities.

## 6. WASM Security Model

The security model rests entirely on **Zero Trust**:
- The operator never trusts the CMD.
- The CMD never trusts the operator.
- The WASM payload runs inside a memory-isolated VM that has no native syscall capabilities.
- Even if a malicious WASM binary attempts to execute a buffer overflow, it can only corrupt the internal WASM linear memory layout, rendering the host machine completely safe.
