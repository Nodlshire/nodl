#!/usr/bin/env python3
import os

target_dirs = [
    "/home/obregan/Documents/nodl/apps/web",
    "/home/obregan/Documents/nodl/apps/nodlr",
    "/home/obregan/Documents/nodl/docs",
    "/home/obregan/Documents/nodl/tools/discord-bot"
]

count = 0
for tdir in target_dirs:
    for root, dirs, files in os.walk(tdir):
        for f in files:
            if f.endswith((".tsx", ".ts", ".js", ".json", ".md")):
                filepath = os.path.join(root, f)
                with open(filepath, "r", encoding="utf-8") as file:
                    content = file.read()
                
                new_content = content.replace("v1.4.0-enterprise", "v1.5.0-enterprise")
                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    count += 1
                    print(f"Updated version string to v1.5.0-enterprise in: {filepath}")

print(f"Version unification complete across {count} files!")
