import json
import os
import shutil

wuid = "190007-0617-26-IN"
name = "Bluefin"
category = "Derivatives / Concentrated Liquidity DEX"
desc = "Sui derivatives DEX and concentrated liquidity AMM."
base_path = "/home/obregan/Documents/nodl/integrations/bluefin"

with open(f"{base_path}/protocol.json", "r") as f:
    protocol = json.load(f)

# integration.json
integration = {
    "name": name,
    "category": category,
    "description": desc,
    "endpoints": ["https://dapi.api.sui-prod.bluefin.io", "wss://dapi.api.sui-prod.bluefin.io"],
    "activation": "Pending",
    "version": "1.0.0",
    "id": wuid
}
with open(f"{base_path}/integration.json", "w") as f:
    json.dump(integration, f, indent=2)

# manifest.json
manifest = {
    "name": name,
    "type": "protocol",
    "version": "1.0.0",
    "wuid": wuid,
    "dependencies": ["@firefly-exchange/bluefin-v2-client-ts"]
}
with open(f"{base_path}/manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

# metadata.json
shutil.copy(f"{base_path}/protocol.json", f"{base_path}/metadata.json")

# synopsis.md
synopsis = f"""# {name} Integration Synopsis
**WUID:** {wuid}
**Category:** {category}

{name} is a {desc}

## Architecture
Off-chain orderbook with on-chain settlement layer on Sui Blockchain.
"""
with open(f"{base_path}/synopsis.md", "w") as f:
    f.write(synopsis)

# sdk.ts
sdk = """import { BluefinClient, Networks } from '@firefly-exchange/bluefin-v2-client-ts';

export class BluefinIntegration {
    private client: BluefinClient;

    constructor(privateKey: string) {
        this.client = new BluefinClient(Networks.PRODUCTION_SUI, privateKey);
    }

    async init() {
        await this.client.init();
    }

    async createAndPostOrder(market: string, side: 'BUY' | 'SELL', price: number, quantity: number) {
        const order = this.client.createSignedOrder({ market, side, price, quantity });
        return await this.client.postOrder(order);
    }
}
"""
with open(f"{base_path}/sdk.ts", "w") as f:
    f.write(sdk)

# test_bluefin.ts
test_bluefin = """import { BluefinIntegration } from './sdk';

async function runTests() {
    console.log('Testing Bluefin Integration...');
    // Mock private key for testing
    const integration = new BluefinIntegration('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    console.log('Integration initialized.');
}
runTests();
"""
with open(f"{base_path}/test_bluefin.ts", "w") as f:
    f.write(test_bluefin)

# activation files
with open(f"{base_path}/activation_logo.txt", "w") as f:
    f.write("URL: https://bluefin.io/logo.png")
with open(f"{base_path}/activation_status.txt", "w") as f:
    f.write("Status: Pending Validation")

print("Files generated.")
