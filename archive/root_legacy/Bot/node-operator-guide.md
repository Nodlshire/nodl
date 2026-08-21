# Node Operator Guide

## Overview
A node operator, also called a nodlr, is a participant who contributes compute capacity to the wnode network by running one or more nodes. A nodlr can operate as many nodes as they want, as long as each node runs on its own machine. This document explains how node operators participate in the network, how nodes are managed, and how revenue is earned.

The guide is built on three principles:

- A nodlr can run unlimited nodes,
- Each node must run on its own machine,
- Identity and revenue are tied to the operator’s account.

## What a Node Operator Is
A node operator is any user who:

- Installs the wnode client,
- Runs one or more nodes,
- Contributes compute to the Mesh,
- Earns revenue based on compute provided.

Node operators are the backbone of the decentralized compute network.

## Unlimited Nodes Per Operator
A nodlr can operate:

- 1 node,
- 10 nodes,
- 100 nodes,
- 1,000 nodes,
- Or more.

There is no limit on the number of nodes an operator can run. Scaling is achieved by using multiple machines.

## One Machine One Node Rule
While a nodlr can run unlimited nodes, each node must run on its own machine.

Examples:

- 10 machines → 10 nodes,
- 100 machines → 100 nodes,
- 1,000 machines → 1,000 nodes.

A single machine cannot run multiple nodes.

This ensures:

- Accurate resource reporting,
- Fair revenue attribution,
- Security isolation,
- Identity integrity.

## Identity and Mesh Client ID
Each node is tied to the nodlr’s account through a Mesh Client ID.

Identity is:

- Immutable,
- Unique,
- Sequentially generated,
- Bound to the operator.

A nodlr’s account may have many nodes, each with its own identity.

## Onboarding a New Node
To onboard a new node, the operator:

1. Prepares a machine,
2. Installs the wnode client,
3. Logs in with their account,
4. Registers the node automatically,
5. Begins receiving jobs.

## Job Processing & Zero-Storage

Nodes process jobs using a streaming, RAM-only execution model:

1. **Task Polling**: The node worker continuously polls the dispatcher for assigned tasks.
2. **Encrypted Streaming**: For streaming jobs, the node fetches encrypted chunks via a secure ephemeral XOR-scrambled pipe.
3. **On-the-Fly Decryption**: The node decrypts chunks in RAM using the per-job XOR key provided in the assignment.
4. **WASM Execution**: The decrypted bundle is executed in the isolated RAM-only WASM runner.
5. **Mandatory RAM Wipe**: Immediately after execution, the node worker explicitly zeroes out the decrypted buffers in RAM to ensure zero forensic trace.

No job data ever touches the node's disk.

No approval is required. No manual configuration is required.

## Scaling Node Operations
A nodlr can scale operations by:

- Adding more machines,
- Using cloud instances,
- Deploying small clusters,
- Building large farms.

Each machine runs exactly one node.

The operator dashboard shows:

- All nodes,
- Their status,
- Their earnings,
- Their performance.

## Node Maintenance
Node operators are responsible for:

- Keeping machines online,
- Ensuring stable internet,
- Applying client updates,
- Monitoring performance.

Nodes that fall behind on updates may be excluded from job routing.

## Revenue Model
Nodes earn revenue based on:

- Compute provided,
- Job completion,
- Uptime,
- Reliability.

Revenue is attributed to the operator’s account, not the machine.

Operators can:

- Run nodes at home,
- Run nodes in data centers,
- Run nodes in the cloud,
- Build large scale compute farms.

## Replacing a Node
If a machine fails or is retired:

1. The operator shuts down the node,
2. The node stops sending heartbeats,
3. It is removed from the job pool,
4. The operator may replace it with a new machine.

Identity belongs to the operator, not the hardware.

## Enterprise Node Operators
Large operators may:

- Deploy hundreds or thousands of nodes,
- Use dedicated hardware,
- Use cloud fleets,
- Automate provisioning.

The same rules apply:

- Unlimited nodes per operator,
- One node per machine.

## Summary
Node operators are free to scale as large as they want. The only constraint is that each node must run on its own machine. This ensures:

- Identity integrity,
- Revenue fairness,
- Security isolation,
- Accurate resource reporting,
- Predictable network behavior.

A nodlr can run unlimited nodes. Each node must run on its own machine.
