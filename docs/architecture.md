# Wnode Architecture

## Overview
Wnode architecture relies on a trustless, modular stack.

## Purpose
To ensure secure and efficient task routing across the sovereign compute network.

## Architecture
- **nodld**: Core Go-based daemon handling libp2p networking and Wazero runtime execution.
- **Portals**: Next.js frontends (Command, Nodlr, Mesh) for governance, node management, and client onboarding.
- **Integrations Layer**: Pluggable SDKs and agents for external protocols.

## Revenue path
Fee-sharing on compute tasks and integration-specific yields (e.g., flash loans).

## Test results
All components load-tested. Portals proxying auth correctly.

## Status
Working/Tested

## Screenshots
![Placeholder: Architecture Diagram]()
