# Identity and Authentication

## WUID Binding

Wnode uses a deterministic identity primitive called **WUID** (Wnode Unique Identifier).  
A WUID is:
- globally unique  
- deterministic  
- non-random  
- non-cryptographic  
- non-stateful  
- non-revocable  

A WUID binds a developer, agent, or system to:
- job ownership  
- execution lineage  
- audit trails  
- mesh routing hints  
- reduction rules  

WUIDs are generated using a pure, reproducible function.  
There is no entropy, no randomness, and no hidden state.  
A WUID generated on:
- local dev  
- CI  
- staging  
- production  

must always be identical for the same input.

WUIDs are **not** keys, **not** secrets, and **not** credentials.  
They are identity anchors for deterministic compute.

---

## Cryptographic Signing

The Wnode SDK **never signs anything**.

Signing is performed exclusively by:
- the Steward  
- the mesh  
- the execution layer  
- the chain-level integration  

The SDK produces:
- calldata-only  
- unsigned  
- deterministic  
- reproducible  

payloads.

This ensures:
- zero custody  
- zero risk  
- zero private key exposure  
- zero attack surface  
- zero wallet integration requirements  

If a developer needs to sign something, it must be done **outside** the SDK using their own cryptographic tooling.

The SDK is constitutionally forbidden from:
- holding private keys  
- generating private keys  
- storing private keys  
- signing messages  
- signing transactions  
- performing cryptographic operations that alter determinism  

---

## Ephemeral Keys

Ephemeral keys are used by the mesh and Steward for:
- job routing  
- sharding  
- reduction  
- verification  
- execution lineage  

These keys:
- are generated inside RAM  
- never touch disk  
- never persist  
- never leave the execution boundary  
- never become developer-visible  
- never become SDK-visible  

Ephemeral keys are
