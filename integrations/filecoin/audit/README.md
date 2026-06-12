# Wnode × Filecoin/IPFS — Audit Layer

## Overview

Every machine-to-machine payment settled through Wnode's MEV subsystem
produces a cryptographically signed, content-addressed, permanently archived receipt.

This module transforms Wnode into the **audit infrastructure layer** for the
Mastercard AP4M machine economy — providing immutable, third-party-verifiable
proof of every autonomous payment execution.

---

## Architecture

```
[MEV Agent executes on-chain payment]
         │
         ▼
[WnodeReceiptService.issue(input)]
         │
         ├─ 1. build pre-image (canonical JSON, RFC 8785)
         ├─ 2. BLAKE3 hash → canonicalHash
         ├─ 3. Ed25519 sign → signature
         ├─ 4. pack → CAR file (unixfs-v1-2025, blake3 CIDv1)
         ├─ 5. import → local Kubo IPFS node
         ├─ 6. upload → Lighthouse (IPFS pin + Filecoin deals)
         ├─ 7. index → PostgreSQL receipt_index
         ├─ 8. anchor → Filecoin FVM (WnodeReceiptAnchor.sol)
         └─ 9. dispatch → webhooks (AP4M, PSPs, Aave DAO)
```

---

## Module Map

```
audit/
├── core/
│   ├── receipt.ts       # MachinePaymentReceipt schema + factory
│   ├── hasher.ts        # BLAKE3 + RFC 8785 canonicalization
│   └── signer.ts        # Ed25519 signing + verification
├── storage/
│   ├── car.ts           # CAR packing (unixfs-v1-2025) + Kubo import
│   └── filecoin.ts      # Lighthouse upload, deal status, PDP, StorageRenewalAgent
├── index/
│   ├── receipt-index.ts # PostgreSQL index + FVM anchor client
│   └── WnodeReceiptAnchor.sol  # Filecoin EVM immutable registry contract
├── verification.ts      # Public REST endpoints (Express router)
├── service.ts           # WnodeReceiptService (main orchestrator)
└── __tests__/
    └── audit.test.ts    # Unit tests (vitest)
```

---

## Environment Variables

```bash
# Signing
NODE_PRIVATE_KEY_HEX=          # Ed25519 seed (hex) — required
NODE_PUBLIC_KEY_HEX=           # Matching public key (hex) — required

# IPFS
KUBO_RPC_URL=http://localhost:5001
KUBO_RPC_TOKEN=                # Bearer token (Kubo v0.25+)

# Filecoin
LIGHTHOUSE_API_KEY=            # Lighthouse storage key — required
FVM_RPC_URL=https://api.node.glif.io/rpc/v1
FVM_OPERATOR_PRIVATE_KEY=      # FVM tx signing key
RECEIPT_ANCHOR_CONTRACT=       # WnodeReceiptAnchor deployed address
PDP_VERIFIER_CONTRACT=         # Filecoin Onchain Cloud PDP contract

# Database
DATABASE_URL=                  # PostgreSQL connection string

# Feature Flags
ENABLE_FILECOIN_RECEIPTS=true
ENABLE_FVM_ANCHOR=true
ENABLE_PDP_VERIFICATION=true
```

---

## Dependencies

```json
{
  "@noble/hashes":        "^1.4.0",
  "@noble/ed25519":       "^2.1.0",
  "ipfs-car":             "^1.1.0",
  "multiformats":         "^13.1.0",
  "@lighthouse-web3/sdk": "^0.3.0",
  "json-canonicalize":    "^1.0.6",
  "ethers":               "^6.12.0",
  "pg":                   "^8.12.0",
  "express":              "^4.19.0"
}
```

---

## Verification API

```
GET  /api/v1/receipts/verify/:cid        # single receipt verification
POST /api/v1/receipts/verify/batch       # batch (max 100)
GET  /api/v1/receipts/chain/:agentId     # agent receipt chain
POST /api/v1/receipts/webhooks           # register webhook
```

---

## AP4M / PSP Integration

Each receipt CID is returned to the calling AP4M agent and can be embedded
in its Verifiable Intent. Stripe/Adyen reconciliation uses the batch
verification endpoint. Aave DAO treasury reporting queries by protocolId.

See `service.ts → issueReceipt()` for the single hook MEV agents call
after every successful on-chain execution.
