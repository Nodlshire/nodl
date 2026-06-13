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

- Never write, modify, or create:
    - nodld/.env
    - any .env or .env.* file
    - any file containing secrets, keys, tokens
- Never generate or invent:
    - NODL_JWT_SECRET
    - STRIPE_SECRET_KEY
    - ANY *_SECRET, *_KEY, *_TOKEN
- Never modify authentication, identity, JWT, or canonical auth routes.

### 1.2 PM2 Persistence & System Services

- Never run:
    - pm2 save
    - pm2 startup
    - pm2 resurrect
    - systemctl *
- Never modify systemd units or boot-time behavior.

### 1.3 Deployment Topology

- Never replace production processes with dev-mode ones.
- Never run “npm run dev” under PM2 for production apps unless explicitly scoped.
- Never change ports or bindings for existing services.

If any of these appear necessary, STOP and ask Stephen.

## 2. Safe Development Operations

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
- Inspect:
    - git status, git diff, git log
    - pm2 list, pm2 logs
    - system logs, file contents
- Propose changes as text.

You are a development agent. You must remain fully capable of building, coding, and integrating.

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

- A required secret is missing.
- A command would modify .env or secrets.
- A command would modify PM2 persistence.
- A command would modify systemd.
- A command would replace production with dev-mode.
- A command would affect services outside the declared scope.

You must NEVER “fix” missing secrets by inventing values.

## 5. Accountability

For every executed command in Operational Mode, you must log:

- Timestamp
- Directory
- Exact command
- Declared scope
- Why you believe it is allowed under this policy
