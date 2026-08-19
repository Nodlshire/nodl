# Wnode Architecture & Engineering Rules

## 1. Zero Synthetic / Test Data Retention Policy
- **Hard and Fast Rule:** No fake, synthetic, or test data is allowed to persist after any test, benchmark, or forensic diagnostic suite.
- **Immediate Mandatory Purge:** All test nodes, synthetic UPIDs, placeholder tokens, and offline demo records must be completely purged from the SOT engine (`nodld`), CMD database, and Nodlr registries immediately upon test completion.
- **Production Cleanliness:** Every test script, verification utility, and automation harness must invoke `POST /api/v1/nodes/purge-all-test-data` upon teardown to guarantee that only real, active user nodes remain in system state.
