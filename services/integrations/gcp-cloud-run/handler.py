#!/usr/bin/env python3
import sys
import json

def handler(event, context):
    print(f"[Google Cloud Run] Activated inside TEE secure enclave")
    # Processing payload
    return {"status": "processed", "source": "gcp-cloud-run", "result": len(event)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        payload = json.loads(sys.argv[1])
    else:
        payload = {"ping": "pong"}
    print(json.dumps(handler(payload, {})))
