# Uniswap V3 — Integration Synopsis

## 1. Summary
Uniswap V3 is a decentralized trading protocol and Automated Market Maker (AMM) operating within the Decentralized Exchange (DEX) and concentrated liquidity domain. Inside the Wnode / Mesh ecosystem, it provides automated, on-chain liquidity routing and token swapping capabilities. This integration exists to enable autonomous agents and machine-to-machine (M2M) billing layers to reliably swap assets, route stablecoins, and manage decentralized treasury operations utilizing the deepest liquidity pools in DeFi.

## 2. What This Integration Does
The integration enables direct interaction with Uniswap V3's concentrated liquidity AMM, tick-based price bands, and virtual liquidity math. It leverages both on-chain immutability and off-chain execution models (like Dutch auctions via UniswapX reactors).

**API / RPC Endpoints Called:**
- **REST:** `https://trade-api.gateway.uniswap.org/v1/quote`, `https://trade-api.gateway.uniswap.org/v1/swap`, `https://trade-api.gateway.uniswap.org/v1/order`, `https://trade-api.gateway.uniswap.org/v1/orders`
- **GraphQL:** `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`
- **RPC:** `eth_sendRawTransaction`, `eth_call`, `eth_estimateGas`

**Smart Contracts Interacted With:**
- `UniswapV3Factory`, `UniswapV3Pool`, `NonfungiblePositionManager`, `Universal Router`, `Permit2`, `UniswapX reactors`
- **Core Functions:** `IUniswapV3PoolActions.swap()`, `IUniswapV3PoolActions.mint()`, `IUniswapV3PoolActions.burn()`, `IUniswapV3PoolState.slot0()`, `IUniswapV3PoolState.ticks()`

**SDK Routing Logic:**
- Uses `@uniswap/v3-sdk` and `@uniswap/sdk-core`.
- Local implementation uses `createTrade(route, amount)` to build `Trade.createUncheckedTrade`.
- Utilizes `AlphaRouter.route()`, `CurrencyAmount.fromRawAmount()`.

**MEV / M2M Relevance:**
- **MEV:** Supports MEV via UniswapX Dutch auctions, Priority Order bidding, and RFQ exclusivity windows. Protects trades via strict slippage limits, quote deadlines (250-500ms), and PFDA MEV internalization.
- **M2M:** Nonce-based idempotency and off-chain EIP-712 order hashes prevent replay attacks, making the `/v1/swap` endpoints safe for automatable agent pipelines.

## 3. How It Generates Revenue
The Uniswap V3 architecture generates both direct and indirect revenue streams through LP fee structures and protocol economic security mechanics.

- **Direct Revenue:** Captures Liquidity Provider (LP) fees across established pool tiers (0.01%, 0.05%, 0.30%, 1.00%) and routes a Protocol fee share (1/4 or 1/6 depending on the pool tier).
- **Indirect Revenue:** Drives tokenomic value via UNI burn through the PFDA mechanism, captures Sequencer fee routing on Unichain, and aggregator hook burns.
- **Classification:** Both

## 4. Integration Files & Artifacts
- **Integration Synopsis.md** — Consolidated protocol architecture and revenue classification — `./Integration Synopsis.md`
- **activation_docs.txt** — Setup documentation and initial SDK usage examples — `./activation_docs.txt`
- **activation_logo.txt** — Text reference for the brand logo — `./activation_logo.txt`
- **activation_manifest.txt** — Subgraph endpoints and integration metadata — `./activation_manifest.txt`
- **activation_sdk.txt** — Route mapping and Trade creation logic using V3 SDK — `./activation_sdk.txt`
- **activation_status.txt** — Health check execution logic — `./activation_status.txt`
- **integration.json** — Legacy integration metadata structure — `./integration.json`
- **integration.md** — Legacy integration overview — `./integration.md`
- **manifest.json** — Secondary manifest configuration — `./manifest.json`
- **sdk.ts** — Core SDK export and connectivity stub — `./sdk.ts`
- **status.json** — Simple status representation — `./status.json`
- **uniswaplogo.svg** — Official SVG brand asset — `./uniswaplogo.svg`

## 5. Revenue Streams
- **Direct:** LP fees across pool tiers (0.01% - 1.00%) and structural protocol fee shares (1/4 to 1/6 of LP fees).
- **Indirect:** PFDA mechanism UNI burns, aggregator hook burns, and Unichain sequencer fee routing.
- **Classification:** Both

## 6. External Documentation & API Links
- **Official Docs:** `https://docs.uniswap.org`, `https://developers.uniswap.org`, `https://uniswap-v3.readthedocs.io`
- **Whitepaper:** `https://app.uniswap.org/whitepaper-v3.pdf`
- **SDK / GitHub:** `https://github.com/Uniswap/v3-core`, `https://github.com/Uniswap/v3-periphery`, `https://github.com/Uniswap/deploy-v3`, `https://github.com/Uniswap/v3-subgraph`, `https://github.com/Uniswap/uniswapx-service`
- **Technical Endpoints:** `https://trade-api.gateway.uniswap.org/v1/quote`, `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

## 7. Machine‑Readable Summary Block
```json
{
  "integration": "Uniswap V3",
  "domain": "DEX / Concentrated Liquidity AMM",
  "capabilities": [
    "Concentrated liquidity provision",
    "Tick-based swapping",
    "EIP-712 auth",
    "Dutch auctions via UniswapX"
  ],
  "revenue_model": {
    "direct": true,
    "indirect": true,
    "classification": "Both"
  },
  "files": [
    "Integration Synopsis.md",
    "activation_docs.txt",
    "activation_logo.txt",
    "activation_manifest.txt",
    "activation_sdk.txt",
    "activation_status.txt",
    "integration.json",
    "integration.md",
    "manifest.json",
    "sdk.ts",
    "status.json",
    "uniswaplogo.svg"
  ],
  "docs": [
    "https://docs.uniswap.org",
    "https://developers.uniswap.org",
    "https://uniswap-v3.readthedocs.io",
    "https://app.uniswap.org/whitepaper-v3.pdf",
    "https://github.com/Uniswap/v3-core",
    "https://github.com/Uniswap/v3-periphery",
    "https://github.com/Uniswap/deploy-v3",
    "https://github.com/Uniswap/v3-subgraph",
    "https://github.com/Uniswap/uniswapx-service"
  ]
}
```
