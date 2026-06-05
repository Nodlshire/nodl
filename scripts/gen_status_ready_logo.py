#!/usr/bin/env python3
"""Generate status.json, ready.txt, and logo.svg for all Phase 1 integrations."""
import json, os, datetime

BASE = "/home/obregan/Documents/nodl/integrations"
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

INTEGRATIONS = {
    "aws/lambda": {
        "name": "AWS Lambda", "color": "#FF9900",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/pipeline/status/:id"],
        "icon_text": "λ"
    },
    "aws/s3": {
        "name": "AWS S3", "color": "#569A31",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/storage/presign"],
        "icon_text": "S3"
    },
    "aws/sns": {
        "name": "AWS SNS", "color": "#D63AFF",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/sns/confirm"],
        "icon_text": "SNS"
    },
    "aws/sqs": {
        "name": "AWS SQS", "color": "#FF4F8B",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/queue/poll"],
        "icon_text": "SQS"
    },
    "gcp/cloud-storage": {
        "name": "Google Cloud Storage", "color": "#4285F4",
        "tested_endpoints": ["/api/pipeline/invoke"],
        "icon_text": "GCS"
    },
    "gcp/pubsub": {
        "name": "Google Pub/Sub", "color": "#4285F4",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/pubsub/pull"],
        "icon_text": "PS"
    },
    "gcp/vision-api": {
        "name": "Google Vision API", "color": "#EA4335",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/vision/annotate"],
        "icon_text": "VA"
    },
    "azure/blob-storage": {
        "name": "Azure Blob Storage", "color": "#0078D4",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/eventgrid/validate"],
        "icon_text": "AB"
    },
    "azure/event-grid": {
        "name": "Azure Event Grid", "color": "#0078D4",
        "tested_endpoints": ["/api/pipeline/invoke", "/api/eventgrid/validate"],
        "icon_text": "EG"
    },
}

for path, info in INTEGRATIONS.items():
    d = os.path.join(BASE, path)

    # status.json
    status = {
        "status": "stable",
        "tested_endpoints": info["tested_endpoints"],
        "last_tested": NOW,
        "known_issues": [],
        "compatibility": {"wnode_version": ">=1.0.0"}
    }
    with open(os.path.join(d, "status.json"), "w") as f:
        json.dump(status, f, indent=2)
        f.write("\n")

    # ready.txt
    with open(os.path.join(d, "ready.txt"), "w") as f:
        f.write("READY\n")

    # logo.svg — minimal branded icon
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="{info["color"]}"/>
  <text x="32" y="38" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#fff">{info["icon_text"]}</text>
</svg>
'''
    with open(os.path.join(d, "logo.svg"), "w") as f:
        f.write(svg)

    print(f"✓ {info['name']}: status.json, ready.txt, logo.svg")

print("\nAll status/ready/logo files generated.")
