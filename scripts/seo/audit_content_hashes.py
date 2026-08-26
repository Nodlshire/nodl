#!/usr/bin/env python3
import os
import hashlib
import re

app_docs_dir = "/home/obregan/Documents/nodl/apps/web/app/docs"
layout_file = "/home/obregan/Documents/nodl/apps/web/app/docs/layout.tsx"

with open(layout_file, "r", encoding="utf-8") as f:
    layout_content = f.read()

hrefs = re.findall(r'href="(/docs/[^"]+)"', layout_content)

routes_status = {}
hash_groups = {}

for href in hrefs:
    rel_path = href.replace("/docs/", "")
    if rel_path == "" or rel_path == "/":
        target = os.path.join(app_docs_dir, "page.tsx")
    elif rel_path.endswith(".md"):
        target = os.path.join(app_docs_dir, rel_path)
    else:
        target = os.path.join(app_docs_dir, rel_path, "page.tsx")
    
    if not os.path.exists(target):
        routes_status[href] = {"status": "404", "target": target}
    else:
        with open(target, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Calculate SHA256 of content
        content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
        
        routes_status[href] = {
            "status": "OK",
            "target": target,
            "hash": content_hash,
            "len": len(content)
        }
        
        if content_hash not in hash_groups:
            hash_groups[content_hash] = []
        hash_groups[content_hash].append((href, target))

print(f"=== EMPIRICAL ROUTE & CONTENT HASH AUDIT ===")
print(f"Total Linked Routes: {len(hrefs)}")

failures = [h for h, s in routes_status.items() if s["status"] == "404"]
print(f"404 Routes Count: {len(failures)}")
if failures:
    print("404 Routes:")
    for f in failures:
        print(f"  ❌ {f}")

duplicates = {h: r for h, r in hash_groups.items() if len(r) > 1}
print(f"Duplicate Content Hash Groups: {len(duplicates)}")
if duplicates:
    print("\nDuplicate Groups Detail:")
    for h, group in duplicates.items():
        print(f"\nHash {h[:10]}... shared by {len(group)} routes:")
        for href, target in group:
            print(f"  🔁 {href} ({target})")
