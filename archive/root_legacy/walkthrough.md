# RAM-Only Compute Job Pipeline

This document outlines the implementation of the secure, diskless, RAM-only pipeline for compute job submissions and delivery within the Mesh network.

## Core Architectural Invariants
1. **Zero-Persistence**: Compute job payloads are never written to disk (no temp files, no DB blobs, no object storage).
2. **Encrypted In-Memory Storage**: Payloads are stored in heap memory as XOR-encrypted byte arrays, protecting against plain-text memory dumps.
3. **Shortest Possible Lifespan**: Payloads exist only until consumption or TTL expiry.
4. **Runtime Agnostic**: While currently utilizing WASM for execution, the pipeline is designed to handle any compute job bundle (code + config + optional data).

## Key Components

### 1. Buffer Manager (`internal/buffer`)
The `BufferManager` is the heart of the zero-persistence mandate.
- **XOR Encryption**: Every compute job payload is XOR-encrypted upon entry with a unique, cryptographically random key.
- **TTL Reaper**: An automated background process wipes and removes any bundle exceeding its 5-minute time-to-live.
- **Strict Memory Limits**: Enforces a 50MB per-job limit and a 512MB global buffer limit to protect the daemon's stability.
- **Explicit Wiping**: Uses a `cleanup` function pattern to ensure bytes are zeroed out immediately after a compute node fetches the bundle.

### 2. API Pipeline (`internal/api`)
The API server facilitates the real-time movement of bundles from the Mesh Portal to assigned nodes.
- **POST /api/v1/jobs**: Accepts multipart job uploads. Moves the payload directly into the RAM buffer and returns only the job metadata.
- **GET /api/v1/jobs/:id/payload**: Streams the job bundle directly from RAM to the assigned node. Triggering this endpoint also advances the job status to `Assigned`.
- **Buffer Observability**: `/api/v1/buffer/stats` allows system administrators to monitor memory usage without exposing payload content.

### 3. Mesh Portal Integration
The Mesh dashboard (3003) is now fully integrated with the live API.
- **Job Wizard**: Replaced mock logic with actual multipart job uploads to the RAM-only buffer.
- **Jobs Provider**: Real-time polling of the backend for job status ('Pending' -> 'Assigned' -> 'Completed').
- **Unified Naming**: Updated all UI labels and helper text to refer to "Compute Job Bundles", reflecting the platform's runtime-agnostic future.

## Verification
- **Unit Tests**: Validated that `Store`, `Stream`, and `Wipe` operations correctly manage memory and zero out sensitive bytes.
- **Diskless Assertion**: Build-time analysis and runtime tests confirm no file-system syscalls are made for compute job payloads.
- **Frontend Validation**: Verified that the portal correctly handles job submission and reflects backend state changes.

---
*Note: This architecture ensures that even in the event of a system compromise, no persistent copy of user-submitted compute code exists on the Nodl Mesh infrastructure.*
