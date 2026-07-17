# AI Safety & Advisory Layer

## Overview
The Wnode Sovereign Mesh includes an AI-Assisted Advisory pipeline. This pipeline operates asynchronously to deterministic orchestration, interpreting complex mesh telemetry and generating localized configuration proposals.

## Deterministic Safety Boundary
The system enforces absolute mathematical sovereignty:
1. **Read-Only Context:** The `AIAdvisor` parses deterministic snapshots.
2. **Immutable Proposals:** The AI constructs `pending` recommendations within a transient FIFO memory layer (`maxPendingRecommendations = 1000`).
3. **No Direct Mutability:** The AI pipeline lacks programmatic hooks to invoke the `ConsensusController`.

## Human-In-The-Loop Approval
All AI modifications must be deterministically signed by a cryptographic operator using the `ApprovalFlow`.
- **Validation:** Operator approvals route strictly through standard `ProposeGlobalGovernanceUpdate` state-machines.
- **Race Condition Prevention:** Concurrency locks guarantee a given recommendation ID can only execute identically once. Rejections are permanently deleted.

## Red-Team Verified
The boundary has been successfully penetration-tested via the `TestAIRedTeam_*` test suites to ensure malicious or failing LLMs cannot autonomously bypass mesh governance limits.
