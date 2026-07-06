import os
import re

app_dir = "/home/obregan/Documents/nodl/apps/command/app"

border_replacements = {
    "border-white/5": "border-wnode-border-separator",
    "border-white/10": "border-wnode-border-neutral",
    "border-white/20": "border-wnode-border-neutral",
    "border-white/25": "border-wnode-border-neutral",
    "border-white/30": "border-wnode-border-hover",
    "border-white/40": "border-wnode-border-hover",
    "border-white/50": "border-wnode-border-accent",
    "border-white/[0.03]": "border-wnode-border-separator",
    "border-gray-700": "border-wnode-border-neutral",
    "border-gray-800": "border-wnode-border-separator",
    "border-slate-400/20": "border-wnode-border-separator",
    "border-slate-500/20": "border-wnode-border-separator",
    "border-slate-500/50": "border-wnode-border-separator",
}

text_replacements = {
    r"\btext-slate-50\b": "text-white/85",
    r"\btext-slate-100\b": "text-white/85",
    r"\btext-slate-200\b": "text-white/80",
    r"\btext-slate-300\b": "text-white/80",
    r"\btext-slate-400\b": "text-white/60",
    r"\btext-slate-500\b": "text-white/40",
    r"\btext-slate-600\b": "text-white/40",
    r"\btext-slate-700\b": "text-white/40",
    r"\btext-slate-800\b": "text-white/40",
    r"\btext-slate-900\b": "text-white/40",
    # Handle opacity variants
    r"\btext-slate-200/\d+\b": "text-white/80",
    r"\btext-slate-300/\d+\b": "text-white/80",
    r"\btext-slate-400/\d+\b": "text-white/60",
    r"\btext-slate-500/\d+\b": "text-white/40",
}

for root, dirs, files in os.walk(app_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
            if "globals.css" in file:
                continue
                
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            orig_content = content
            
            # Apply border replacements
            for old, new in border_replacements.items():
                content = content.replace(old, new)
                
            # Apply text replacements using regex
            for pattern, replacement in text_replacements.items():
                content = re.sub(pattern, replacement, content)
                
            if content != orig_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Refactored: {file_path}")

print("Refactoring complete.")
