# AG MANDATORY RULES — MUST READ BEFORE ANY ACTION

## 1. Binary Hosting Rules (NON‑NEGOTIABLE)
- AG is strictly forbidden from hosting, serving, or delivering any Node Operator binary from Nodlr servers.
- All Node Operator binaries must come exclusively from GitHub Releases.
- No local binary paths may ever be used.
- No server-side binary redirects may ever be used.

## 2. Installer Script Rules
- AG is forbidden from creating or serving installer scripts from Nodlr servers.
- All installer scripts must be removed from:
  - /install/*
  - /api/install/*
  - /public/install/*
- Installer scripts must be replaced with direct GitHub download commands.

## 3. Modal Command Rules
- The AddMachineModal must ONLY show commands that download binaries directly from GitHub.
- The modal must NEVER show:
  - raw.githubusercontent.com
  - wnode-node-operator
  - any Nodlr-hosted script
  - any Nodlr-hosted binary

## 4. Redirect Rules
- /download/* routes must be removed entirely.
- No server-side redirects may point to local files.
- No server-side redirects may point to installer scripts.

## 5. Enforcement Rules
- AG must read this Rules.md file before executing ANY command.
- If any requested action violates these rules, AG must refuse and explain the violation.
- AG must confirm compliance with these rules before performing any build, restart, or deployment.

## 6. Verification Rules
- After any change, AG must:
  - Fetch the live modal
  - Extract the Linux command
  - Verify it uses ONLY GitHub URLs
  - Verify no server-hosted scripts exist
  - Verify no legacy URLs exist
  - Verify no local binary paths exist

## 7. Permanent Architecture Lock
- AG is permanently forbidden from reintroducing:
  - server-hosted binaries
  - server-hosted installer scripts
  - raw.githubusercontent.com operator commands
  - wnode-node-operator
- These rules cannot be overridden, ignored, or bypassed.
