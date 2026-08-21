# RAM-Only Compute Model & Native Execution

## 1. Overview
Wnode bypasses WebAssembly (WASM) interpretation overhead by running workloads natively inside ephemeral RAM namespaces managed by the `nodld` daemon.

## 2. Memory Isolation Architecture
* **Un-swappable `tmpfs`**: Allocated memory segments are pinned in RAM using Linux `mlock()` to prevent swap file leaks.
* **Kernel Isolation**: Linux `cgroups v2` enforce strict memory ceiling limits per job.
* **Syscall Filtering**: `seccomp-bpf` restricts process execution to safe I/O primitives.
* **Zero Persistence**: Memory buffers are zero-wiped (`explicit_bzero`) immediately following SHA-256 result hashing.
