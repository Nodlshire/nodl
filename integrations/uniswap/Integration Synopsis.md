# Uniswap — Integration Synopsis

## 1. Summary
The Uniswap integration operates in the `Protocol` domain. 

**Purpose:** # Uniswap V3 Integration  Uses `@uniswap/v3-sdk` for routing.

## 2. What This Integration Does
**Core SDK Capabilities Exposed:**
- `uniswap()`
- `createTrade()`

**Endpoints Detected:**
- `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

## 3. How It Generates Revenue
- **Direct revenue:** No explicit direct revenue documented.
- **Indirect revenue:** No explicit indirect revenue documented.

## 4. Integration Files & Artifacts
- **activation_sdk.txt** — SDK logic / implementation — `./activation_sdk.txt`
- **activation_manifest.txt** — Capabilities & metadata — `./activation_manifest.txt`
- **activation_status.txt** — Health check execution — `./activation_status.txt`
- **activation_docs.txt** — Official documentation & setup — `./activation_docs.txt`
- **activation_logo.txt** — Integration asset — `./activation_logo.txt`
- **integration.md** — Integration asset — `./integration.md`
- **manifest.json** — Capabilities & metadata — `./manifest.json`
- **sdk.ts** — SDK logic / implementation — `./sdk.ts`
- **status.json** — Health check execution — `./status.json`
- **integration.json** — Integration asset — `./integration.json`

## 5. Revenue Streams
- **Direct:** No explicit direct revenue documented.
- **Indirect:** No explicit indirect revenue documented.
- **Classification:** Both

## 6. External Documentation & API Links
- **Link:** https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
- **Link:** https://cryptologos.cc/logos/uniswap-uni-logo.svg
- **Link:** https://docs.uniswap.org/sdk/v3/overview

## 7. Machine‑Readable Summary Block
```json
{
  "integration": "Uniswap",
  "domain": "Protocol",
  "revenue_model": {
    "direct": false,
    "indirect": false,
    "classification": "Both"
  },
  "files": [
    "activation_sdk.txt",
    "activation_manifest.txt",
    "activation_status.txt",
    "activation_docs.txt",
    "activation_logo.txt",
    "integration.md",
    "manifest.json",
    "sdk.ts",
    "status.json",
    "integration.json"
  ],
  "docs": [
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    "https://cryptologos.cc/logos/uniswap-uni-logo.svg",
    "https://docs.uniswap.org/sdk/v3/overview"
  ]
}
```
