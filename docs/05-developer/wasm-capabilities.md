# RAM-Native Capabilities Specification

Wnode supports native Go micro-services as well as WASI-compliant WebAssembly binaries executed directly inside `tmpfs` RAM namespaces.
* **Deterministic Memory Allocator**: Fixed 64KB memory pages.
* **No File System Access**: Restricted to ephemeral `/tmp` RAM mount.
