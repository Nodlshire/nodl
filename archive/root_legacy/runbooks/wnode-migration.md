# Wnode Migration Runbook — Secret Purge

**Summary**
A leaked Stripe test key was found in repository history and has been removed. The repository history was rewritten and force-pushed to the remote.

**What was removed**
Leaked Stripe test key replaced with `REDACTED_STRIPE_TEST_KEY`.

**Timestamp**
Purge and force-push completed on: 2026-04-11T08:34:00Z

**Verification performed**
- Local mirror purge with git-filter-repo; deep grep across all refs returned 0 hits.
- Force-push completed to remote; target branch updated.
- Local clone synced and verified with `git grep` returning 0 hits.

**Key rotation status**
- Old key: revoked (confirmed via internal audit)
- New key: issued and stored in secrets manager (GitHub Actions/Environment)

**Recovery / follow-up actions**
- Confirm CI and deployment secrets updated to use the new key.
- Check CI logs and other machines for any exposures.
- Keep this runbook and related logs for audit.

**Contact**
Security Automation
