
import os
import shutil

root = '/home/obregan/Documents/nodl'
salvage_root = os.path.join(root, 'salvage')
apps = ['command', 'mesh', 'nodlr-legacy', 'web']

files_removed = []
files_added = []

# Step 1: Cleanup with detailed logging
for app in apps:
    app_dir = os.path.join(root, 'apps', app, 'app')
    if not os.path.exists(app_dir):
        continue
    
    print(f"Cleaning {app}...")
    for dirpath, dirnames, filenames in os.walk(app_dir, topdown=False):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            rel_file = os.path.relpath(file_path, root)
            
            # KEEP rules
            if "/api/" in file_path: continue
            if filename == 'layout.tsx' or filename == 'globals.css': continue
            if filename.startswith('_'): continue
            
            os.remove(file_path)
            files_removed.append(rel_file)

        # Remove empty directories (except for api and root app dir)
        for dirname in dirnames:
            dir_path = os.path.join(dirpath, dirname)
            if dirname == 'api' or dirname.startswith('_'): continue
            if not os.listdir(dir_path):
                os.rmdir(dir_path)

# Step 2: Rebuild from salvage
for app in apps:
    salvage_app_dir = os.path.join(salvage_root, app, 'app')
    target_app_dir = os.path.join(root, 'apps', app, 'app')
    
    if not os.path.exists(salvage_app_dir):
        continue
    
    print(f"Rebuilding {app}...")
    for dirpath, dirnames, filenames in os.walk(salvage_app_dir):
        rel_dir = os.path.relpath(dirpath, salvage_app_dir)
        target_dir = os.path.join(target_app_dir, rel_dir)
        
        if not os.path.exists(target_dir):
            os.makedirs(target_dir, exist_ok=True)
            
        for filename in filenames:
            # Rule 4: Do NOT copy historical siblings
            if '.from-a4cdbe3.' in filename or '.from-help-commit.' in filename:
                continue
                
            src_path = os.path.join(dirpath, filename)
            
            # Renaming rules
            if filename == 'page.current.tsx':
                target_filename = 'page.tsx'
            elif filename == 'layout.current.tsx':
                target_filename = 'layout.tsx'
            else:
                target_filename = filename
            
            target_path = os.path.join(target_dir, target_filename)
            shutil.copy2(src_path, target_path)
            files_added.append(os.path.relpath(target_path, root))

# Save results for reporting
with open(os.path.join(root, 'scratch/rebuild_report_data.json'), 'w') as f:
    import json
    json.dump({"added": files_added, "removed": files_removed}, f)

print("Rebuild executed successfully.")
