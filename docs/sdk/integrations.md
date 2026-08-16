# Integration Wrappers


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Integration Wrappers** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



Integration wrappers provide deterministic, chain-agnostic interfaces for interacting with external systems.  
They normalize RPC, REST, GraphQL, gRPC, and WebSocket protocols into a **single deterministic API surface**.

Wrappers must:
- expose identical semantics across protocols  
- eliminate nondeterministic behavior  
- remove protocol quirks  
- enforce strict metadata schemas  
- guarantee reproducible results  

Wrappers do **not** execute jobs.  
They produce deterministic metadata that the mesh and Steward consume.

---

## RPC

RPC wrappers normalize JSON-RPC and custom RPC dialects into deterministic request objects.

RPC wrapper guarantees:
- no dynamic parameter inference  
- no hidden defaults  
- no retry heuristics  
- no fallback endpoints  
- no protocol-specific randomness  

RPC calls become:
- pure  
- declarative  
- reproducible  
- metadata-only  

RPC wrappers support:
- EVM JSON-RPC  
- chain-specific RPC extensions  
- custom protocol RPCs  
- node provider RPCs  

All RPC calls must produce identical metadata across environments.

---

## REST

REST wrappers convert REST endpoints into deterministic request definitions.

REST wrapper guarantees:
- no dynamic query parameter expansion  
- no pagination heuristics  
- no implicit headers  
- no content-type inference  
- no retry logic  

REST calls become:
- explicit  
- fully declared  
- deterministic  
- replayable  

REST wrappers support:
- GET/POST/PUT/DELETE  
- authenticated REST (token provided externally)  
- REST indexers  
- REST explorers  

REST metadata must be identical regardless of environment or timing.

---

## GraphQL

GraphQL wrappers normalize queries and mutations into deterministic GraphQL metadata.

GraphQL wrapper guarantees:
- no dynamic field selection  
- no schema introspection at runtime  
- no auto-generated fragments  
- no heuristic batching  

GraphQL calls become:
- static  
- explicit  
- reproducible  
- fully declared  

GraphQL wrappers support:
- queries  
- mutations  
- subscriptions (converted into deterministic metadata streams)  

GraphQL metadata must be identical across all executions.

---

## gRPC

gRPC wrappers convert protobuf-defined RPCs into deterministic call metadata.

gRPC wrapper guarantees:
- no dynamic message inference  
- no auto-generated fields  
- no compression heuristics  
- no retry policies  

gRPC calls become:
- pure  
- deterministic  
- metadata-only  
- reproducible  

gRPC wrappers support:
- unary calls  
- server streaming  
- client streaming  
- bidirectional streaming  

All gRPC metadata must be replayable and verifiable.

---

## WebSocket

WebSocket wrappers normalize streaming protocols into deterministic metadata streams.

WebSocket wrapper guarantees:
- no dynamic subscription inference  
- no reconnection heuristics  
- no fallback endpoints  
- no hidden state  

WebSocket streams become:
- declarative  
- deterministic  
- reproducible  
- lineage-tracked  

WebSocket wrappers support:
- chain event streams  
- indexer streams  
- protocol-specific event feeds  

WebSocket metadata must be identical across environments.

---

## Deterministic API Usage

All integration wrappers follow strict deterministic rules:

### 1. Explicit Inputs Only
No inference.  
No hidden defaults.  
No environment-driven behavior.

### 2. Pure Metadata Outputs
Wrappers produce:
- deterministic metadata  
- reproducible request definitions  
- declarative routing hints  

Wrappers never:
- execute calls  
- fetch data  
- mutate state  
- perform retries  
- perform signing  

### 3. Replayable Behavior
Same wrapper call → same metadata → same execution path → same output.

### 4. Zero-Retention
Wrappers store:
- no credentials  
- no tokens  
- no payloads  
- no history  
- no logs  

### 5. Protocol Parity
RPC, REST, GraphQL, gRPC, and WebSocket wrappers must expose identical semantics.

Wrappers are the **determin
