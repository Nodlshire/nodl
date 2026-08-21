# Job Creation and Metadata


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Job Creation and Metadata** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



## Job Definition

A Wnode job is a **deterministic, self‑describing execution unit**.  
It contains:
- the developer’s intent  
- the execution parameters  
- the routing hints  
- the sharding rules  
- the reduction rules  
- the privacy mode  
- the verification requirements  

A job is **not**:
- a script  
- a workflow file  
- a payload container  
- a mutable object  

Jobs are immutable, declarative, and reproducible.  
The SDK’s role is to produce **canonical job objects** that the mesh can execute without ambiguity.

---

## Metadata Fields

Every job contains a strict metadata schema.  
No field is optional.  
No field is inferred.  
No field is heuristic.

### Core Fields

**jobId**  
Deterministic identifier derived from job metadata.  
Same metadata → same jobId across all environments.

**wuid**  
Identity anchor binding the job to its creator.  
Non-secret, non-random, non-revocable.

**engineType**  
Specifies
