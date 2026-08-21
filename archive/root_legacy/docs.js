const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs/integrations');

const docs = {
  'overview.md': '# Integration Ecosystem Overview\nIntegrations allow deterministic connections to external systems.',
  'registry.md': '# Integration Registry\nThe registry is the deterministic lookup table for all integrations.',
  'adapter.md': '# Integration Adapter\nThe standard interface for building a deterministic integration adapter.',
  'blockchain.md': '# Blockchain Integrations\nWrappers for Ethereum, Solana, and other RPC providers.',
  'storage.md': '# Storage Integrations\nIPFS, Arweave, Filecoin read/write adapters.',
  'oracles.md': '# Oracle Integrations\nChainlink, Pyth price feed wrappers.',
  'web2.md': '# Web2 Integrations\nREST and GraphQL wrappers.',
  'operators.md': '# Operator Guidelines\nHow to enable and monitor integration determinism.'
};

for (const [filename, content] of Object.entries(docs)) {
  fs.writeFileSync(path.join(docsDir, filename), content);
}

console.log('Docs generated.');
