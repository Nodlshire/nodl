# Network Lifecycle

## Overview
The wnode network operates through a set of interconnected lifecycles that define how nodes, nodlrs, identities, jobs, versions, and governance evolve over time. The network lifecycle ensures stability, predictability, and long‑term integrity while maintaining zero‑storage guarantees and immutable identity rules.

The lifecycle model is built on five pillars:

- Nodlr lifecycle,
- Node lifecycle,
- Identity lifecycle,
- Job lifecycle,
- Version and governance lifecycle.

Each lifecycle is independent but coordinated through the steward backend.

---

## Nodlr Lifecycle

Nodlrs are the human account holders and providers. Nodes (machines) are attached to Nodlr accounts.

A Nodlr follows this lifecycle:

1. Onboarding  
2. Tree placement  
3. Operation  
4. Inactivity (optional)  

### Onboarding
A Nodlr is created when a person:

- Registers an account,
- Accepts the terms,
- Completes the required onboarding steps.

### Tree Placement

There are two paths:

- **Without invite code (organic join):**  
  - The Nodlr is placed **sequentially under a Founder L1**, according to the founder assignment policy.  
  - Structure: `Founder → Nodlr`.

- **With invite code (affiliate join):**  
  - The Nodlr is placed **under the Nodlr who invited them**.  
  - That inviter Nodlr is already under a Founder, so the new Nodlr inherits that founder tree.  
  - Structure: `Founder → Inviter Nodlr → New Nodlr`.

In all cases:

- Nodlrs join trees.  
- Nodes never join trees directly.  
- Nodes inherit tree membership from their Nodlr.

### Operation
A Nodlr may:

- Attach one or more nodes (machines) to their account,
- Manage their hardware,
- Earn from their nodes’ compute,
- Participate in the referral graph.

### Inactivity
A Nodlr may become inactive, but:

- Their identity remains,
- Their position in the tree remains,
- Their attribution history remains.

Identity and tree placement are permanent.

---

## Node Lifecycle

Nodes are machines attached to Nodlr accounts. They do not join trees; they inherit economic position from their Nodlr.

Nodes follow this lifecycle:

1. Registration  
2. Verification  
3. Operation  
4. Update  
5. Retirement  

### Registration
A node registers by:

- Being added under a Nodlr account,
- Authenticating as that Nodlr,
- Receiving the next available **Node ID** in that Nodlr’s node identity sequence,
- Binding that Node ID to the machine’s hardware fingerprint,
- Reporting its capabilities (RAM, CPU, bandwidth).

A node does **not**:

- Create its own identity,
- Generate a Mesh Client ID,
- Join a founder or referral tree directly.

Node identity is:

- Assigned by the backend,
- Permanent,
- Immutable,
- Bound to hardware,
- Bound to the Nodlr identity (and thus indirectly to a founder tree).

### Verification
The backend verifies:

- Hardware fingerprint uniqueness,
- One machine one node compliance,
- Update compliance,
- Identity integrity.

Nodes that fail verification cannot operate.

### Operation
During operation, nodes:

- Receive jobs,
- Execute workloads entirely in RAM,
- Stream results,
- Report performance,
- Send heartbeats.

Nodes never store job data.

### Update
Nodes must stay reasonably up to date.

Updates ensure:

- Security,
- Protocol compatibility,
- Performance improvements.

Nodes that fall behind may be:

- Deprioritized,
- Excluded from routing,
- Required to update.

### Retirement
A node may be retired by:

- The Nodlr (operator),
- Hardware failure,
- Update non‑compliance.

Retirement does not delete:

- Node identity,
- Attribution history,
- The Nodlr’s position in the tree.

Identity is permanent even after retirement.

---

## Identity Lifecycle

Identity is permanent and immutable.

### Creation
Identities are created when:

- A Nodlr joins,
- A Founder is established,
- A Node is registered under a Nodlr.

### Binding
Identities bind to:

- Hardware (for nodes),
- Human operators (for nodlrs),
- Override trees (for founders).

### Operation
Identities determine:

- Attribution,
- Routing eligibility (for nodes),
- Governance boundaries (for founders),
- Economic relationships (for nodlrs).

### Permanence
Identities cannot be:

- Edited,
- Reassigned,
- Transferred,
- Deleted.

### Legacy
Even if a node or Nodlr becomes inactive, their identity remains part of:

- Attribution history,
- Founder tree structure,
- Governance records.

---

## Job Lifecycle

Jobs follow a strict, stateless lifecycle:

1. Submission  
2. Routing  
3. Streaming  
4. Execution  
5. Completion  
6. Discard  

### Submission
Requesters (Mesh Clients) submit:

- Encrypted payloads,
- Metadata,
- Resource requirements.

Mesh Client IDs identify **buyers of compute**, not nodes.

### Routing
The backend selects a node based on:

- Performance score,
- RAM availability,
- CPU availability,
- Latency,
- Update status.

### Streaming
Payloads are:

- Encrypted,
- Chunked,
- Forwarded,
- Never stored.

### Execution
Nodes:

- Decrypt chunks in RAM,
- Execute workloads in RAM,
- Produce results in RAM.

### Completion
Nodes:

- Stream results,
- Discard all data,
- Report success.

### Discard
The backend:

- Discards all chunks,
- Retains metadata only.

Zero storage is absolute.

---

## Version and Governance Lifecycle

### Version Lifecycle
The network evolves through controlled versioning.

#### Release
New versions include:

- Security patches,
- Performance improvements,
- Protocol updates.

#### Distribution
Updates are distributed through:

- The steward backend,
- The node client.

#### Enforcement
Nodes must stay within:

- Minimum supported version,
- Security patch window.

#### Deprecation
Old versions are:

- Phased out,
- Deprioritized,
- Eventually blocked.

Version lifecycle ensures safety and compatibility.

### Governance Lifecycle
Governance evolves through:

- Founder participation,
- Steward enforcement,
- Immutable identity rules.

#### Founder Lifecycle
Founders:

- Join once,
- Receive a permanent identity,
- Own a referral/override tree,
- Earn override indefinitely from that tree.

Founder identity and trees never change.

#### Steward Lifecycle
The steward:

- Maintains identity integrity,
- Maintains routing fairness,
- Maintains attribution accuracy,
- Maintains update enforcement.

The steward does not:

- Modify identities,
- Modify attribution,
- Modify founder trees.

---

## Summary
The network lifecycle ensures:

- Nodlrs join trees; nodes inherit their position from Nodlrs,
- Stable node operation,
- Permanent identity integrity,
- Stateless job execution,
- Safe version evolution,
- Immutable governance boundaries.

Each lifecycle is independent but coordinated to maintain the Mesh’s long‑term stability, security, and economic fairness.
