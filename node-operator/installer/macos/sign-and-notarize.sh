#!/bin/bash
# Wnode Node Operator - macOS Signing & Notarization Pipeline
set -e

# 1. Read version from manifest
MANIFEST="../../dist/manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "Error: Manifest not found at $MANIFEST"
    exit 1
fi
VERSION=$(grep -o '"version": "[^"]*' "$MANIFEST" | cut -d'"' -f4)
PKG_NAME="WnodeNodeOperator-${VERSION}.pkg"
SIGNED_PKG_NAME="WnodeNodeOperator-${VERSION}-signed.pkg"

echo "Starting macOS signing pipeline for $PKG_NAME..."

# Credentials (Placeholders)
DEV_ID_INSTALLER="Developer ID Installer: Wnode Ltd. (XXXXXXXXXX)"
APPLE_ID="appleid@wnode.one"
APP_PASSWORD="@keychain:WnodeNotaryPass"
TEAM_ID="XXXXXXXXXX"

# 2. Sign the .pkg (Placeholder)
echo "[PLACEHOLDER] Running: productsign --sign '$DEV_ID_INSTALLER' '$PKG_NAME' '$SIGNED_PKG_NAME'"

# 3. Submit for Notarization (Placeholder)
echo "[PLACEHOLDER] Running: xcrun notarytool submit '$SIGNED_PKG_NAME' --apple-id '$APPLE_ID' --password '$APP_PASSWORD' --team-id '$TEAM_ID' --wait"

# 4. Staple the Notarization Ticket (Placeholder)
echo "[PLACEHOLDER] Running: xcrun stapler staple '$SIGNED_PKG_NAME'"

echo "macOS Signing & Notarization pipeline complete."
