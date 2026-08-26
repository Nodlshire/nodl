#!/usr/bin/env python3
import os

target_dir = "/home/obregan/Documents/nodl/apps/web/app/docs"

count = 0
for root, dirs, files in os.walk(target_dir):
    for f in files:
        if f.endswith(".tsx"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            if "WHAT IT IS" in content:
                # Find start of grid container
                start_marker = '<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">'
                comment_marker = '{/* Contextual Narrative Section (What, Why, How) */}'
                
                start_idx = content.find(start_marker)
                if start_idx != -1:
                    # Check if preceding comment exists
                    comment_idx = content.find(comment_marker)
                    if comment_idx != -1 and comment_idx < start_idx:
                        actual_start = comment_idx
                    else:
                        actual_start = start_idx
                    
                    # Find matching closing </div> for the grid container
                    # We start counting <div> and </div> from start_idx
                    idx = start_idx
                    depth = 0
                    end_idx = -1
                    
                    while idx < len(content):
                        if content[idx:idx+4] == '<div':
                            depth += 1
                        elif content[idx:idx+6] == '</div>':
                            depth -= 1
                            if depth == 0:
                                end_idx = idx + 6
                                break
                        idx += 1
                    
                    if end_idx != -1:
                        new_content = content[:actual_start] + content[end_idx:]
                        with open(filepath, "w", encoding="utf-8") as file:
                            file.write(new_content)
                        count += 1
                        print(f"Scrubbed WHAT/WHY/HOW cards cleanly from: {filepath}")

print(f"Cleanly scrubbed template cards from {count} files.")
