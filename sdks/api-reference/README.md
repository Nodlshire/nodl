# Wnode SDK Canonical API Reference

`VERIFIED_BY_TELEMETRY`

Official Go and WASM SDK integration guide for Wnode Sovereign Mesh.

---

## 🧠 Native Go SDK

```go
package main

import (
    "fmt"
    "github.com/wnodeltd/wnode/sdk"
)

func main() {
    client := sdk.NewTelemetryClient("http://localhost:8080")
    status, err := client.GetNodeStatus()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Node Status: %s, Cores: %d\n", status.Status, status.Cores)
}
```

---

## 🕸️ WASM Envelope Engine

```typescript
import { WasmRunner } from '@wnode/sdk-wasm';

const runner = new WasmRunner({ endpoint: 'http://localhost:8080' });
const result = await runner.submitJob({
    envelopeId: 'env_994821',
    timeoutMs: 5000
});
console.log('Deterministic Result:', result);
```
