# Contributing to the Sovereign Mesh Specification

All changes to the Wnode Sovereign Mesh architecture, execution semantics, or tokenomics must undergo strict peer review.

## Proposal Process
1. **Open a Discussion**: Raise an issue describing the limitation in the current v1.0 specification.
2. **Draft a Formal PR**: All pull requests must respect the following constraints:
   - Modifications to state invariants must prove adherence to `S(n+1) = f(S(n), P)`.
   - Threat model additions must classify under the established adversarial models.
   - Any architectural SVGs must adhere to the 1.5px monochrome (`#111`, `#444`, `#888`) standard.
3. **Governance Review**: Your PR must be submitted for a DAO timelock review as defined in [GOVERNANCE.md](GOVERNANCE.md).

*Direct, unverified pushes to the `/docs/v1.0/` specification tree are strictly prohibited.*
