# SDK API Reference

This API reference defines the canonical, deterministic interfaces exposed by the Wnode SDK.  
All classes, functions, types, and constants follow sovereign compute rules:
- no hidden defaults  
- no inference  
- no randomness  
- no nondeterministic behavior  
- no state retention  

The SDK is a pure metadata engine.

---

## Classes

### `WnodeClient`
Primary interface for interacting with the Steward and mesh.

**Constructor**
- `endpoint: string` — explicit Wnode endpoint  
- `timeout?: number` — deterministic timeout  
- `headers?: Record<string,string>` — explicit headers only  

**Methods**
- `health(): Promise<HealthStatus>`  
- `submit(job: Job): Promise<JobReceipt>`  
- `status(jobId: string): Promise<JobStatus>`  

No retries.  
No fallback endpoints.  
No dynamic behavior.

---

### `JobBuilder`
Deterministic builder for constructing immutable job objects.

**Methods**
- `setWuid(wuid: string)`  
- `setEngineType(type: EngineType)`  
- `setDeliveryMode(mode: DeliveryMode)`  
- `setRoutingHints(hints: RoutingHints)`  
- `setShardConfig(config: ShardConfig)`  
- `setPrivacyMode(mode: PrivacyMode)`  
- `setVerificationMode(mode: VerificationMode)`  
- `build(): Job`  

All fields must be explicitly set.  
No defaults.  
No inference.

---

## Interfaces

### `Job`
Immutable, deterministic job definition.

Fields:
- `jobId: string`  
- `wuid: string`  
- `engineType: EngineType`  
- `deliveryMode: DeliveryMode`  
- `routingHints: RoutingHints`  
- `shardConfig: ShardConfig`  
- `privacyMode: PrivacyMode`  
- `verificationMode: VerificationMode`  

### `RoutingHints`
- `region: string`  
- `deviceClass: string`  
- `latencyPreference: "low" | "balanced" | "throughput"`  

### `ShardConfig`
- `count: number`  
- `strategy: "deterministic"`  

### `JobReceipt`
- `jobId: string`  
- `submittedAt: string`  
- `status: "accepted" | "rejected"`  

### `JobStatus`
- `jobId: string`  
- `state: "pending" | "running" | "complete" | "failed"`  
- `result?: any`  

---

## Functions

### `createJob(metadata: JobMetadata): Job`
Creates a deterministic job from explicit metadata.

### `validateJob(job: Job): ValidationResult`
Ensures job metadata is complete, deterministic, and reproducible.

### `hashJob(job: Job): string`
Produces deterministic jobId from metadata.

### `deriveShardPlan(job: Job): ShardPlan`
Computes deterministic shard boundaries.

### `deriveRoutingPlan(job: Job): RoutingPlan`
Computes deterministic routing path.

All functions are:
- pure  
- deterministic  
- replayable  

---

## Types

### `EngineType`
- `"compute"`  
- `"wasm"`  
- `"evm"`  
- `"ai"`  

### `DeliveryMode`
- `"inline"`  
- `"stream"`  
- `"chunked"`  
- `"zero-payload"`  

### `PrivacyMode`
- `"transparent"`  
- `"sealed"`  
- `"sealed-ephemeral"`  
- `"sealed-zero-retention"`  

### `VerificationMode`
- `"deterministic-replay"`  
- `"multi-node-consensus"`  
- `"cryptographic-proof"`  

---

## Constants

### `DEFAULT_TIMEOUT`
Deterministic timeout used only when explicitly set by the developer.

### `SUPPORTED_ENGINES`
List of engines supported by the mesh.

### `SUPPORTED_REGIONS`
List of deterministic region identifiers.

### `SDK_VERSION`
Canonical version string for reproducibility.

Constants are:
- immutable  
- deterministic  
- environment-independent  

---
