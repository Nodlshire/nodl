#!/usr/bin/env bash
set -e

BASE="/home/obregan/Documents/nodl/integrations"

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

echo "Starting validations..."
for svc in "${SERVICES[@]}"; do
  # check json
  python3 -c "import json; json.load(open('${BASE}/${svc}/manifest.json'))"
  python3 -c "import json; json.load(open('${BASE}/${svc}/status.json'))"
  python3 -c "import json; json.load(open('${BASE}/${svc}/pipelines/example-pipeline.json'))"
  
  # check ready.txt
  READY_CONTENT=$(cat "${BASE}/${svc}/ready.txt" | tr -d '\n')
  if [ "$READY_CONTENT" != "READY" ]; then
    echo "FAILED: ${svc}/ready.txt content is '${READY_CONTENT}', expected 'READY'"
    exit 1
  fi
  echo "✓ ${svc} validated"
done
echo "All validations passed!"
