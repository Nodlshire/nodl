# Network Architecture

## Overview
The wnode network is a decentralized compute mesh that connects node operators, job submitters, and the steward operated backend into a single coherent system. The architecture is designed to be simple, secure, and predictable, while remaining fully community owned. This document explains how the Mesh works, how compute flows through the system, and how the different components interact to create a reliable decentralized compute network.

The architecture is built around three core principles:

- The network is sovereign and community owned,
- The steward operates the backend as a licensed service provider,
- Compute flows through a RAM only, zero storage pipeline for maximum safety.

## The Mesh
The Mesh is the global network of nodes that provide compute capacity. Each node is an independent participant running the wnode client software. Nodes connect to the steward operated backend to receive jobs, report status, and participate in the economic model.

The Mesh is designed to be:

- Permissionless, anyone can join,
- Horizontally scalable, capacity grows with each new node,
- Secure, communication is encrypted and authenticated,
- Stateless, nodes do not store user data or job payloads.

The Mesh is the heart of the network. It is the community owned asset that powers the entire ecosystem.

## Nodes
A node is any machine running the wnode client. Nodes can be laptops, desktops, servers, or cloud instances. Each node:

- Registers with the backend using its Mesh Client ID,
- Advertises its available compute capacity,
- Receives jobs from the steward operated backend,
- Executes jobs in a RAM only environment,
- Returns results without storing any data.

Nodes earn revenue based on the compute they provide. Each node is an immutable asset tied to its Mesh Client ID.

## Mesh Client ID
Every account and node in the network is identified by a Mesh Client ID. This ID is:

- Immutable,
- Sequentially generated,
- Human readable,
- Globally unique.

The format is:

M{bucket}-{sequence}-{MMYY}

The Mesh Client ID is used for:

- Authentication,
- Node registration,
- Revenue attribution,
- Affiliate tree relationships,
- CRM and dashboard hydration.

It is the identity backbone of the network.

## Jobs
A job is a unit of compute submitted to the network. Jobs are routed to nodes based on availability, capacity, and fairness rules. A job consists of:

- A payload,
- Execution instructions,
- Resource requirements,
- A return channel for results.

Jobs are processed entirely in RAM. No job data is ever written to disk by the node or the backend.

## RAM Only Compute Pipeline
The wnode network uses a RAM only compute pipeline designed to eliminate storage liability and ensure maximum privacy. The backend does not hold full job payloads in memory. Instead, it acts as a lightweight router that streams encrypted data directly to the node that will execute the job.

The pipeline works as follows:

1. The backend receives the job as an incoming HTTP stream,
2. The backend reads a small chunk of the stream into RAM,
3. The chunk is encrypted in memory using ephemeral XOR keys,
4. The encrypted chunk is forwarded immediately to the selected node,
5. The backend discards the chunk from memory,
6. The node receives the stream directly into its own RAM,
7. The node decrypts and executes the job entirely in RAM,
8. The node streams results back to the backend,
9. The backend forwards results to the requester using the same streaming pattern,
10. All transient buffers on both sides are wiped immediately after use.

At no point is the full job payload stored or retained by the backend. Only the executing node holds the complete payload in RAM, and only for the duration of the job.

This ensures:

- Zero data retention,
- Zero storage liability,
- Minimal backend memory usage,
- Maximum privacy and regulatory safety.

## Backend Services
The steward operates the backend services required for the Mesh. These services include:

- Job routing,
- Node registration and heartbeat,
- Identity and authentication,
- Revenue accounting,
- CRM hydration,
- API endpoints for portals and integrations.

The backend is stateless for job data and stateful only for operational metadata such as account records, node status, and economic tracking.

The backend does not store job payloads, user data, or compute results.

## Portals
The network includes three primary portals and one public website.

### Command Portal
cmd.wnode.one  
Used by founders and operators for:

- Governance level visibility,
- Platform wide metrics,
- Stewardship oversight,
- System health and operational controls.

### Mesh Portal
mesh.wnode.one  
Used by compute users and node operators for:

- Node status,
- Job history,
- Revenue tracking,
- Mesh Client ID display,
- Account level insights.

### Nodes Portal (Nodlr)
nodlr.wnode.one  
Used by node runners for:

- Node onboarding,
- Node configuration,
- Node performance metrics,
- Affiliate tree visibility,
- Earnings and payouts.

### Public Website
wnode.one  
Used for:

- Public information,
- Documentation,
- Marketing and onboarding,
- Links to all portals.

All portals communicate with the backend through the same API layer. None of the portals store sensitive data.

## Compute Flow
The compute flow through the system follows a streaming, memory safe sequence:

1. A user or integration submits a job to the backend as a stream,
2. The backend validates the request and begins streaming the payload,
3. The backend selects an available node,
4. The backend streams encrypted chunks directly to the node, without storing the full payload,
5. The node assembles and executes the job entirely in RAM,
6. The node streams results back to the backend,
7. The backend forwards results to the requester,
8. All transient memory buffers are wiped.

Only the node performing the computation ever holds the full job payload in RAM.

## Security Model
The security model is built around:

- Encrypted communication between nodes and backend,
- RAM only job handling,
- Ephemeral XOR encryption for payloads,
- Immutable Mesh Client IDs for identity,
- Strict validation of all API requests,
- Zero storage of sensitive data.

The architecture minimizes attack surface and eliminates entire classes of risk by design.

## Scaling
The network scales horizontally. Each new node increases total capacity. The backend is lightweight and stateless for job data, allowing it to scale independently as needed.

Scaling characteristics:

- More nodes equals more compute,
- More nodes equals more redundancy,
- Backend scaling is linear and predictable,
- No single node is critical to network health.

The Mesh grows naturally as the community grows.

## What the Steward Operates
The steward operates:

- The backend services,
- The portals,
- The job router,
- The identity system,
- The CRM and revenue accounting layer,
- The operational infrastructure required for uptime.

The steward does not own:

- The Mesh,
- The nodes,
- The accounts,
- The economic rights of participants.

The steward operates the network, the community owns the network.

## What the Community Owns
The community owns:

- Every node,
- Every account,
- Every Mesh Client ID,
- The entire decentralized compute fabric,
- The economic rights tied to participation,
- The viral affiliate tree,
- The long term direction of the DePIN.

The architecture ensures that ownership and operation remain separate but aligned.
