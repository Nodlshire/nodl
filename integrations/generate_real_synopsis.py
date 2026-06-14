import os
import re
import json

base_dir = "/home/obregan/Documents/nodl/integrations"

def extract_functions(sdk_content):
    matches = re.findall(r'export\s+(?:async\s+)?(?:function|class|const)\s+([a-zA-Z0-9_]+)', sdk_content)
    return list(set(matches))

def extract_endpoints(content):
    matches = re.findall(r'(https?://[^\s)\]"\']+)', content)
    endpoints = [m for m in matches if 'api' in m or 'rpc' in m or 'v1' in m or 'v2' in m or 'graphql' in m]
    return list(set(endpoints))

def extract_revenue(report_content):
    direct = ""
    indirect = ""
    rev_class = "Both"
    
    match_d = re.search(r'\*\*Direct(?: revenue)?:\*\*(.*?)(?=\n- \*\*|$)', report_content, re.IGNORECASE | re.DOTALL)
    if match_d: direct = match_d.group(1).strip()
        
    match_i = re.search(r'\*\*Indirect(?: revenue)?:\*\*(.*?)(?=\n- \*\*|$)', report_content, re.IGNORECASE | re.DOTALL)
    if match_i: indirect = match_i.group(1).strip()
        
    match_c = re.search(r'\*\*Classification:\*\*(.*?)(?=\n|$)', report_content, re.IGNORECASE)
    if match_c: rev_class = match_c.group(1).strip()
        
    return direct, indirect, rev_class

def generate_synopsis(folder_path, dir_name):
    files_data = {}
    for root, _, files in os.walk(folder_path):
        for f in files:
            if f == "Integration Synopsis.md": continue
            if f.endswith(('.txt', '.md', '.ts', '.json')):
                try:
                    with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                        files_data[f] = file.read()
                except:
                    pass

    manifest = {}
    if 'activation_manifest.txt' in files_data:
        try:
            manifest = json.loads(files_data['activation_manifest.txt'])
        except:
            pass

    name = manifest.get('name', dir_name.title())
    domain = manifest.get('domain', 'Protocol')
    capabilities = manifest.get('capabilities', [])
    if isinstance(capabilities, list):
        caps_str = ", ".join(capabilities)
    else:
        caps_str = str(capabilities)

    docs_text = files_data.get('activation_docs.txt', '')
    docs_summary = ""
    if docs_text:
        match = re.search(r'## Purpose\n(.*?)(?=\n##|$)', docs_text, re.IGNORECASE | re.DOTALL)
        if match: docs_summary = match.group(1).strip()
        else: docs_summary = " ".join(docs_text.split('\n')[:3]).strip()

    sdk_funcs = []
    endpoints = []
    all_content = "\n".join(files_data.values())
    
    for f_name, f_content in files_data.items():
        if f_name.endswith('.ts') or 'sdk' in f_name.lower():
            sdk_funcs.extend(extract_functions(f_content))
        endpoints.extend(extract_endpoints(f_content))
    
    sdk_funcs = list(set(sdk_funcs))
    endpoints = list(set(endpoints))

    report_text = files_data.get('integration_report.md', '')
    rev_direct, rev_indirect, rev_class = extract_revenue(report_text)
    
    if not rev_direct: rev_direct = "No explicit direct revenue documented."
    if not rev_indirect: rev_indirect = "No explicit indirect revenue documented."

    file_list = []
    file_names_only = list(files_data.keys())
    for f in file_names_only:
        desc = "Integration asset"
        if "sdk" in f.lower(): desc = "SDK logic / implementation"
        elif "manifest" in f.lower(): desc = "Capabilities & metadata"
        elif "status" in f.lower(): desc = "Health check execution"
        elif "docs" in f.lower(): desc = "Official documentation & setup"
        elif "report" in f.lower(): desc = "Technical analysis report"
        elif "adapter" in f.lower(): desc = "M2M mapping layer"
        file_list.append(f"- **{f}** — {desc} — `./{f}`")

    synopsis = f"# {name} — Integration Synopsis\n\n"
    
    synopsis += f"## 1. Summary\n"
    synopsis += f"The {name} integration operates in the `{domain}` domain. "
    if caps_str:
        synopsis += f"It provides capabilities including: {caps_str}. "
    if docs_summary:
        synopsis += f"\n\n**Purpose:** {docs_summary}\n"
    else:
        synopsis += f"\n\nThis integration allows Wnode autonomous agents to interact securely with {name} infrastructure.\n"

    synopsis += f"\n## 2. What This Integration Does\n"
    if sdk_funcs:
        synopsis += f"**Core SDK Capabilities Exposed:**\n"
        for func in sdk_funcs:
            synopsis += f"- `{func}()`\n"
    else:
        synopsis += "- Standard RPC/API interaction capability.\n"
        
    if endpoints:
        synopsis += f"\n**Endpoints Detected:**\n"
        for ep in endpoints:
            synopsis += f"- `{ep}`\n"

    synopsis += f"\n## 3. How It Generates Revenue\n"
    synopsis += f"- **Direct revenue:** {rev_direct}\n"
    synopsis += f"- **Indirect revenue:** {rev_indirect}\n"

    synopsis += f"\n## 4. Integration Files & Artifacts\n"
    if file_list:
        synopsis += "\n".join(file_list) + "\n"
    else:
        synopsis += "- No artifacts found.\n"

    synopsis += f"\n## 5. Revenue Streams\n"
    synopsis += f"- **Direct:** {rev_direct}\n"
    synopsis += f"- **Indirect:** {rev_indirect}\n"
    synopsis += f"- **Classification:** {rev_class}\n"

    synopsis += f"\n## 6. External Documentation & API Links\n"
    urls = list(set(re.findall(r'https?://[^\s)\]"\']+', all_content)))
    if urls:
        for u in urls:
            synopsis += f"- **Link:** {u}\n"
    else:
        synopsis += "- No external URLs detected.\n"

    synopsis += f"\n## 7. Machine‑Readable Summary Block\n```json\n"
    
    json_block = {
        "integration": name,
        "domain": domain,
        "revenue_model": {
            "direct": True if "No explicit" not in rev_direct else False,
            "indirect": True if "No explicit" not in rev_indirect else False,
            "classification": rev_class
        },
        "files": file_names_only,
        "docs": urls
    }
    synopsis += json.dumps(json_block, indent=2) + "\n```\n"

    synopsis_path = os.path.join(folder_path, "Integration Synopsis.md")
    with open(synopsis_path, 'w', encoding='utf-8') as f:
        f.write(synopsis)

processed_count = 0
for dir_name in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, dir_name)
    if os.path.isdir(folder_path):
        generate_synopsis(folder_path, dir_name)
        processed_count += 1

print(f"Regenerated {processed_count} REAL Integration Synopsis files.")
