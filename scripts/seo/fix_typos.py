#!/usr/bin/env python3
import os
import re

target_dir = "/home/obregan/Documents/nodl/apps/web/app/docs"

for root, dirs, files in os.walk(target_dir):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            new_content = content.replace("SECCOMP Sandbox sandbox", "SECCOMP-BPF Sandbox")
            new_content = new_content.replace("SECCOMP Sandbox Sandbox", "SECCOMP-BPF Sandbox")
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(new_content)
                print(f"Fixed typos in {filepath}")

print("Typo cleanup complete!")
