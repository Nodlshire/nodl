import os

EXCLUDE_DIRS = {
    '.git', '.next', '.turbo', '.vercel', 'node_modules', 
    'dist', 'build', 'coverage', 'public', 'logs', 'tmp'
}

def generate_agents():
    root_dir = os.getcwd()
    created_count = 0
    updated_count = 0
    
    for root, dirs, files in os.walk(root_dir):
        rel_path = os.path.relpath(root, root_dir)
        dir_name = os.path.basename(root)
        
        # Modify dirs in-place to skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        # Check for .log or .cache files
        has_log_or_cache = any(f.endswith('.log') or f.endswith('.cache') for f in files)
        
        # The prompt says exclude directories containing *.log or *.cache files from traversal
        # However, if the root directory has logs, skipping it would skip the whole repo.
        # So we only apply this rule to subdirectories.
        if has_log_or_cache and root != root_dir:
            dirs[:] = []
            continue
            
        agents_md_path = os.path.join(root, 'agents.md')
        
        # Prepare content
        folder_purpose = f"## Folder Purpose\nDocumentation for the `{dir_name}` module.\n"
        if rel_path == '.':
            folder_purpose = "## Folder Purpose\nRoot directory for Wnode Monorepo.\n"
            
        child_docs = "## Child Docs Index\n"
        if dirs:
            for d in sorted(dirs):
                child_docs += f"- [{d}/]({d}/agents.md)\n"
        else:
            child_docs += "No child directories.\n"
            
        files_overview = "## Files Overview\n"
        valid_files = [f for f in sorted(files) if f != 'agents.md']
        if valid_files:
            for f in valid_files:
                files_overview += f"- `{f}`\n"
        else:
            files_overview += "No files.\n"
            
        local_rules = "## Local Rules\n\n"
        
        parent_link = ""
        if rel_path != '.':
            parent_link = "[Parent Directory](../agents.md)\n"
            
        new_content = f"\n{folder_purpose}\n{child_docs}\n{files_overview}\n{local_rules}\n{parent_link}"
        
        if os.path.exists(agents_md_path):
            with open(agents_md_path, 'r') as f:
                content = f.read()
                
            if "## Folder Purpose" not in content:
                with open(agents_md_path, 'a') as f:
                    f.write("\n---\n" + new_content)
                updated_count += 1
        else:
            header = f"# {dir_name.capitalize()} Documentation\n" if rel_path != '.' else "# Wnode Monorepo Documentation\n"
            with open(agents_md_path, 'w') as f:
                f.write(header + new_content)
            created_count += 1

    print(f"Summary:")
    print(f"Created agents.md files: {created_count}")
    print(f"Updated existing agents.md files: {updated_count}")

if __name__ == '__main__':
    generate_agents()
