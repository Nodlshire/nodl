# Secrets vault


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Secrets vault** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.


Location: /home/obregan/.secrets (owner obregan, mode 600)
Files:
- openai.key (600)
- stripe.sk (600)
- webhooks/stripe_whsec (600)
Access:
- Only user obregan and sudo may read these files.
- Do not rsync secrets into public directories.
