# Contributing Guidelines

These guidelines ensure a predictable, safe, and professional development process for everyone contributing to wnode. They reflect the same principles that govern the network itself: clarity, fairness, and operational integrity.

---

## Branch Naming

Use clear, purpose‑driven prefixes:

- feature/<short-description>
- fix/<short-description>
- chore/<short-description>

Optional: append issue ID  
Example: feature/<short-description>-#123

Branches should describe one logical change.

---

## Pull Request Requirements

Every PR must meet the following standards before review:

- **Build passes:**  
  `npm ci && npm run build`

- **Tests pass:**  
  Unit tests + smoke tests (no new warnings or skipped critical tests)

- **Security clean:**  
  No secrets, tokens, or credentials in commits or history

- **Lint/format clean:**  
  Codebase remains consistent and warning‑free

- **Documentation updated:**  
  Any user‑facing or developer‑facing changes reflected in docs

- **Scoped and focused:**  
  PR does one thing; no unrelated refactors or mixed concerns

---

## Non‑Negotiables

These rules protect the stability of the codebase and apply equally to all contributors.

- No direct commits to main or protected branches  
- No force‑pushes to shared branches  
- All changes must go through a pull request  
- All PRs require at least one approval  
- CI, tests, and security checks must pass before merge  
- No rewriting commit history on shared branches  
- No secrets or credentials in the repository, ever  

These safeguards are professional standards that ensure the project remains stable, auditable, and trustworthy.

---

## Code of Conduct

Contributions are welcome from anyone who engages respectfully, collaborates constructively, and upholds the principles of:

- community ownership  
- professional stewardship  
- transparency  
- technical excellence  

---

## Summary

This project is built on trust, clarity, and professionalism. These guidelines ensure that every contribution—large or small—strengthens the codebase and respects the community that owns it.
