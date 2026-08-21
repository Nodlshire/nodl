# WNode Deployment Protocol & System Constraints

**CRITICAL RULE FOR THE AI:** You are executing commands on a live, production bare-metal Ubuntu headless server. You must never assume paths, ports, or Git states. You must read and follow this configuration matrix strictly.

## 1. The Core System Matrix
The repository lives strictly in `/home/obregan/wnode`. Any other folders (like `/home/obregan/apps` or `/home/obregan/Documents`) are old legacy artifacts and must be ignored.

| PM2 App Name | Active Port | Working Directory (cwd) | Script / Entrypoint |
| :--- | :--- | :--- | :--- |
| web | 3004 | `/home/obregan/wnode/apps/web` | Next.js (`npm run start`) |
| command | 3001 | `/home/obregan/wnode/apps/command` | Next.js (`npm run start`) |
| nodlr | 3002 | `/home/obregan/wnode/apps/nodlr` | Next.js (`npm run start`) |
| mesh | 3003 | `/home/obregan/wnode/apps/mesh` | Next.js (`npm run start`) |
| backend | 8080 | `/home/obregan/wnode` | `nodld_bin` (Go binary) |

## 2. The Golden Rules of PM2 & Git

*   **Rule 1: Always Use `ecosystem.config.js`**
    Never spin up applications using raw inline scripts (e.g., `pm2 start npm -- start`). You must always run commands referencing `/home/obregan/wnode/ecosystem.config.js`.
*   **Rule 2: The Dev Machine is the Absolute Source of Truth**
    The server should only pull from the main branch of origin after the developer has successfully pushed from their local machine.
*   **Rule 3: Port Mappings Are Fixed**
    `command` must run strictly on port 3001 and `nodlr` strictly on port 3002. Never swap them.
*   **Rule 4: Never Run Streaming PM2 Log Commands (`pm2 logs`)**
    `pm2 logs` streams output continuously without exiting, causing subshell tasks to hang indefinitely. Use non-blocking `pm2 status` or read log files directly with `tail -n 30 ~/.pm2/logs/<app>-out.log`.

## 3. Targeted Deployment Playbooks (Copy/Paste as Needed)
These modular instructions let you update one part of the system without touching or rebuilding the others.

### Playbook A: Deploy ONLY the Website (`web` - Port 3004)
Use this when you make website updates and do not want to risk touching the functional apps.
```bash
# 1. Navigate to the correct repository:
cd /home/obregan/wnode

# 2. Pull down the latest commit from origin main:
git pull origin main

# 3. Delete the old website build cache to prevent stale assets:
rm -rf apps/web/.next

# 4. Build only the web workspace cleanly:
npm run build --workspace=apps/web

# 5. Hard-reload only the web process in PM2:
pm2 reload web

# 6. Save PM2 state:
pm2 save
```

### Playbook B: Deploy ONLY the Core Apps (`command`, `nodlr`, `mesh`)
Use this when you want to update your operational network apps without rebuilding the website.
```bash
# 1. Navigate to the repository:
cd /home/obregan/wnode

# 2. Pull down the latest commit from origin main:
git pull origin main

# 3. Clear the Next.js build caches for only these three workspaces:
rm -rf apps/command/.next apps/nodlr/.next apps/mesh/.next

# 4. Build only the targeted app workspaces:
npm run build --workspace=apps/command
npm run build --workspace=apps/nodlr
npm run build --workspace=apps/mesh

# 5. Hard-reload the processes in PM2:
pm2 reload command nodlr mesh

# 6. Save PM2 state:
pm2 save
```

### Playbook C: Deploy ONLY the Go Backend (`backend` - Port 8080)
Use this when you modify files inside the Go daemon (`nodld`) and need a fresh binary compilation.
```bash
# 1. Navigate to the repository:
cd /home/obregan/wnode

# 2. Pull the latest commits:
git pull origin main

# 3. Compile the new Go binary directly into the root folder:
cd nodld && go build -o ../nodld_bin ./cmd/nodld && cd ..

# 4. Reload the backend daemon in PM2:
pm2 reload backend

# 5. Save PM2 state:
pm2 save
```

### Playbook D: The Scorched-Earth Rebuild (Deploy Everything Fresh)
Use this when things are completely out of sync, ports are jammed, or you need a total, clean reset from GitHub.
```bash
# 1. Kill PM2 completely to free up all ports:
pm2 kill

# 2. Reset the local repository branch cleanly to origin/main:
cd /home/obregan/wnode
git fetch origin
git reset --hard origin/main
git clean -ffdx

# 3. Recompile the Go backend:
cd nodld && go build -o ../nodld_bin ./cmd/nodld && cd ..

# 4. Install dependencies fresh from the root:
npm install

# 5. Compile all Next.js applications cleanly:
npm run build --workspaces --if-present

# 6. Restart all processes cleanly using the official ecosystem file:
pm2 start ecosystem.config.js

# 7. Save PM2 state:
pm2 save
```
