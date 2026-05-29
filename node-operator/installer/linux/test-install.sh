#!/bin/bash
# Wnode Node Operator - Linux Install Verification Script
set -e

MANIFEST="../../dist/manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "Error: Manifest not found at $MANIFEST"
    exit 1
fi
VERSION=$(grep -o '"version": "[^"]*' "$MANIFEST" | cut -d'"' -f4)

echo "Simulating Linux Install Verification for v$VERSION..."

# Staging path based on build script
STAGING_DIR="/tmp/wnode-node-operator-deb-staging"

echo "[PLACEHOLDER] Verifying payload structure in $STAGING_DIR..."
# if [ ! -f "$STAGING_DIR/usr/bin/node-operator" ]; then echo "Missing binary"; exit 1; fi
# if [ ! -f "$STAGING_DIR/etc/systemd/system/node-operator.service" ]; then echo "Missing service"; exit 1; fi
# if [ ! -f "$STAGING_DIR/var/lib/node-operator/meta.json" ]; then echo "Missing meta.json"; exit 1; fi

echo "[PLACEHOLDER] Validating meta.json version match for $VERSION..."
# META_VER=$(grep -o '"version": "[^"]*' "$STAGING_DIR/var/lib/node-operator/meta.json" | cut -d'"' -f4)
# if [ "$META_VER" != "$VERSION" ]; then echo "Version mismatch!"; exit 1; fi

echo "Linux install verification complete (Placeholder)."
