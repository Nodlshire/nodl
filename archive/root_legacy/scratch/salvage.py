
import os
import shutil

apps = ['command', 'mesh', 'nodlr-legacy', 'web']
root = '/home/obregan/Documents/nodl'
salvage_root = os.path.join(root, 'salvage')

files_to_salvage = []

# Step 1: Identify files in target apps
for app in apps:
    app_path = os.path.join(root, 'apps', app)
    if not os.path.exists(app_path):
        continue
    
    for dirpath, dirnames, filenames in os.walk(app_path):
        for filename in filenames:
            # We want current UI files (page/layout) and the explicitly named history siblings
            if filename in ['page.tsx', 'layout.tsx'] or '.from-a4cdbe3.' in filename or '.from-help-commit.' in filename:
                full_path = os.path.join(dirpath, filename)
                files_to_salvage.append(full_path)

# Step 2: Ensure specific directories are included fully (help, money, onboarding, signup)
specific_dirs = [
    'apps/command/app/help',
    'apps/command/app/money',
    'apps/web/app/onboarding',
    'apps/web/app/signup'
]

for sdir in specific_dirs:
    full_sdir = os.path.join(root, sdir)
    if not os.path.exists(full_sdir):
        continue
    for dirpath, dirnames, filenames in os.walk(full_sdir):
        for filename in filenames:
            full_path = os.path.join(dirpath, filename)
            if full_path not in files_to_salvage:
                files_to_salvage.append(full_path)

# Step 3: Copy and Rename
salvage_map = []

for src in sorted(list(set(files_to_salvage))):
    rel_path = os.path.relpath(src, root)
    # Target path: remove 'apps/' prefix
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
    
    # Documentation metadata
    purpose = "unknown"
    if "/help/" in src: purpose = "help page"
    elif "/money/" in src: purpose = "money page"
    elif "/onboarding/" in src: purpose = "onboarding"
    elif "/signup/" in src: purpose = "signup"
    elif "page.tsx" in src or "layout.tsx" in src: purpose = "dashboard/ui"
    elif "component" in src: purpose = "component"
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

# Step 4: Write SALVAGE_MAP.md
with open(os.path.join(salvage_root, 'SALVAGE_MAP.md'), 'w') as f:
    f.write("# Salvage Kit Map\n\n")
    f.write("| File | Source Path | Purpose | Status | Notes |\n")
    f.write("| :--- | :--- | :--- | :--- | :--- |\n")
    for item in salvage_map:
        f.write(f"| {item['name']} | `{item['source']}` | {item['purpose']} | {item['status']} | |\n")

print(f"Salvage complete. {len(salvage_map)} files copied.")
