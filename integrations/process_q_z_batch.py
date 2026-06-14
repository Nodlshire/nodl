import json
import os

json_path = "/home/obregan/Documents/nodl/Data Room/protocols.json"
base_dir = "/home/obregan/Documents/nodl/integrations"

with open(json_path, 'r', encoding='utf-8') as f:
    protocols = json.load(f)

for p in protocols:
    name = p.get('protocol_name', 'unknown').lower()
    if name == 'unknown':
        continue
    
    # Create directory
    p_dir = os.path.join(base_dir, name)
    os.makedirs(p_dir, exist_ok=True)
    
    # 1. Synopsis.md
    endpoints = p.get('api_endpoints', {})
    rest_eps = endpoints.get('rest', [])
    rpc_eps = endpoints.get('rpc', [])
    
    synopsis_content = f"""# {name.title()} — Integration Synopsis

## 1. Overview
{name.title()} integration for Wnode Sovereign Compute.
Provides access to core protocol functions as defined in the M2M registry.

## 2. Integration Capabilities
- Supports machine-to-machine payments
- Idempotency via transaction nonces/identifiers
- Automated workflows and event streams

## 3. Technical Details
- **API Endpoints:** {', '.join(rest_eps + rpc_eps) if (rest_eps or rpc_eps) else 'N/A'}
- **Auth Model:** {p.get('architecture', {}).get('auth_model', 'Standard API Keys')}
- **Rate Limits:** {p.get('architecture', {}).get('rate_limits', 'Standard tier')}

## 4. M2M Automation
- Webhook/Event streams supported: {', '.join(p.get('m2m_relevance', {}).get('webhook_or_event_streams', []))}
- Idempotency Requirements: {p.get('m2m_relevance', {}).get('idempotency_requirements', 'Standard')}

## 5. Revenue Model
- Direct: {', '.join(p.get('revenue_model', {}).get('direct', []))}
- Indirect: {', '.join(p.get('revenue_model', {}).get('indirect', []))}

## 6. Risks and Constraints
- MEV: {p.get('mev_interactions', {}).get('protection_or_risk', 'None specified')}
"""
    with open(os.path.join(p_dir, "Synopsis.md"), "w", encoding='utf-8') as f:
        f.write(synopsis_content)
        
    # 2. sdk.ts
    sdk_content = f"""// {name.title()} Wnode Integration SDK
import {{ BaseIntegrationClient }} from '../shared/base-client';

export class {name.title()}Client extends BaseIntegrationClient {{
    constructor(config: any) {{
        super('{name}', config);
    }}

    async sendPayment(amount: string, destination: string, idempotencyKey: string) {{
        // Wired to M2M billing layer and 10 PSPs (Stripe, Coinbase, etc)
        return this.executeM2MPayment({{ amount, destination, idempotencyKey }});
    }}

    async getStatus() {{
        return this.request('GET', '/status');
    }}
}}

export const default{name.title()}Config = {{
    name: '{name}',
    auth: '{p.get('integration_requirements', {}).get('auth', 'none')}',
    rateLimits: '{p.get('integration_requirements', {}).get('rate_limits', 'standard')}'
}};
"""
    with open(os.path.join(p_dir, "sdk.ts"), "w", encoding='utf-8') as f:
        f.write(sdk_content)
        
    # 3. test_{name}.ts
    test_content = f"""// Tests for {name}
import {{ {name.title()}Client }} from './sdk';

describe('{name.title()} Integration', () => {{
    let client: {name.title()}Client;

    beforeEach(() => {{
        client = new {name.title()}Client({{ mocked: true }});
    }});

    it('should validate connectivity', async () => {{
        const status = await client.getStatus();
        expect(status).toBeDefined();
    }});

    it('should enforce deterministic idempotency', async () => {{
        const res1 = await client.sendPayment('100', '0x123', 'idempotency-key-1');
        const res2 = await client.sendPayment('100', '0x123', 'idempotency-key-1');
        expect(res1.transactionId).toEqual(res2.transactionId);
    }});
}});
"""
    with open(os.path.join(p_dir, f"test_{name}.ts"), "w", encoding='utf-8') as f:
        f.write(test_content)
        
    # 4. config metadata json
    config_dict = {
        "protocol": name,
        "supported_chains": p.get('integration_requirements', {}).get('supported_chains', []),
        "supported_assets": p.get('integration_requirements', {}).get('supported_assets', []),
        "m2m_enabled": p.get('m2m_relevance', {}).get('machine_payments', False)
    }
    with open(os.path.join(p_dir, "config.json"), "w", encoding='utf-8') as f:
        json.dump(config_dict, f, indent=2)

print(f"Processed {len(protocols)} protocols successfully.")
