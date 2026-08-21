# Job Envelope Specification

This document defines the structure and protocol for a **Job Envelope** within the wnode network. The Job Envelope is a modular, engine-agnostic container designed to transport compute workloads from a client to a node while maintaining strict privacy, security, and zero-storage guarantees.

---

## 1. Introduction

A **Job Envelope** is a structured unit consisting of job-specific metadata and an associated encrypted payload stream. By separating transport concerns (the envelope) from execution concerns (the payload), the wnode network can support a wide variety of execution engines without modifying the core routing or security protocols.

Key characteristics:
- **Engine-Agnostic**: The network routes envelopes without needing to understand the underlying code format.
- **Metadata-Driven**: Nodes use metadata fields to determine which execution engine to initialize.
- **Stream-Centric**: Designed for real-time, chunked delivery to ensure zero-storage compliance.

---

## 2. Job Envelope Fields

The following fields define a canonical Job Envelope:

| Field | Type | Description |
| :--- | :--- | :--- |
| `job_id` | `UUID` | Globally unique identifier for the job. |
| `client_id` | `String` | Mesh Client ID of the account submitting the job. |
| `node_id` | `String` | (Optional at submission, required at dispatch) Mesh Client ID of the node selected for execution. |
| `engine_type` | `String` | The required execution engine (e.g., `wasm`, `native`, `python`, `container`). |
| `content_type` | `String` | The format of the payload (e.g., `application/wasm`, `application/x-binary`, `application/json`). |
| `payload_stream` | `Stream` | An encrypted, chunked stream containing the job's instructions and input data. |
| `metadata` | `Map` | (Optional) Key/value hints for engine-specific configuration (e.g., `ram_limit`, `timeout_ms`). |
| `submitted_at` | `Timestamp` | RFC3339 timestamp of when the job was received by the backend. |
| `expiry` | `Timestamp` | (Optional) Time-to-live after which the job is no longer valid for execution. |

---

## 3. Transport and Streaming

The `payload_stream` is the core data carrier and follows a strict lifecycle to preserve anonymity and security.

### 3.1 Backend Handling
1. **Streaming Reception**: The backend receives the job as a continuous stream from the client.
2. **Chunked Processing**: The backend reads data into small RAM buffers (chunks).
3. **Ephemeral Encryption**: Each chunk is encrypted using an ephemeral XOR key generated specifically for that job.
4. **Immediate Forwarding**: Encrypted chunks are forwarded to the selected node immediately.
5. **Zero Retention**: Chunks are discarded from backend RAM as soon as they are successfully forwarded. The backend never holds a full payload.

### 3.2 Node Handling
1. **Encrypted Buffer**: The node receives encrypted chunks directly into a RAM-only buffer.
2. **On-the-Fly Decryption**: Chunks are decrypted in RAM using the ephemeral job key.
3. **Engine Injection**: Decrypted data is fed into the execution engine either incrementally (piped) or as a buffered whole (depending on engine requirements).

The **Job Envelope** serves as the header that logically links the stream to a specific `job_id` and `client_id`.

---

## 4. Engine-Agnostic Design

The Job Envelope treats the execution engine as a pluggable selector. The protocol does not care whether the payload is a WASM module, a native binary, or a script; it only cares that the `engine_type` and `content_type` are valid and supported by the target node.

This design allows:
- **Scalability**: New engines can be added to the network by simply updating the `engine_type` registry.
- **Flexibility**: The same envelope structure supports both browser-based WASM execution and high-performance native app execution.

---

## 5. Security and Zero-Storage

The Job Envelope reinforces the network's security architecture:
- **No Disk Persistence**: Payloads and results are never written to physical storage at any point in the pipeline.
- **Volatile Buffering**: The backend and node use ephemeral RAM buffers that are wiped immediately after use.
- **Encryption Isolation**: Per-job ephemeral keys ensure that if a node or backend is compromised, past and future job data remains secure.
- **Secret-Free Metadata**: The envelope metadata contains only operational hints, never long-term secrets or private keys.

---

## 6. Compatibility with Current MVP

The current MVP implementation may utilize whole-payload delivery for initial WASM testing. This specification represents the **target model** for the network's evolution. 

Staged migration will involve:
1. Moving from UUID-based whole delivery to chunked streaming.
2. Implementing the ephemeral XOR encryption layer.
3. Enabling multi-engine support via the `engine_type` selector.

---

## 7. Summary

A **Job Envelope** is the combination of structured metadata and a streaming, encrypted payload. By remaining engine-agnostic and focused on RAM-only streaming, it enables wnode to fulfill its promise of being a truly private and decentralized compute fabric for any type of workload.
