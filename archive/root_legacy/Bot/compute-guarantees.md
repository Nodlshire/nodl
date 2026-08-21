# Compute Guarantees

## Overview
The wnode network provides a set of strict compute guarantees that define how jobs are executed, how data is handled, and what requesters and operators can rely on. These guarantees ensure predictable, safe, and privacy-preserving execution across a decentralized network of independent nodes.

The compute model is built on four guarantees:

- RAM-only execution,
- Zero storage,
- Stateless nodes,
- Encrypted streaming.

These guarantees apply to every job, every node, and every workload.

## RAM-Only Execution Guarantee
All jobs are executed entirely in RAM.

Nodes:

- Receive encrypted chunks into RAM,
- Decrypt chunks in RAM,
- Assemble payloads in RAM,
- Execute workloads in RAM,
- Produce results in RAM,
- Discard all data after completion.

Nodes never:

- Write job data to disk,
- Cache job data,
- Persist intermediate state,
- Store results.

This guarantee is enforced by:

- Client design,
- Runtime checks,
- Memory-only execution paths,
- No disk write permissions for job data.

## Zero Storage Guarantee
The network guarantees that:

- No job data is stored,
- No job data is retained,
- No job data is written to disk,
- No job data is cached,
- No job data is logged.

This applies to:

- Nodes,
- Backend,
- Requester-side infrastructure.

The steward stores:

- Metadata only,
- Never payloads,
- Never results,
- Never intermediate data.

Zero storage is a core privacy and security guarantee.

## Stateless Node Guarantee
Nodes are stateless compute units.

Nodes do not retain:

- Job data,
- Execution state,
- Results,
- Payload fragments,
- Historical context.

Each job is isolated and independent.

After a job completes:

- RAM is cleared,
- Execution context is destroyed,
- No data persists.

Statelessness ensures:

- Privacy,
- Security,
- Predictability,
- Isolation.

## Encrypted Streaming Guarantee
All job data is streamed through the network in encrypted form.

The backend:

- Receives encrypted chunks,
- Forwards encrypted chunks,
- Discards chunks immediately.

Nodes:

- Receive encrypted chunks,
- Decrypt them in RAM,
- Process them,
- Re-encrypt results,
- Stream results back.

Encryption is:

- Ephemeral,
- Chunk-based,
- Stateless,
- Non-persistent.

## Isolation Guarantee
Each job is isolated from:

- Other jobs,
- Other nodes,
- The backend,
- The operator’s machine.

Isolation is enforced by:

- RAM-only execution,
- No shared state,
- No cross-job memory access,
- No disk writes,
- No inter-node communication.

Nodes cannot:

- Access other nodes’ data,
- Access requester data outside the job,
- Access steward data,
- Access historical data.

## Capacity Guarantee
Nodes only accept jobs they can safely execute.

Nodes reject jobs if:

- RAM is insufficient,
- CPU is insufficient,
- Latency is too high,
- They are overloaded,
- They are out of date.

This ensures:

- Predictable performance,
- Safe execution,
- No partial or corrupted results.

## Correctness Guarantee
The network guarantees:

- Jobs are executed exactly as submitted,
- No modification of payloads,
- No modification of results,
- No interpretation of data by the backend.

Nodes execute workloads deterministically based on the job payload.

The steward does not:

- Inspect payloads,
- Modify payloads,
- Validate correctness of results.

Correctness is the responsibility of:

- The requester (input),
- The node (execution),
- The requester (validation of output).

## Failure Handling Guarantee
If a node fails:

- The job is marked incomplete,
- No partial data is retained,
- The requester may resubmit,
- The backend routes to a new node.

Failures do not compromise:

- Privacy,
- Security,
- Data integrity.

## What the Steward Guarantees
The steward guarantees:

- Secure routing,
- Encrypted streaming,
- Zero storage,
- Identity integrity,
- Fair job distribution,
- Accurate revenue attribution.

The steward does not guarantee:

- Job correctness,
- Job success,
- Node performance,
- Node uptime.

## What Nodes Guarantee
Nodes guarantee:

- RAM-only execution,
- Zero storage,
- Encrypted processing,
- Stateless operation,
- Honest execution.

Nodes do not guarantee:

- Job success (hardware may fail),
- Performance beyond their capacity,
- Correctness of requester input.

## What Requesters Can Rely On
Requesters can rely on:

- Privacy,
- Zero retention,
- Encrypted streaming,
- RAM-only execution,
- Isolation,
- Predictable behavior.

Requesters are responsible for:

- Splitting distributed jobs,
- Validating results,
- Handling retries.

## Summary
Compute guarantees ensure:

- Privacy,
- Security,
- Predictability,
- Isolation,
- Zero storage,
- RAM-only execution.

These guarantees define how compute flows through the Mesh and protect all participants in the network.
