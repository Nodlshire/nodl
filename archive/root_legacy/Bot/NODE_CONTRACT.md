# Node Contract

This document defines the invariant behavior, responsibilities, and prohibitions of a node within the wnode network. It serves as a precise technical and operational specification that ensures the network's privacy, safety, and security guarantees are upheld across all execution engines.

---

## 1. Introduction

A **node** is a participant in the wnode mesh that provides computational capacity to execute jobs. The **Node Contract** is the engine-agnostic protocol that defines how any node must behave, regardless of its underlying execution environment.

This contract applies equally to:
- **WASM Nodes**: Lightweight nodes running in-browser or via server-side WASM runtimes.
- **Native/Downloadable App Nodes**: "Fat nodes" that leverage native OS capabilities, GPUs, or dedicated hardware.
- **Future Engines**: Any future execution environment integrated into the mesh.

The protocol and security guarantees are independent of the specific hardware or software engine used to run the compute.

---

## 2. Node Responsibilities (MUST)

To maintain the integrity of the network, a node **MUST**:

- **Accept Jobs via Streaming**: Receive job data using a chunked streaming protocol from the backend.
- **Handle Ephemeral Encryption**: Receive job input as encrypted chunks using keys that are unique and ephemeral to each specific job.
- **Decrypt in RAM Only**: Perform all decryption operations exclusively in volatile memory (RAM).
- **Incremental Processing**: Reassemble or incrementally feed decrypted data into the execution engine as it arrives.
- **RAM-Only Execution**: Execute the job entirely in RAM. No job-related data, intermediate states, or results may be written to physical disk.
- **Stream Results**: Send results back to the backend using the same streaming pattern (optionally chunked and encrypted).
- **Mandatory Buffer Wipe**: Securely wipe all job-related buffers, keys, and memory segments immediately upon job completion or termination.
- **Mesh Client ID Integrity**: Respect and authenticate using its assigned, immutable Mesh Client ID.
- **Zero-Storage Compliance**: Strictly adhere to zero-retention and zero-storage guarantees for all routed data.

---

## 3. Node Prohibitions (MUST NOT)

A node **MUST NOT**:

- **Write to Disk**: Under no circumstances write job payloads, raw input, or execution results to persistent storage.
- **Persist Data**: Store any job-related information beyond the active lifetime of the compute task.
- **Expose Decrypted Payloads**: Allow any external process or unauthorized memory access to inspect decrypted job data.
- **Bypass Protocol**: Attempt to bypass encryption, streaming, or authentication protocols.
- **Spoof Identity**: Attempt to spoof, reuse, or manipulate Mesh Client IDs or hardware signatures.

---

## 4. Execution Engine Abstraction

The node runtime is a modular architecture where the **Runtime** handles the "outer" protocol and the **Execution Engine** handles the "inner" compute.

### The Runtime Layer
Responsible for:
- Transport and connectivity (libp2p, WebRTC, etc.).
- Streaming protocol management.
- Ephemeral decryption.
- Buffer management and lifecycle control.

### The Execution Engine Layer
The engine is a pluggable component. The Node Contract does not assume a specific format (e.g., "job = WASM module"). Instead:
- The node receives a payload and metadata (e.g., `engine_type`, `content_type`).
- The runtime selects the appropriate engine (WASM runtime, native executor, etc.) to process the payload.
- The engine must operate within the memory boundaries managed by the runtime.

---

## 5. Security Guarantees

The Node Contract enforces the following security guarantees:

- **Zero Storage**: Data exists only in motion or in volatile memory.
- **RAM-Only Execution**: No forensic trace is left on the node's physical storage.
- **Ephemeral Keys**: Compromise of one job's keys does not compromise past or future jobs.
- **No Long-Term Retention**: The node is a stateless compute worker.
- **Steward Isolation**: The steward/backend routes encrypted data but cannot access or decrypt the underlying job content.
- **Job Isolation**: Each job must be isolated such that it cannot access the memory of other jobs or the host system.

---

## 6. Compatibility with the Downloadable App

The wnode downloadable application is a "fat node" that implements this same Node Contract but provides a more powerful execution engine (e.g., GPU support, higher RAM limits). 

Despite its increased capabilities, the app:
- **MUST** implement the same streaming and decryption protocols.
- **MUST** execute in RAM and avoid disk writes for compute data.
- **MUST** wipe all buffers and keys upon completion.

The security model for a background app is identical to that of a browser-based node.

---

## 7. Summary

The **Node Contract** is the combination of the network protocol and the security guarantees that bind every node in the mesh. By abstracting the execution engine behind this contract, wnode ensures that the network remains flexible, scalable, and fundamentally private, regardless of how or where the compute is performed.

This document is the authoritative source of truth for node behavior within the wnode ecosystem.
