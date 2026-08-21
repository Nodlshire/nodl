# Code Examples


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Code Examples** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



This section provides deterministic, production‑grade examples for using the Wnode SDK across multiple languages and interfaces.  
All examples follow sovereign compute rules:
- no signing  
- no randomness  
- no hidden defaults  
- no inference  
- no nondeterministic behavior  

---

## Node.js Example

A minimal deterministic job creation and health check.

```ts
import { WnodeClient, createJob } from '@wnode/sdk';

const client = new WnodeClient({
  endpoint: process.env.WNODE_ENDPOINT,
});

async function main() {
  // Deterministic job definition
  const job = createJob({
    wuid: "developer:example",
    engineType: "compute",
    deliveryMode: "inline",
    routingHints: {
      region: "EU-Core",
      deviceClass: "CPU-general",
      latencyPreference: "balanced",
    },
    shardConfig: {
      count: 1,
      strategy: "deterministic",
    },
    privacyMode: "transparent",
    verificationMode: "deterministic-replay",
  });

  const result = await client.submit(job);
  console.log("Job submitted:", result.jobId);

  const health = await client.health();
  console.log("Mesh health:", health);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
```
