
import os
import shutil

root = '/home/obregan/Documents/nodl'
salvage_root = os.path.join(root, 'salvage')
apps = ['command', 'mesh', 'nodlr-legacy', 'web']

# Step 1: Cleanup
for app in apps:
    app_dir = os.path.join(root, 'apps', app, 'app')
    if not os.path.exists(app_dir):
        continue
    
    # We need to remove all pages, components, UI files
    # but keep layout.tsx, globals.css, API routes
    for item in os.listdir(app_dir):
        item_path = os.path.join(app_dir, item)
        
        # Keep cases
        if item == 'api':
            continue # Do not delete API routes
        if item == 'layout.tsx' or item == 'globals.css':
            continue # Keep boilerplate/globals
        if item.startswith('_'): 
            continue # Potential Next.js boilerplate/private folders
            
        # Remove everything else in app/ (pages, subfolders)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)

# Step 2: Rebuild from salvage
for app in apps:
    salvage_app_dir = os.path.join(salvage_root, app, 'app')
    target_app_dir = os.path.join(root, 'apps', app, 'app')
    
    if not os.path.exists(salvage_app_dir):
        continue
        
    for dirpath, dirnames, filenames in os.walk(salvage_app_dir):
        rel_dir = os.path.relpath(dirpath, salvage_app_dir)
        target_dir = os.path.join(target_app_dir, rel_dir)
        
        if not os.path.exists(target_dir):
            os.makedirs(target_dir, exist_ok=True)
            
        for filename in filenames:
            src_path = os.path.join(dirpath, filename)
            
            # Map page.current.tsx -> page.tsx
            if filename == 'page.current.tsx':
                target_filename = 'page.tsx'
            elif filename == 'layout.current.tsx':
                target_filename = 'layout.tsx'
            elif 'from-a4cdbe3' in filename or 'from-help-commit' in filename:
                continue # Skip historical siblings as per rule 4
            else:
                target_filename = filename # Copy other relevant files found in salvage (components, etc)
                
            shutil.copy2(src_path, os.path.join(target_dir, target_filename))

print("Rebuild complete.")
