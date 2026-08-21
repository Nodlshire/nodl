# Data Flow

## Overview
The wnode network is designed around a simple and safe data flow model. Job payloads move through the system as encrypted streams, never stored, never retained, and never written to disk. The backend acts as a router, while nodes execute compute entirely in RAM. This document explains the complete lifecycle of data as it travels through the network.

The data flow model is built on three principles:

- Streaming only,
- RAM only,
- Zero storage.

## Data Flow Stages
A job moves through the network in five stages:

1. Submission,
2. Validation,
3. Streaming to node,
4. Execution in RAM,
5. Return of results.

Each stage is designed to minimize exposure and eliminate retention.

## Stage 1: Submission
A requester submits a job to the backend as an HTTP stream. The backend does not load the full payload into memory. Instead, it reads small chunks of the stream as they arrive.

During submission:

- No data is stored,
- No data is written to disk,
- No data is retained after processing each chunk.

The backend only holds a few kilobytes of data at any moment.

## Stage 2: Validation
The backend validates:

- Authentication,
- Mesh Client ID,
- Job metadata,
- Resource requirements.

Validation applies only to metadata. The backend does not inspect or interpret the job payload.

Once validated, the backend selects an available node.

## Stage 3: Streaming to Node
The backend streams the payload to the node using a chunk based pipeline.

For each chunk:

1. The backend reads a small portion of the incoming stream into RAM,
2. The chunk is encrypted using ephemeral XOR keys,
3. The encrypted chunk is forwarded to the selected node,
4. The backend discards the chunk immediately.

At no point does the backend hold the full payload.

The node receives the encrypted stream directly into its own RAM.

## Stage 4: Execution in RAM
The node:

1. Receives the encrypted stream,
2. Decrypts each chunk in RAM,
3. Assembles the job payload in RAM,
4. Executes the job entirely in RAM,
5. Produces results in RAM.

Nodes do not:

- Store payloads,
- Write to disk,
- Retain results,
- Share data with other nodes.

Execution is isolated and ephemeral.

## Stage 5: Return of Results
The node streams results back to the backend using the same pattern:

1. A small chunk is produced in RAM,
2. The chunk is encrypted,
3. The chunk is streamed to the backend,
4. The node discards the chunk.

The backend:

1. Receives the encrypted chunk,
2. Forwards it to the requester,
3. Discards it immediately.

The requester receives the full result stream.

## Zero Storage Guarantees
Throughout the entire data flow:

- No component stores job payloads,
- No component writes job data to disk,
- No component retains job data after execution,
- No component inspects or interprets payloads.

This ensures:

- Zero data retention,
- Zero long term exposure,
- Zero liability,
- Maximum privacy.

## Data Flow for Distributed Jobs
For multi node workloads:

- The requester splits the job into sub jobs,
- Each sub job follows the same data flow,
- Each sub job is processed by a different node,
- The requester aggregates results.

The Mesh does not split or merge payloads.

## Failure Handling
If a node fails during execution:

- The requester resubmits the sub job,
- The backend routes it to a new node,
- The data flow restarts from Stage 1.

No partial data is retained by the failed node.

## Summary
The data flow model guarantees:

- Streaming only movement of data,
- RAM only execution,
- Zero storage at all stages,
- Ephemeral encryption,
- Isolation between nodes,
- Isolation between backend and payloads,
- Complete privacy for all workloads.

This model is simple, safe, and aligned with the network’s core principles.
