# Wnode SDK Overview
### The Sovereign Interface to Deterministic Compute

## Purpose
The Wnode SDK is the developer-facing interface to the sovereign compute mesh. Its purpose is to provide a single, deterministic, chain-agnostic, protocol-agnostic API that abstracts away:
- RPC inconsistencies
- protocol quirks
- chain-specific ABIs
- nondeterministic execution paths
- unreliable data sources
- unsafe client-side logic

The SDK gives developers one mental model for interacting with the entire Wnode ecosystem, regardless of chain, protocol, integration, region, device class, or execution topology. The SDK is the unification layer that makes Wnode usable, safe, and predictable.

## Architecture Layers
The SDK is structured into four deterministic layers, each with a strict constitutional role:

### 1. Interface Layer
The public API surface developers interact with. Provides deterministic functions for:
- job creation
- metadata construction
- sharding configuration
- reduction rules
- routing hints
- identity binding

This layer is stateless and pure.

### 2. Metadata Engine
Transforms developer intent into authoritative metadata. This engine ensures:
- no hidden defaults
- no heuristics
- no inference
- no nondeterministic behavior

Every job becomes a self-describing object that the mesh can execute deterministically.

### 3. Deterministic Workflow Layer
Executes multi-step workflows in a pure, replayable, deterministic pipeline. Guarantees:
- same inputs → same outputs
- no hidden state
- no drift
- no randomness
- no side effects

This layer is the backbone of sovereign compute.

### 4. Steward Interface Layer
The SDK never executes jobs. It produces calldata-only, unsigned, deterministic payloads that the Steward can validate, route, shard, execute, reduce, and verify. This layer ensures zero custody, zero signing, and zero risk.

## Deterministic Principles
The SDK is constitutionally bound by Wnode’s determinism doctrine:
- RAM-only execution
- stateless interfaces
- self-describing jobs
- rule-based routing
- mathematical reduction
- zero inference
- zero heuristics
- zero nondeterminism
- zero retention
- replayable workflows
- verifiable outputs

Every SDK function must produce canonical, reproducible results. If a function cannot guarantee determinism, it cannot exist in the SDK.

## Sovereign Compute Alignment
The SDK enforces sovereign compute principles:

### 1. Zero Custody
The SDK never handles private keys, signing, or broadcasting.

### 2. Zero Retention
No data is stored, cached, or persisted.

### 3. Zero Payload Visibility
The SDK cannot inspect job payloads.

### 4. Zero Nondeterminism
All outputs must be mathematically reproducible.

### 5. Zero Chain Bias
All chains and protocols are treated as equal citizens.

### 6. Zero Heuristic Behavior
No AI-driven or probabilistic logic is allowed.

The SDK is the constitutional guardian of sovereign compute.

## Developer Audience
The Wnode SDK is designed for:
- protocol engineers
- backend developers
- AI workflow architects
- DeFi automation builders
- cross-chain infrastructure teams
- agent developers
- mesh operators
- enterprise integration teams

It is intentionally low-level, deterministic, and predictable, giving developers:
- full control
- full transparency
- full auditability
- full reproducibility

The SDK is not a convenience layer — it is a sovereign execution interface.
