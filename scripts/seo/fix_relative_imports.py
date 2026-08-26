#!/usr/bin/env python3
import os

app_dir = "/home/obregan/Documents/nodl/apps/web/app"
docs_dir = os.path.join(app_dir, "docs")

for root, dirs, files in os.walk(docs_dir):
    for f in files:
        if f.endswith(".tsx"):
            filepath = os.path.join(root, f)
            rel_to_app = os.path.relpath(filepath, app_dir)
            num_slashes = rel_to_app.count("/")
            up_prefix = "../" * (num_slashes + 1)
            
            callout_import = f"{up_prefix}components/docs/Callout"
            codeblock_import = f"{up_prefix}components/docs/CodeBlock"
            anim_import = f"{up_prefix}components/DocAnimationViewer"
            
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            lines = content.splitlines()
            new_lines = []
            modified = False
            for line in lines:
                if "import Callout from " in line:
                    line = f"import Callout from '{callout_import}';"
                    modified = True
                elif "import CodeBlock from " in line:
                    line = f"import CodeBlock from '{codeblock_import}';"
                    modified = True
                elif "import DocAnimationViewer from " in line:
                    line = f"import DocAnimationViewer from '{anim_import}';"
                    modified = True
                new_lines.append(line)
            
            if modified:
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write("\n".join(new_lines) + "\n")

print("Fixed all relative component import paths across docs routes!")
