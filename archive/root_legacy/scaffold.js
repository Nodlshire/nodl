const fs = require('fs');
const path = require('path');

const integrations = [
  { group: 'blockchain', names: ['ethereum', 'polygon', 'solana', 'cosmos', 'arbitrum', 'optimism', 'base', 'avalanche', 'bnb', 'near', 'polkadot', 'cardano', 'aptos', 'sui', 'fantom'] },
  { group: 'storage', names: ['filecoin', 'ipfs', 'arweave', 'storj', 'sia'] },
  { group: 'oracles', names: ['chainlink', 'pyth', 'band', 'api3', 'tellor'] },
  { group: 'identity', names: ['ens', 'dns', 'unstoppable', 'worldcoin', 'gitcoin_passport'] },
  { group: 'web2', names: ['http', 'rest', 'graphql', 'github', 'twitter', 'discord', 'telegram'] },
  { group: 'payments', names: ['stripe', 'paypal', 'coinbase_commerce', 'circle', 'square'] },
  { group: 'messaging', names: ['smtp', 'slack_webhook', 'twilio', 'sendgrid', 'aws_sns', 'firebase', 'pusher', 'matrix'] }
];

const tsTemplate = (name) => `import { IntegrationAdapter, IntegrationResult, CapabilitySet, DeterminismProfile, SecurityProfile } from '../adapter';

export class ${name.charAt(0).toUpperCase() + name.slice(1)}Adapter implements IntegrationAdapter {
  name = '${name}';
  version = '1.0.0';

  async fetch(params: any): Promise<IntegrationResult<any>> {
    return { data: null, payloadHash: 'mock-hash', integrityProof: 'mock-proof' };
  }

  async submit(params: any): Promise<IntegrationResult<any>> {
    return { result: null, payloadHash: 'mock-hash', integrityProof: 'mock-proof' };
  }

  async validate(params: any): Promise<IntegrationResult<boolean>> {
    return { ok: true, payloadHash: 'mock-hash', integrityProof: 'mock-proof' };
  }

  capabilities(): CapabilitySet {
    return { canFetch: true, canSubmit: true, canValidate: true };
  }

  determinismProfile(): DeterminismProfile {
    return { isPurelyDeterministic: true, reliesOnTime: false, reliesOnRandomness: false };
  }

  securityProfile(): SecurityProfile {
    return { requiresSecrets: false, readOnly: false, writeEnabled: true };
  }
}
`;

const goTemplate = (name) => `package ${name}

import (
	"github.com/wnode/sdk-go/integrations"
)

type ${name.charAt(0).toUpperCase() + name.slice(1)}Adapter struct{}

func New${name.charAt(0).toUpperCase() + name.slice(1)}Adapter() *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter {
	return &${name.charAt(0).toUpperCase() + name.slice(1)}Adapter{}
}

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) Name() string { return "${name}" }
func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) Version() string { return "1.0.0" }

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *${name.charAt(0).toUpperCase() + name.slice(1)}Adapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
`;

const tsBase = path.join(__dirname, 'packages/wnode-sdk-ts/src/integrations');
const goBase = path.join(__dirname, 'wnode-sdk-go/integrations');

for (const group of integrations) {
  const tsGroupDir = path.join(tsBase, group.group);
  const goGroupDir = path.join(goBase, group.group);

  fs.mkdirSync(tsGroupDir, { recursive: true });
  fs.mkdirSync(goGroupDir, { recursive: true });

  for (const name of group.names) {
    fs.writeFileSync(path.join(tsGroupDir, name + '.ts'), tsTemplate(name));
    fs.writeFileSync(path.join(goGroupDir, name + '.go'), goTemplate(name));
  }
}

console.log('Successfully generated 50 integrations in TS and Go.');
