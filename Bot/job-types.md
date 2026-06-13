# Job Types

## Overview
The wnode network supports multiple types of compute jobs, each designed to run entirely in RAM and stream through the Mesh without storage or retention. Job types define how workloads are structured, how they are executed, and how nodes determine whether they can accept them.

The job model is built on three principles:

- All jobs are RAM-only,
- All jobs are streamed,
- All jobs are stateless.

## Job Categories
Jobs fall into three primary categories:

1. Standard Jobs
2. Streaming Jobs
3. Distributed Jobs

Each category has different execution characteristics but follows the same zero-storage guarantees.

## Standard Jobs
Standard jobs are the simplest type of workload. They:

- Fit entirely in the node’s available RAM,
- Are streamed to the node in encrypted chunks,
- Are executed in RAM,
- Produce a result stream,
- Are discarded immediately after completion.

Examples:

- Data transformation,
- Model inference,
- File processing,
- Compression/decompression,
- Encryption/decryption.

Nodes accept standard jobs if:

- They have enough free RAM,
- They are not overloaded,
- Their performance score is sufficient.

## Streaming Jobs
Streaming jobs are workloads where:

- The input is too large to buffer fully,
- The output is produced incrementally,
- The job processes data as it arrives.

Streaming jobs are ideal for:

- Large file processing,
- Video transcoding,
- Audio processing,
- Real-time analytics,
- Continuous data pipelines.

Nodes accept streaming jobs if:

- They can maintain throughput,
- They have stable network conditions,
- They have sufficient CPU for real-time processing.

Streaming jobs never store data. They process and discard chunks immediately.

## Distributed Jobs
Distributed jobs are workloads split across multiple nodes. The Mesh does not split jobs automatically. Instead:

- The requester splits the job into sub-jobs,
- Each sub-job is submitted independently,
- Each sub-job follows the standard data flow,
- The requester aggregates results.

Distributed jobs are ideal for:

- Parallelizable workloads,
- Batch processing,
- Large-scale compute tasks,
- Map-reduce style operations.

Nodes accept distributed sub-jobs the same way they accept standard jobs.

## Job Metadata
Every job includes metadata that helps nodes determine whether they can accept it.

Metadata includes:

- Job ID,
- Resource requirements,
- Expected RAM usage,
- Expected CPU usage,
- Estimated runtime,
- Priority level,
- Job category.

Nodes use metadata to:

- Accept or reject jobs,
- Allocate RAM,
- Manage CPU scheduling,
- Report performance.

## Resource Requirements
Jobs specify:

- Minimum RAM required,
- Minimum CPU required,
- Whether streaming is required,
- Whether real-time processing is required.

Nodes reject jobs that exceed their capacity.

## Job Acceptance Logic
Nodes accept a job if:

- They have enough free RAM,
- They have enough CPU,
- They are not overloaded,
- Their performance score is sufficient,
- They are up to date,
- They are online and healthy.

Nodes reject a job if:

- RAM is insufficient,
- CPU is insufficient,
- Latency is too high,
- They are under heavy load,
- They are out of date,
- They are in a degraded state.

Rejection is normal and expected.

## Job Completion
A job is considered complete when:

- The node receives the full payload,
- Executes it entirely in RAM,
- Streams results back,
- Discards all data.

Completion is binary:

- Success → node earns revenue
- Failure → requester may resubmit

Nodes retain nothing after completion.

## Large Jobs
Large jobs are handled by:

- Streaming,
- Distributed execution,
- Chunked processing.

Nodes never store large payloads. They process them incrementally.

## Summary
The job model ensures:

- All jobs are RAM-only,
- All jobs are streamed,
- All jobs are stateless,
- Nodes can safely accept or reject jobs,
- Distributed workloads scale horizontally,
- Large workloads are processed without storage.

Job types define how compute flows through the Mesh and ensure predictable, safe, and efficient execution.
