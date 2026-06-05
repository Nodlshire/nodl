#!/usr/bin/env bash
set -euo pipefail

BASE="/home/obregan/Documents/nodl/integrations"

# Create all provider/service directories with subdirs
SERVICES=(
  "aws/lambda"
  "aws/s3"
  "aws/sns"
  "aws/sqs"
  "gcp/cloud-storage"
  "gcp/pubsub"
  "gcp/vision-api"
  "azure/blob-storage"
  "azure/event-grid"
)

for svc in "${SERVICES[@]}"; do
  mkdir -p "${BASE}/${svc}/pipelines"
  mkdir -p "${BASE}/${svc}/examples/terraform"
  mkdir -p "${BASE}/${svc}/tests"
  echo "Created: ${BASE}/${svc}/"
done

echo "All Phase 1 directories created."
