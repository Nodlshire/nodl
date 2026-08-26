#!/usr/bin/env python3
import os
import re

app_docs_dir = "/home/obregan/Documents/nodl/apps/web/app/docs"
layout_file = "/home/obregan/Documents/nodl/apps/web/app/docs/layout.tsx"

with open(layout_file, "r") as f:
    layout_content = f.read()

# Find all href="/docs/..."
hrefs = re.findall(r'href="(/docs/[^"]+)"', layout_content)

missing_routes = []
valid_routes = []

for href in hrefs:
    # Convert /docs/foo/bar -> apps/web/app/docs/foo/bar/page.tsx
    rel_path = href.replace("/docs/", "")
    if rel_path == "" or rel_path == "/":
        target = os.path.join(app_docs_dir, "page.tsx")
    elif rel_path.endswith(".md"):
        target = os.path.join(app_docs_dir, rel_path)
    else:
        target = os.path.join(app_docs_dir, rel_path, "page.tsx")
    
    if os.path.exists(target):
        valid_routes.append(href)
    else:
        missing_routes.append((href, target))

print(f"=== Route Audit Results ===")
print(f"Total Linked Routes in Sidebar: {len(hrefs)}")
print(f"Valid Existing Routes: {len(valid_routes)}")
print(f"Missing (404) Routes: {len(missing_routes)}")
if missing_routes:
    print("\nMissing Routes List:")
    for href, target in missing_routes:
        print(f"  ❌ {href} -> missing {target}")
