# Secrets vault
Location: /home/obregan/.secrets (owner obregan, mode 600)
Files:
- openai.key (600)
- stripe.sk (600)
- webhooks/stripe_whsec (600)
Access:
- Only user obregan and sudo may read these files.
- Do not rsync secrets into public directories.
