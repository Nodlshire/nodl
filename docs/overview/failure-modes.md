# Wnode Architecture — Failure Modes


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Architecture — Failure Modes** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



![diagram](/diagrams/failure-modes-map.png)

The Wnode Sovereign Mesh is designed to fail deterministically, safely, and verifiably.  
Every failure mode is intentional, explicit, and cryptographically accountable.  
No silent corruption, nondeterministic drift, or hidden state is ever permitted.

This section defines the canonical failure modes of the Wnode architecture.

---

## Epoch Expiration

Routing epochs contain:
- allowed routes  
- ingress validation rules  
- HMAC secrets  
- deterministic routing tables  

When an epoch expires:
- nodes reject ingress traffic  
- execution halts safely  
- no nondeterministic fallback occurs  
- nodes wait for a new signed epoch  

This prevents stale routing and unauthorized ingress.

---

## Capability Rejection

All outbound I/O is validated against:
- spec.yaml capability declarations  
- daemon-side capability registry  
- deterministic host-function boundaries  

If a Native Go module attempts unauthorized I/O:
- the operation traps instantly  
- the module halts deterministically  
- no partial execution occurs  
- no host contamination is possible  

This is a constitutional safety invariant.

---

## Native Go Sandbox Traps

The SECCOMP Sandbox runtime traps:
- panics  
- illegal memory access  
- invalid host-function calls  
- nondeterministic behavior  

Traps:
- do not affect the host  
- do not leak memory  
- do not retain state  
- do not produce nondeterministic results  

Execution stops cleanly and deterministically.

---

## Grace-Based Reputation Decay

Nodes do not experience instant slashing.  
Instead, Wnode applies:
- continuous score decay  
- deterministic grace windows  
- multi-dimensional reliability scoring  

This prevents:
- catastrophic operator loss  
- nondeterministic punishment  
- centralized slashing authority  

Reputation is cryptographically tracked and replayable.

---

## Offline Operation

Nodes continue operating during orchestrator downtime using:
- cached routing epochs  
- deterministic ingress validation  
- local capability enforcement  

Failure mode behavior:
- no new epochs can be fetched  
- existing epochs remain valid until expiration  
- execution continues deterministically  

This ensures global resilience and zero SPOF.

---

## Telemetry Failure

If telemetry cannot be delivered:
- envelopes remain sealed  
- no plaintext logs are emitted  
- no fallback transport is used  
- nodes retry deterministically within RAM-only buffers  

Telemetry failure never compromises execution safety.

---

## Deterministic Failure Guarantees

All failure modes guarantee:
- deterministic behavior  
- cryptographic accountability  
- zero-custody safety  
- zero-retention semantics  
- replayable lineage  
- no nondeterministic drift  

Wnode fails safely, predictably, and verifiably.
