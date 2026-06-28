# Wnode SDK Reference

The Wnode SDK provides a deterministic, pure-calldata execution environment for integrating Web3 protocols into the Sovereign Mesh.

## Core Principles
1. **Strict Determinism**: All RPC reads must anchor to a `finalized` block tag or explicit `blockHash`. Unsafe tags like `blockNumber` throw `WnodeDeterminismError`.
2. **Non-Custodial**: The SDK never handles private keys, never signs transactions, and never broadcasts to networks. It strictly builds calldata.
3. **Verifiable**: All workflows automatically emit a `ProofOfCompute` schema containing `stepHashes` and a `merkleRoot`.

## WnodeClient (TypeScript)
```typescript
import { WnodeClient } from '@wnode/sdk';

const client = new WnodeClient({
  endpoint: process.env.RPC_URL,
  chainId: 1,
  sdkVersion: '1.0.0',
  strictDeterminism: true
});

// Deterministic Read
const result = await client.readContract({
  address: '0x...',
  abi: ['function getPrice() view returns (uint256)'],
  functionName: 'getPrice',
  blockTag: 'finalized'
});
```

## WnodeClient (Go)
```go
import "github.com/wnodeltd/wnode/wnode-sdk-go"

client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
    Endpoint:          "http://rpc...",
    ChainID:           1,
    SDKVersion:        "1.0.0",
    StrictDeterminism: true,
})
```
