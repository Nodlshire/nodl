# Proof of Compute Viewer

The Proof of Compute Viewer exposes the `ProofOfCompute` JSON schemas to operators and developers, ensuring deterministic data trails can be audited intuitively.

## Validation

The `UIProofAdapter` strictly parses JSON structures to ensure adherence to the `ProofOfCompute v1.0` schema.

```typescript
import { UIProofAdapter, ProofViewer } from '@wnode/ui-adapter';

const adapter = new UIProofAdapter();
const viewer = new ProofViewer(adapter);

const rawProof = fetchLocalProof();

const response = viewer.prepareForDisplay(rawProof);
if (response.ok) {
  // Render response.data.merkleRoot safely
  // Render response.data.stepHashes
} else {
  // Render response.error.message safely
}
```

The Viewer guarantees that missing step hashes or unsupported version properties result in safe, normalized errors (`UNKNOWN_ERROR` / `VALIDATION_FAILED`) rather than unhandled UI crashes.
