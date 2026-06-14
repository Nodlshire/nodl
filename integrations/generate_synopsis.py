import os
import re
import json

base_dir = "/home/obregan/Documents/nodl/integrations"

def extract_urls(folder_path):
    urls = set()
    url_pattern = re.compile(r'https?://[^\s)\]"\']+')
    for root, _, files in os.walk(folder_path):
        for f in files:
            if f == "Integration Synopsis.md": continue
            if not f.endswith(('.txt', '.md', '.ts', '.json')): continue
            try:
                with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                    content = file.read()
                    matches = url_pattern.findall(content)
                    for match in matches:
                        urls.add(match)
            except Exception:
                pass
    return sorted(list(urls))

def get_manifest_data(folder_path, dir_name):
    manifest_path = os.path.join(folder_path, 'activation_manifest.txt')
    name = dir_name.title()
    domain = "protocol"
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, 'r', encoding='utf-8') as file:
                data = json.loads(file.read())
                name = data.get('name', name)
                domain = data.get('domain', domain)
        except Exception:
            pass
    return name, domain

processed_count = 0

for dir_name in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, dir_name)
    if not os.path.isdir(folder_path):
        continue

    # Get data
    name, domain = get_manifest_data(folder_path, dir_name)
    urls = extract_urls(folder_path)
    
    # Collect files
    file_list = []
    file_names_only = []
    for root, _, files in os.walk(folder_path):
        for f in files:
            if f == "Integration Synopsis.md": continue
            rel_path = os.path.relpath(os.path.join(root, f), folder_path)
            file_names_only.append(f)
            desc = "Integration artifact"
            if "sdk" in f.lower(): desc = "SDK logic"
            elif "manifest" in f.lower(): desc = "Metadata and capabilities"
            elif "status" in f.lower(): desc = "Health checks"
            elif "docs" in f.lower(): desc = "Documentation"
            elif "report" in f.lower(): desc = "Technical report"
            elif "logo" in f.lower(): desc = "Brand asset"
            
            file_list.append(f"- **{f}** — {desc} — `./{rel_path}`")
            
    # Revenue defaults
    direct_rev = False
    indirect_rev = True
    rev_class = "Indirect"
    rev_direct_desc = "None"
    rev_indirect_desc = f"Facilitates platform volume, ecosystem routing, and Wnode core capability expansion via {name} services."
    
    domain_lower = domain.lower()
    if "psp" in domain_lower or "billing" in domain_lower or "mev" in domain_lower or "dex" in domain_lower or "bridge" in domain_lower or "block-builder" in domain_lower:
        direct_rev = True
        rev_class = "Both" if indirect_rev else "Direct"
        rev_direct_desc = f"Captures direct value via transaction routing, spreads, or automated fee extraction across {name}."
    
    # Write Synopsis
    synopsis_path = os.path.join(folder_path, "Integration Synopsis.md")
    
    content = f"""# {name} — Integration Synopsis

## 1. Summary
This integration connects Wnode to {name}, operating within the `{domain}` domain. It enables seamless cross-platform functionality within the Mesh and M2M billing layers, ensuring that autonomous agents can interact with {name} directly. This integration exists to expand the Wnode ecosystem's protocol coverage and decentralization.

## 2. What This Integration Does
- **Core Functionality:** Standardizes API/RPC interactions with {name}.
- **For Agents:** Provides a secure, authenticated interface to execute logic on {name} without manual key management.
- **For Users:** Abstracts the complexity of {name}, allowing users to deploy workflows that leverage its features natively.
- **Special Capabilities:** Full alignment with the M2M orchestration layer and AP4M standards.

## 3. How It Generates Revenue
This integration generates **{rev_class.lower()}** revenue.
- **Direct revenue:** {rev_direct_desc}
- **Indirect revenue:** {rev_indirect_desc}

## 4. Integration Files & Artifacts
{chr(10).join(file_list) if file_list else "- No artifacts found."}

## 5. Revenue Streams
- **Direct:** {rev_direct_desc}
- **Indirect:** {rev_indirect_desc}
- **Classification:** {rev_class}

## 6. External Documentation & API Links
"""
    if urls:
        for u in urls:
            content += f"- **Link:** {u}\n"
    else:
        content += "- No external URLs detected in artifacts.\n"
        
    content += f"""
## 7. Machine‑Readable Summary Block
```json
{{
  "integration": "{name}",
  "domain": "{domain}",
  "revenue_model": {{
    "direct": {str(direct_rev).lower()},
    "indirect": {str(indirect_rev).lower()}
  }},
  "files": {json.dumps(file_names_only)},
  "docs": {json.dumps(urls)}
}}
```
"""
    with open(synopsis_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    processed_count += 1

print(f"Generated {processed_count} Integration Synopsis files successfully.")
