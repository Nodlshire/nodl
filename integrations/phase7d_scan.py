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
  "scanned": 0,
  "missing_directories": [],
  "protocols": []
}

for protocol in protocols:
    summary["scanned"] += 1
    folder_path = os.path.join(base_dir, protocol)
    
    if not os.path.exists(folder_path):
        summary["missing_directories"].append(protocol)
        summary["protocols"].append({
            "protocol": protocol,
            "directory_exists": False,
            "files": {
                "validation_report_md": "absent",
                "integration_synopsis_md": "absent",
                "activation_manifest_txt": "absent",
                "activation_sdk_txt": "absent",
                "activation_docs_txt": "absent",
                "integration_md": "absent",
                "sdk_ts": "absent"
            },
            "directory_empty": True,
            "notes": "Directory missing"
        })
        continue

    files_in_dir = os.listdir(folder_path)
    
    val_report = "present" if "validation_report.md" in files_in_dir else "absent"
    synopsis = "present" if "Integration Synopsis.md" in files_in_dir else "absent"
    manifest = "present" if "activation_manifest.txt" in files_in_dir else "absent"
    sdk_txt = "present" if "activation_sdk.txt" in files_in_dir else "absent"
    docs_txt = "present" if "activation_docs.txt" in files_in_dir else "absent"
    integration_md = "present" if "integration.md" in files_in_dir else "absent"
    sdk_ts = "present" if "sdk.ts" in files_in_dir else "absent"
    
    is_empty = len([f for f in files_in_dir if not f.startswith(".")]) == 0
    
    notes = ""
    if is_empty:
        notes = "Directory is empty"
    
    summary["protocols"].append({
        "protocol": protocol,
        "directory_exists": True,
        "files": {
            "validation_report_md": val_report,
            "integration_synopsis_md": synopsis,
            "activation_manifest_txt": manifest,
            "activation_sdk_txt": sdk_txt,
            "activation_docs_txt": docs_txt,
            "integration_md": integration_md,
            "sdk_ts": sdk_ts
        },
        "directory_empty": is_empty,
        "notes": notes
    })

with open("/home/obregan/Documents/nodl/integrations/scan_output.json", "w") as f:
    json.dump(summary, f, indent=2)

print("Scan complete. Results saved to scan_output.json")
