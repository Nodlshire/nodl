# 11 — Integration Lifecycle & SOT Synchronization

`VERIFIED_BY_TELEMETRY`

The **Integration Lifecycle** defines how new feature specifications move from idea to documentation, daemon telemetry hooks, and automated Discord notifications.

---

## 📊 Architecture & Workflow

![Integration Lifecycle Flowchart](/assets/illustrations/integrations/lifecycle-flow.svg)

### Lifecycle Stages
1. **Proposal / Specification**: Document feature in `/docs/**` Docs-as-SOT canon.
2. **Daemon Hooks & Telemetry**: Implement REST & WebSocket endpoints in `nodld`.
3. **Telemetry Verification**: Validate state transitions and tag with `VERIFIED_BY_TELEMETRY`.
4. **Discord Integration**: Auto-generate release embeds and operator guides in `#operator-guides` and `#release-notes`.

---

## 🔌 Verification & Automation Hooks

- **Docs Indexer**: Scans `/docs/**` for updates and updates the in-memory SOT index.
- **Operator Guides Engine**: Parses newly added integration specifications and auto-posts structured embeds.
- **Release Notes Engine**: Detects version updates and posts SHA-256 deduplicated release notes.
