# Wnode Apps


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Apps** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



## Overview
The Wnode ecosystem is managed through three primary portals.

## Purpose
To provide distinct, specialized interfaces for operators, clients, and network governance.

## Architecture
- **Command (3001)**: The master control system for the network.
- **Nodlr (3002)**: The operator dashboard for managing nodes and hardware.
- **Mesh (3003)**: The client portal for submitting compute jobs.

## Revenue path
Subscriptions and usage fees processed via the portals.

## Test results
All apps are successfully communicating and sharing JWT authentication state.

## Status
Working/Tested

## Screenshots
![Placeholder: Apps Dashboard]()
