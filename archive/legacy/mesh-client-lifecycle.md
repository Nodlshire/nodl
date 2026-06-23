# Mesh Client Lifecycle

## Overview
Mesh Clients are the compute buyers in the wnode network.  
They submit jobs, purchase compute, receive results, and interact with the steward through a secure, stateless, zero‑storage protocol.

Mesh Clients are completely separate from:

- Nodlrs (compute providers),
- Nodes (machines),
- Founders (override participants).

This document defines how Mesh Clients join, how they are identified, how jobs flow, how billing works, and how privacy is preserved.

---

## Mesh Client Identity

### Mesh Client ID
Every Mesh Client receives a **Mesh Client ID** when they register.

A Mesh Client ID:

- Identifies the requester,
- Is used for billing,
- Is used for job attribution,
- Is used for CRM and support,
- Is not tied to hardware,
- Is not tied to a founder tree,
- Is not tied to nodlr identities.

### Format
Mesh Client IDs follow the format:


Where:

- `bucket` = load‑balancing bucket,
- `sequence` = sequential ID,
- `MMYY` = month/year of creation.

### Purpose
Mesh Client IDs allow:

- Job tracking,
- Billing,
- Abuse prevention,
- Rate limiting,
- Support and auditability.

Mesh Client IDs do **not** reveal:

- Personal data,
- Payment data,
- Identity documents.

Stripe holds all sensitive information.

---

## Client Onboarding

### Step 1: Account Creation
A client creates an account with:

- Email,
- Password,
- Optional profile details.

### Step 2: Stripe Setup
Stripe handles:

- Payment method storage,
- Fraud checks,
- PCI compliance,
- Identity verification (if required),
- Charge authorization.

The steward never stores:

- Cards,
- Bank accounts,
- Billing addresses,
- Sensitive financial data.

### Step 3: Mesh Client ID Assignment
The steward assigns:

- A Mesh Client ID,
- A CRM record,
- A usage bucket.

The client is now ready to submit jobs.

---

## Job Lifecycle (Client Perspective)

1. Job creation  
2. Encryption  
3. Submission  
4. Routing  
5. Execution  
6. Result streaming  
7. Billing  
8. Discard  

### 1. Job Creation
The client prepares:

- Payload,
- Metadata,
- Resource requirements,
- Priority level.

### 2. Encryption
The client encrypts:

- Payload,
- Chunks,
- Sensitive data.

The steward and nodes never see unencrypted data.

### 3. Submission & Splitting
The client submits jobs via the **Mesh Portal** or API:

- **Small Jobs**: Submitted as a single encrypted stream directly to the coordinator.
- **Large Jobs**: Automatically sliced into chunks (e.g., 512KB) by the client-side worker.
- **Multi-Node Distribution**: Each chunk is submitted as an independent sub-job, allowing the mesh to process different parts of a single large file across multiple nodes in parallel.
- **Retry Logic**: Failed chunks are automatically retried up to 3 times before the parent job is aborted.
- **Aggregation**: The client-side utility tracks all sub-job IDs and aggregates the results into a single unified response for the user.

### 4. Routing
The steward selects a node based on:

- Performance,
- RAM,
- CPU,
- Latency,
- Locality (major ecological win),
- Update status.

### 5. Execution
The node:

- Decrypts chunks in RAM,
- Executes the job in RAM,
- Produces results in RAM.

### 6. Result Streaming
The node streams results back to the steward, which forwards them to the client.

### 7. Billing
Stripe charges the client for:

- CPU time,
- RAM usage,
- Duration,
- Priority,
- Network load.

Billing is:

- Automatic,
- Transparent,
- Itemized.

### 8. Discard
The steward discards:

- Payloads,
- Results,
- Intermediate data.

Only metadata is retained for auditability.

Zero storage is absolute.

---

## Locality‑Based Compute (Client Benefit)
Mesh Clients benefit from locality because:

- Nodes can be physically close to the requester,
- Latency is lower,
- Transmission energy is lower,
- Throughput is higher,
- Costs can be lower.

Locality is a **major ecological and performance advantage** over hyperscale datacenters.

---

## Privacy and Isolation
Mesh Clients are isolated from:

- Nodlr identities,
- Node hardware details,
- Founder trees,
- Referral structures.

Nodes never see:

- Client identity,
- Client payment data,
- Client personal information.

The steward never sees:

- Decrypted payloads,
- Decrypted results,
- Sensitive financial data.

Stripe holds all financial data.  
Clients hold all plaintext data.

---

## Abuse Prevention
The steward enforces:

- Rate limits,
- Fraud detection,
- Job throttling,
- Blacklisting (if needed),
- Stripe fraud scoring.

Mesh Clients cannot:

- Target specific nodes,
- Influence routing,
- Access nodlr information.

---

## Summary
The Mesh Client lifecycle ensures:

- Secure onboarding,
- Verified payments,
- Encrypted job submission,
- Locality‑aware routing,
- Stateless execution,
- Transparent billing,
- Zero‑storage privacy,
- Full isolation from nodlr identities.

Mesh Clients buy compute.  
Nodlrs provide compute.  
Stripe protects the money.  
The steward coordinates the network.
