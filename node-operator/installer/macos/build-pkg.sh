#!/bin/bash
# Wnode Node Operator - macOS .pkg Build Script
set -e

# 1. Read version from manifest
MANIFEST="../../dist/manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "Error: Manifest not found at $MANIFEST"
    exit 1
fi
VERSION=$(grep -o '"version": "[^"]*' "$MANIFEST" | cut -d'"' -f4)
echo "Building macOS .pkg for Wnode Node Operator version $VERSION..."

# 2. Setup payload staging directory
STAGING_DIR="/tmp/wnode-node-operator-mac-staging"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR/usr/local/bin"
mkdir -p "$STAGING_DIR/Library/LaunchDaemons"
mkdir -p "$STAGING_DIR/Library/Application Support/Wnode/node-operator"

# 3. Copy binaries and assets into staging
cp ../../dist/darwin-amd64/node-operator "$STAGING_DIR/usr/local/bin/node-operator"
cp Library/LaunchDaemons/one.wnode.operator.plist "$STAGING_DIR/Library/LaunchDaemons/"
cp meta.json "$STAGING_DIR/Library/Application Support/Wnode/node-operator/"

# 4. Build .pkg package (Placeholder)
echo "[PLACEHOLDER] Running: pkgbuild --root $STAGING_DIR --identifier one.wnode.operator --version $VERSION WnodeNodeOperator-${VERSION}.pkg"
# pkgbuild --root "$STAGING_DIR" --identifier "one.wnode.operator" --version "$VERSION" "WnodeNodeOperator-${VERSION}.pkg"

# 5. Signing / Notarization (Placeholder)
echo "[PLACEHOLDER] Running: productsign --sign 'Developer ID Installer: Wnode Ltd.' WnodeNodeOperator-${VERSION}.pkg WnodeNodeOperator-${VERSION}-signed.pkg"
echo "[PLACEHOLDER] Running: xcrun altool --notarize-app ..."

echo "macOS .pkg build complete."
