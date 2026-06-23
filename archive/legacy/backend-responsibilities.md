# Backend Responsibilities

## Overview
The steward backend is the coordination layer of the wnode network. It manages identity, routing, attribution, and job flow without ever storing or inspecting job data. This document defines what the backend is responsible for, what it guarantees, and what it explicitly does not do.

The backend is built on four principles:

- Identity integrity,
- Zero storage,
- Secure routing,
- Deterministic attribution.

## Core Responsibilities
The backend is responsible for:

- Managing identities,
- Managing the referral graph,
- Managing founder trees,
- Routing jobs to nodes,
- Streaming encrypted data,
- Tracking node health,
- Tracking performance metrics,
- Calculating revenue attribution,
- Enforcing update compliance,
- Enforcing one machine one node,
- Maintaining audit logs (metadata only).

The backend does not execute jobs.
The backend does not inspect payloads.
The backend does not store job data.

## Identity Management
The backend manages:

- Mesh Client IDs,
- Nodlr identities,
- Founder identities,
- Referral relationships,
- Immutable attribution.

Identity is:

- Permanent,
- Immutable,
- Sequential,
- Bound to the operator.

The backend prevents:

- Identity spoofing,
- Identity swapping,
- Referral manipulation.

## Routing Responsibilities
The backend routes jobs to nodes based on:

- Performance score,
- Available RAM,
- CPU capacity,
- Latency,
- Reliability,
- Update status.

Routing is:

- Deterministic,
- Fair,
- Performance-weighted,
- Identity-aware.

The backend does not:

- Inspect payloads,
- Modify payloads,
- Split jobs,
- Validate correctness.

## Streaming Responsibilities
The backend:

- Receives encrypted chunks,
- Forwards encrypted chunks,
- Discards chunks immediately,
- Never stores payloads,
- Never stores results.

Streaming is:

- Encrypted,
- Stateless,
- Ephemeral,
- Zero-retention.

The backend cannot decrypt payloads.

## Health and Performance Tracking
The backend tracks:

- Heartbeats,
- Uptime,
- Latency,
- RAM availability,
- CPU load,
- Job completion rate,
- Update status.

This data is used for:

- Routing decisions,
- Performance scoring,
- Revenue attribution.

The backend does not track:

- Job contents,
- Payload data,
- Execution details.

## Revenue Attribution
The backend calculates:

- Node earnings,
- Nodlr earnings,
- Founder override,
- Referral-based attribution.

Attribution is:

- Immutable,
- Identity-based,
- Deterministic,
- Fraud-resistant.

The backend does not:

- Modify earnings,
- Reassign attribution,
- Alter referral history.

## Update Enforcement
The backend enforces:

- Minimum client version,
- Security patch compliance,
- Protocol compatibility.

Nodes that fall behind may be:

- Deprioritized,
- Excluded from routing,
- Required to update.

This ensures network safety.

## One Machine One Node Enforcement
The backend enforces:

- Hardware fingerprint uniqueness,
- Process locking validation,
- Identity binding.

This prevents:

- Multi-node stacking,
- Resource inflation,
- Identity duplication.

## Data Storage Responsibilities
The backend stores:

- Identity metadata,
- Referral graph,
- Founder tree,
- Node performance metrics,
- Job metadata (not payloads),
- Revenue attribution records,
- Audit logs (metadata only).

The backend does not store:

- Payloads,
- Results,
- Intermediate data,
- Decrypted data,
- Encrypted data chunks.

Zero storage is a core guarantee.

## Security Responsibilities
The backend ensures:

- TLS everywhere,
- Replay protection,
- Rate limiting,
- Identity integrity,
- Routing fairness,
- Zero storage,
- Encrypted streaming.

The backend does not ensure:

- Job correctness,
- Node uptime,
- Node performance,
- Requester input quality.

## What the Backend Does Not Do
The backend does not:

- Execute jobs,
- Inspect payloads,
- Store payloads,
- Validate results,
- Split jobs,
- Aggregate results,
- Modify attribution,
- Modify identities,
- Modify founder trees.

These responsibilities belong to:

- Nodes (execution),
- Requesters (validation),
- Governance (identity rules).

## Summary
The backend ensures:

- Identity integrity,
- Secure routing,
- Zero storage,
- Encrypted streaming,
- Fair distribution,
- Accurate attribution,
- Update compliance,
- Fraud prevention.

The backend coordinates the Mesh without ever seeing or storing job data.
