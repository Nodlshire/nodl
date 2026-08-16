# SDK Installation Guide


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **SDK Installation Guide** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



## Supported Languages

Wnode SDK provides deterministic, parity-aligned bindings for three languages:

### Node.js / TypeScript
- node >= 20.x
- TypeScript >= 5.x
- ESM-first, strict mode
- No hidden globals, no implicit polyfills

### Python
- python >= 3.11
- venv or virtualenv required
- No global installs
- Deterministic dependency pinning via requirements.txt or pyproject.toml

### Go
- go >= 1.22
- Modules-only
- No GOPATH legacy mode
- Reproducible builds enforced via go.mod version pinning

All languages expose identical semantics:
- same job model
- same metadata fields
- same routing hints
- same determinism guarantees

If a language cannot guarantee deterministic behavior, it is not eligible for SDK parity.

---

## Package Managers

### Node.js / TypeScript
npm:
```bash
npm install @wnode/sdk
```
