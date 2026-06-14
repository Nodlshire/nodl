import os
import json

protocols = [
  "evmos", "exorde", "factom", "fantom", "farcaster", "farcasterframes", "farcasterhubs", "farcasterwarpcast", 
  "feathercoin", "fhenix", "filebase", "filecoin", "flare", "flashbots", "fluencelabs", "forta", "foundry", 
  "frax", "fuel", "fuse", "galadriel", "galxe", "gateio", "gcp", "gelato", "gelatoops", "geminis", "genlayer", 
  "genshiro", "gitcoin", "glif", "gmx", "gnolang", "gnosis", "gnosischain", "gnosissafe", "gnosissafeapps", 
  "goldfinch", "goldsky", "golem", "gravitybridge", "griptape", "gro", "groestlcoin", "gton", "harmony", 
  "hashflow", "hedera", "helius", "herodotus", "hive", "hivemapper", "holograph", "hopprotocol", "hopr", 
  "hydradx", "hyperlane", "hyperliquid", "icon", "icp", "immunefi", "immutablex", "indexcoop", "infstones", 
  "infura", "injective", "ink", "integritee", "interchain", "interlay", "io.net", "iota", "iotex", "ipfs", 
  "irisnet", "ironfish", "jito", "joystream", "jumperexchange", "juno", "kadena", "kakarot", "karura", "kaspa", 
  "kava", "kelpdao", "khala", "ki", "kilt", "kinto", "kintsugi", "klaytn", "koinos", "komodo", "kroma", "kusama", 
  "kwenta", "kyber", "kyve", "layerzero"
]

base_dir = "/home/obregan/Documents/nodl/integrations"

summary = {
  "batch_number": 3,
  "processed": 0,
  "success": 0,
  "failed": 0,
  "failures": [],
  "completed_integrations": []
}

# Empty Gemini JSON data since none was provided
gemini_data_map = {}

for protocol in protocols:
    summary["processed"] += 1
    folder_path = os.path.join(base_dir, protocol)
    
    if not os.path.exists(folder_path):
        summary["failed"] += 1
        summary["failures"].append({
            "protocol": protocol,
            "reason": "Integration directory missing",
            "missing_files": [],
            "invalid_fields": []
        })
        continue

    # Load local files
    local_files = {}
    for f in ["activation_manifest.txt", "activation_sdk.txt", "activation_docs.txt", "integration.md", "sdk.ts", "integration_report.md"]:
        f_path = os.path.join(folder_path, f)
        if os.path.exists(f_path):
            with open(f_path, "r", encoding="utf-8") as file_obj:
                local_files[f] = file_obj.read()

    # We merge with an empty object since the user did not provide Gemini JSON
    gemini_data = gemini_data_map.get(protocol, {})

    # Generate Integration Synopsis.md
    synopsis_content = f"""# {protocol.title()} — Integration Synopsis

## 1. Summary
No external Gemini research provided. Generated from local files only.

## 2. What This Integration Does
Standard RPC/API interaction capability based on local files.
Endpoints: None provided.

## 3. How It Generates Revenue
No explicit direct revenue documented.
No explicit indirect revenue documented.

## 4. Integration Files & Artifacts
"""
    files_list = []
    for f in os.listdir(folder_path):
        if f.endswith(('.txt', '.md', '.ts', '.json', '.svg')):
            files_list.append(f"- **{f}** — Integration asset — `./{f}`")
            
    synopsis_content += "\n".join(files_list) + "\n"

    synopsis_content += f"""
## 5. Revenue Streams
- **Direct:** None
- **Indirect:** None
- **Classification:** Both

## 6. External Documentation & API Links
- No external URLs detected.

## 7. Machine‑Readable Summary Block
```json
{{
  "integration": "{protocol.title()}",
  "domain": "Protocol",
  "revenue_model": {{
    "direct": false,
    "indirect": false
  }},
  "files": {json.dumps(os.listdir(folder_path))},
  "docs": []
}}
```
"""
    with open(os.path.join(folder_path, "Integration Synopsis.md"), "w", encoding="utf-8") as f:
        f.write(synopsis_content)

    # Generate validation_report.md
    # Everything fails because we lack the external data and real logic
    validation_content = f"""# Validation Report: {protocol.title()}

- Activation Readiness: false
- Revenue Model Validated: false
- Endpoint Validation: fail
- SDK Validation: fail
- RPC Validation: fail
- MEV/M2M Validation: fail

**Notes:** Validation failed. No external Gemini JSON data provided to validate against. Local files are insufficient for full activation readiness.
"""
    report_path = os.path.join(folder_path, "validation_report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(validation_content)

    summary["success"] += 1
    summary["completed_integrations"].append({
        "protocol": protocol,
        "activation_ready": False,
        "revenue_validated": False,
        "validation_report_path": report_path
    })

print(json.dumps(summary, indent=2))
