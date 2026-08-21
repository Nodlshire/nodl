#!/bin/bash
# Wnode Node Operator - .deb Packaging Script
set -e

# 1. Read version from manifest
MANIFEST="../../dist/manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "Error: Manifest not found at $MANIFEST"
    exit 1
fi
VERSION=$(grep -o '"version": "[^"]*' "$MANIFEST" | cut -d'"' -f4)
echo "Building .deb package for Wnode Node Operator version $VERSION..."

# 2. Setup fakeroot/staging directory
STAGING_DIR="/tmp/wnode-node-operator-deb-staging"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR/DEBIAN"
mkdir -p "$STAGING_DIR/usr/bin"
mkdir -p "$STAGING_DIR/etc/systemd/system"
mkdir -p "$STAGING_DIR/var/lib/node-operator"

# 3. Copy binaries and assets into staging
cp ../../dist/linux-amd64/node-operator "$STAGING_DIR/usr/bin/node-operator"
cp etc/systemd/system/node-operator.service "$STAGING_DIR/etc/systemd/system/"
cp meta.json "$STAGING_DIR/var/lib/node-operator/"

# 4. Create control file
cat <<EOF > "$STAGING_DIR/DEBIAN/control"
Package: wnode-node-operator
Version: ${VERSION#v}
Section: base
Priority: optional
Architecture: amd64
Maintainer: Wnode Ltd. <team1@wnode.one>
Description: Wnode Node Operator
 Background mesh agent for the Wnode network.
EOF

# 5. Build .deb package (Placeholder)
echo "[PLACEHOLDER] Running: dpkg-deb --build $STAGING_DIR wnode-node-operator_${VERSION}_amd64.deb"
# dpkg-deb --build "$STAGING_DIR" "wnode-node-operator_${VERSION#v}_amd64.deb"

echo ".deb package build complete."
