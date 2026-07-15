<div align="center">

# Wnode Sovereign Mesh

**Decentralized compute infrastructure — owned by operators, governed by code.**

[![License](https://img.shields.io/badge/license-BSL--1.1-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0-green.svg)](VERSION.txt)
[![Docs](https://img.shields.io/badge/docs-wnode.one-purple.svg)](https://wnode.one/docs)

</div>

---

## Overview

Wnode is a sovereign mesh network for deterministic, zero-storage compute. Node operators contribute hardware; clients submit jobs via cryptographically attested envelopes; the mesh schedules, executes, and verifies workloads in RAM — no persistent state, no extraction.

This monorepo contains every component of the Wnode stack: frontend portals, backend daemon, smart contracts, SDKs, tooling, and canonical documentation.

## Repository Structure

```
wnode/
├── apps/                  # Frontend applications (Next.js)
│   ├── command/           # Internal command & CRM portal
│   ├── mesh/              # Mesh client portal
│   ├── nodlr/             # Node operator dashboard
│   ├── web/               # Public website & docs viewer
│   └── wnoder/           # Wnoder operator portal
├── packages/              # Shared libraries
│   ├── shared/            # Shared UI components & utilities
│   ├── wnode-sdk-ts/      # TypeScript SDK
│   └── wnode-ui-adapter/  # UI adapter layer
├── contracts/             # Smart contracts
│   ├── foundry/           # Foundry (Solidity) contracts
│   └── hardhat/           # Hardhat deployment & testing
├── services/              # Backend services
│   └── nodld/             # Go daemon (API, libp2p, scheduling)
├── sdks/                  # Language-specific SDKs
│   └── wnode-sdk-go/      # Go SDK with VRF, oracle, mesh
├── integrations/          # 600+ protocol integration specs
├── tools/                 # Operational tooling
│   ├── ai/                # AI subsystem (models, inference)
│   ├── node-operator/     # Operator runtime & installers
│   ├── scripts/           # Shell & Go operational scripts
│   └── tinygo/            # TinyGo WASM compilation targets
├── docs/                  # Canonical documentation
├── assets/                # Brand assets (logos, favicons)
├── infra/                 # Infrastructure configs
├── archive/               # Archived legacy & reference material
└── .github/               # CI/CD workflows
```

## Quick Start

### Prerequisites

- **Node.js** ≥ 20 LTS
- **pnpm** ≥ 9
- **Go** ≥ 1.22 (for backend daemon)

### Development

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev:all

# Start a single app
cd apps/mesh && pnpm dev
```

### Smart Contracts

```bash
cd contracts/foundry
forge build && forge test

cd contracts/hardhat
npx hardhat compile
```

## Documentation

Full documentation lives in [`/docs/`](docs/INDEX.md) and is rendered at [wnode.one/docs](https://wnode.one/docs).

| Area | Path |
|---|---|
| Architecture | [`docs/architecture/`](docs/architecture/) |
| Security Model | [`docs/security/`](docs/security/) |
| Governance & Economics | [`docs/governance/`](docs/governance/) / [`docs/economics/`](docs/economics/) |
| Developer Guide | [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) |
| Node Operator Guide | [`docs/operator/`](docs/operator/) |
| API Reference | [`docs/api/`](docs/api/) |
| Integration Catalog | [`integrations/`](integrations/) |

## Apps

| App | Description |
|---|---|
| **Command** | Internal CRM, operations dashboard, and mesh task management |
| **Mesh** | Client-facing portal for job submission and monitoring |
| **Nodlr** | Node operator onboarding, dashboard, and affiliate tracking |
| **Web** | Public-facing website with rendered documentation |
| **Wnoder** | Wnoder operator management portal |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for peer-review mandates and submission rules.

## Integrity & Versioning

- **Version**: `v1.0`
- **Specification Checksum**: `218b565a3be22ee9a39e580ae07605e87394864f170e35b7694f8f4311c447bd`

For release history, see [RELEASE_NOTES.md](RELEASE_NOTES.md).

## License

This project is licensed under the Business Source License 1.1 — see [LICENSE](LICENSE) for details.

---

<div align="center">
<sub>Built by the Wnode Foundation · Sovereign compute for a decentralized world</sub>
</div>
