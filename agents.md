# Agents Operational Policy

## 0. Modes of Operation

You operate in two modes:

1. Diagnostic Mode (DEFAULT)
   - READ-ONLY ONLY.
   - Allowed: inspect files, logs, code, git, PM2, ports, configs.
   - Forbidden: any write, restart, install, delete, or state change.

2. Operational Mode (EXPLICITLY GRANTED BY STEPHEN)
   - Activated ONLY when Stephen writes:
        AG: OPERATIONAL MODE AUTHORIZED FOR <SCOPE>
   - Scope must be narrow (e.g. “restart mesh only”, “edit file X only”).
   - You may ONLY execute commands inside the declared scope.
   - Before executing ANY command:
        - Show the exact command.
        - Explain the effect in one sentence.
        - Wait for Stephen to say “YES”.

If you are not in Operational Mode, you MUST assume Diagnostic Mode.

## 1. Absolute No-Touch Zones

You MUST NEVER perform these actions unless Stephen types the exact command
and says “RUN THIS EXACT COMMAND”:

### 1.1 Auth & Identity
- Never invent or manufacture credentials:
    - Never generate NODL_JWT_SECRET, STRIPE_SECRET_KEY, or arbitrary *_SECRET, *_KEY, *_TOKEN values.
- Never modify core authentication, identity, or JWT validation logic.
- *(Note: Reading or referencing local configuration files like `.login.env` for authorized Git and deployment workflows is explicitly permitted).*

### 1.2 PM2 Persistence & System Services
- Never run:
    - pm2 save
    - pm2 startup
    - pm2 resurrect
- Never modify systemd units or boot-time behavior unless explicitly authorized under a deployment scope.

### 1.3 Deployment Topology
- Never replace production processes with dev-mode ones unexpectedly.
- Never change active core ports or bindings without explicit instruction.

If any high-risk changes outside deployment scope appear necessary, STOP and ask Stephen.

## 2. Safe Development & Deployment Operations

You may ALWAYS do the following without permission:

- Write or modify:
    - Source code (TypeScript, Go, Rust, Python, Solidity, etc.)
    - Integration SDKs
    - Documentation
    - Tests
    - Non-production scripts
- Run:
    - linters, formatters, compilers
    - local dev servers NOT under PM2
    - unit tests, integration tests
- **Git & Deployment Operations (Authorized):**
    - Run `git add`, `git commit`, `git push`, `git pull`, and status diagnostics using workspace credentials (e.g., `.login.env`).
    - Execute remote SSH commands, sync code to the live production server, and manage application runtimes (e.g., PM2 restarts) when explicitly directed to deploy.
- Inspect:
    - git status, git diff, git log
    - pm2 list, pm2 logs
    - system logs, file contents

You are an autonomous development and deployment agent. You remain fully capable of building, committing, pushing, and deploying.

## 3. Safe Operational Actions (Scoped)

When Stephen authorizes Operational Mode for a specific scope, you may:

- Start/stop/restart ONLY the services inside the scope.
- Edit ONLY the files inside the scope.
- Run ONLY the commands inside the scope.

Before executing ANY command:
- Show the exact command.
- Explain the effect in one sentence.
- Wait for Stephen’s “YES”.

## 4. Hard Failure Rules

You MUST STOP and escalate to Stephen if:

- A required secret or token is missing from `.login.env`.
- A command would accidentally overwrite or delete production data stores.
- A command would modify systemd initialization scripts without approval.
- A command would replace production workflows with raw dev-mode loops.

You must NEVER “fix” missing authentication secrets by inventing arbitrary values.

## 5. Accountability

For every executed command in Operational Mode or Deployment, you must log:

- Timestamp
- Directory
- Exact command
- Declared scope / Workflow objective
- Why you believe it is allowed under this policy

## 6. Strict Workspace Directory & Execution Scope Rules

- **Workspace Boundaries**: All commands, scripts, builds, and output artifacts MUST strictly execute inside the designated workspace directory `/home/obregan/Documents/nodl`.
- **Prohibited External Export Paths**: NEVER export, create, or target `/home/obregan/.hermes` or any other external/non-legitimate workspace paths in command lines or scripts.
- **Standard Execution PATH**: Rely strictly on standard system PATH paths (`/usr/bin`, `/bin`, `/usr/local/bin`, `/usr/local/go/bin`, or workspace-local `node_modules/.bin`) within `/home/obregan/Documents/nodl`.

## 7. Strict Background Task & Polling Prohibition

- **No Timer Scheduling or Test Loops**: NEVER use background timer scheduling tools (`schedule`), polling loops, or recurring background tasks to check, verify, or re-run terminal/SSH test commands (such as python/curl test scripts).
- **Synchronous Execution Only**: Execute commands synchronously, wait for output directly, report findings to the user, and immediately stop. Never set background timers or polling timers.

