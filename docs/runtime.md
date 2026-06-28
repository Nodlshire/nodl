# Wnode Runtime & Operator Guide

The Wnode Sovereign Node CLI allows node operators to bootstrap the deterministic execution runtime, inspect proofs, and tail structured audit logs.

## Bootstrapping a Node
Run the following to initialize the Runtime Validation Layer and start accepting workflows:
```bash
wnode start
```
*Note: The CLI explicitly checks for strict determinism and requires an RPC endpoint that supports finalized block queries. If this is missing, the node will refuse to start.*

## Observability & Logging
Wnode nodes output structured JSON lines for deterministic verification. You can tail these live:
```bash
wnode logs --tail
```
Logs contain `chainId`, `timestamp`, `sdkVersion`, and `blockTag` injections.

## Workflow Execution & Inspection
To manually trigger a workflow and observe the deterministic trace:
```bash
wnode workflow run <workflowId>
```
To inspect the resulting `ProofOfCompute` schema:
```bash
wnode proof inspect <workflowId>
```
