
import os
import shutil

apps = ['command', 'mesh', 'nodlr-legacy', 'web']
root = '/home/obregan/Documents/nodl'
salvage_root = os.path.join(root, 'salvage')

# Clean old salvage effort to be safe
if os.path.exists(salvage_root):
    shutil.rmtree(salvage_root)
os.makedirs(salvage_root)

files_to_salvage = []

# Step 1: Identify ALL UI files in target apps
for app in apps:
    app_path = os.path.join(root, 'apps', app, 'app')
    if not os.path.exists(app_path):
        continue
    
    for dirpath, dirnames, filenames in os.walk(app_path):
        for filename in filenames:
            # Salvage all .tsx, .ts (logic/routes), .css
            if filename.endswith('.tsx') or filename.endswith('.ts') or filename.endswith('.css'):
                full_path = os.path.join(dirpath, filename)
                files_to_salvage.append(full_path)

# Step 2: Ensure specific directories/files mentioned in Phase 1/3 are definitely here
# (Already covered by walking through app/ above, but let's be double sure for shared components if any)

# Step 3: Copy and Rename
salvage_map = []

for src in sorted(list(set(files_to_salvage))):
    rel_path = os.path.relpath(src, root)
    if rel_path.startswith('apps/'):
        target_rel = rel_path[len('apps/'):]
    else:
        target_rel = rel_path
    
    target_dir = os.path.join(salvage_root, os.path.dirname(target_rel))
    filename = os.path.basename(src)
    
    # Renaming logic
    if filename == 'page.tsx':
        target_filename = 'page.current.tsx'
    elif filename == 'layout.tsx':
        target_filename = 'layout.current.tsx'
    else:
        target_filename = filename
    
    target_path = os.path.join(target_dir, target_filename)
    
    os.makedirs(target_dir, exist_ok=True)
    shutil.copy2(src, target_path)
    
    # Metadata
    purpose = "unknown"
    if "/help/" in src: purpose = "help page"
    elif "/money/" in src: purpose = "money page"
    elif "/onboarding/" in src: purpose = "onboarding"
    elif "/signup/" in src: purpose = "signup"
    elif "page.tsx" in src or "layout.tsx" in src: purpose = "dashboard/ui"
    elif "components/" in src: purpose = "component"
    elif "api/" in src: purpose = "api route"
    else: purpose = "supporting file"
    
    status = "current"
    if ".from-a4cdbe3." in filename or ".from-help-commit." in filename:
        status = "historical"
    
    salvage_map.append({
        'name': target_filename,
        'source': rel_path,
        'purpose': purpose,
        'status': status
    })

with open(os.path.join(salvage_root, 'SALVAGE_MAP.md'), 'w') as f:
    f.write("# Salvage Kit Map (Corrected)\n\n")
    f.write("| File | Source Path | Purpose | Status | Notes |\n")
    f.write("| :--- | :--- | :--- | :--- | :--- |\n")
    for item in salvage_map:
        f.write(f"| {item['name']} | `{item['source']}` | {item['purpose']} | {item['status']} | |\n")

print(f"Salvage corrected. {len(salvage_map)} files copied.")
