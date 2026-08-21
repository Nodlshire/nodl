# Deployment Notes

## Build
- Multi-stage Dockerfile (build on Debian/bookworm, runtime on node:20-slim).
- Output is a minimal, reproducible production image.

## CI Pipeline
- checkout → npm ci → npm run build
- docker build -t wnodeltd/wnode:<sha> .
- run smoke tests inside the container
- push image with both <sha> and :latest tags

## Deployment (local or server)
- docker compose pull
- docker compose up -d --no-build --force-recreate wnode

## Rollback
- Pin docker-compose to a previous image tag (commit SHA)
- docker compose pull && docker compose up -d --no-build --force-recreate
- No local builds, no Dockerfile edits on the server
