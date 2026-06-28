# Wnode Workflow Engine

Workflows in Wnode are deterministic, state-machine executions defined in JSON.

## Determinism
To execute in Wnode, workflows must have strict determinism parameters:
- `requireFinalized`: The engine explicitly forces `blockTag: finalized` across all read nodes.
- No random branching: Conditionals must rely solely on deterministic contract state.
- No time-based branching: Block timestamp branching must be anchored to a specific `blockHash`.

## Schema
Workflows follow the `1.0` JSON schema natively parsed by the `WorkflowEngineAdapter`.

```json
{
  "version": "1.0",
  "steps": [
    {
      "id": "step_1",
      "action": "readContract",
      "params": { ... }
    }
  ]
}
```

## Security Guarantees
Workflows run strictly within a secure sandbox environment (or via adapters). The engine will never execute an arbitrary binary or mutate Wnode global state, it only outputs deterministic arrays of `CalldataResult`.
