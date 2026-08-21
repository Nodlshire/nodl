# Contributing to Wnode Sovereign Compute Mesh

Thank you for your interest in contributing to the Wnode Sovereign Compute Mesh protocol! This document outlines our development workflow, coding standards, commit conventions, and pull request requirements.

---

## 1. Code of Conduct
We expect all contributors to maintain professional, polite, and inclusive interactions. Please review our repository standards in [`rules.md`](./rules.md).

---

## 2. Contributor Workflow

1. **Fork & Clone**: Fork the repository on GitHub and clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/wnode.git
   cd wnode
   ```
2. **Create a Feature Branch**: Always create a descriptive branch off `main`:
   ```bash
   git checkout -b feat/telemetry-batch-validation
   ```
3. **Make Intentional Changes**: Follow modern Go and TypeScript best practices. Ensure code is modular, well-commented, and includes automated tests.
4. **Run Static Analysis & Tests**:
   - Go: `go test ./...`
   - TypeScript: `npx tsc --noEmit`
5. **Commit Your Changes**: Follow the Conventional Commits standard (see below).
6. **Submit a Pull Request**: Open a PR targeting `main`. Provide a comprehensive description of the change, linked issues, and verification steps.

---

## 3. Conventional Commit Standard

Commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(nodld)`: Add support for batch telemetry verification
- `fix(node-operator)`: Resolve 429 exponential backoff handling in daemon
- `docs(dewi)`: Add radio frequency compliance documentation
- `refactor(web)`: Modernize investor whitepaper layout
- `test(core)`: Add unit tests for self-healing token reconstruction
- `chore`: Update workspace dependencies

---

## 4. Pull Request Guidelines & Quality Bar

Every Pull Request must meet the following mandatory criteria before review:

- [ ] **Clean Build**: All packages and services compile without errors or warnings.
- [ ] **Test Coverage**: Includes unit or integration tests verifying the new behavior.
- [ ] **Zero Synthetic Data**: Adheres strictly to the zero-synthetic data policy in production code.
- [ ] **Documentation**: Updates relevant markdown files in `docs/` and updates `docs/INDEX.md`.
- [ ] **Repository Hygiene**: No scratch files, debug logs, or temporary scripts committed.

---

## 5. Security & Vulnerability Reporting
Do **NOT** report security vulnerabilities through public GitHub issues. Please follow the instructions in [`SECURITY.md`](./SECURITY.md) to submit confidential reports directly to our security team.
