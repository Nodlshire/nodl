# Wnode Architecture & Engineering Rules

## 1. Zero Synthetic / Test Data Retention Policy
- **Hard Rule:** No fake, synthetic, mock, or test node data is allowed to persist in production state after any code revision, test execution, or diagnostic sweep.
- **Immediate Mandatory Purge:** All mock nodes, synthetic UPIDs, placeholder tokens, and offline test records must be completely purged from `state/engine.json`, the `nodld` Go backend, CMD database, and Nodlr registries after every revision.
- **Production Cleanliness:** Only real, hardware-backed user nodes (such as active node `HN-c66a3de1`) are permitted to exist in the live state file. Every test script and deployment routine must clean up transient test records automatically upon completion.
