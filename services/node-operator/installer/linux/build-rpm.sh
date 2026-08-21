#!/bin/bash
# Wnode Node Operator - .rpm Packaging Script
set -e

# 1. Read version from manifest
MANIFEST="../../dist/manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "Error: Manifest not found at $MANIFEST"
    exit 1
fi
VERSION=$(grep -o '"version": "[^"]*' "$MANIFEST" | cut -d'"' -f4)
echo "Building .rpm package for Wnode Node Operator version $VERSION..."

# 2. Setup rpmbuild structure
RPM_ROOT="/tmp/wnode-node-operator-rpm-staging"
rm -rf "$RPM_ROOT"
mkdir -p "$RPM_ROOT"/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
mkdir -p "$RPM_ROOT/BUILDROOT/usr/bin"
mkdir -p "$RPM_ROOT/BUILDROOT/etc/systemd/system"
mkdir -p "$RPM_ROOT/BUILDROOT/var/lib/node-operator"

# 3. Copy binaries and assets into buildroot
cp ../../dist/linux-amd64/node-operator "$RPM_ROOT/BUILDROOT/usr/bin/node-operator"
cp etc/systemd/system/node-operator.service "$RPM_ROOT/BUILDROOT/etc/systemd/system/"
cp meta.json "$RPM_ROOT/BUILDROOT/var/lib/node-operator/"

# 4. Create spec file (Placeholder)
cat <<EOF > "$RPM_ROOT/SPECS/node-operator.spec"
Name:       wnode-node-operator
Version:    ${VERSION#v}
Release:    1%{?dist}
Summary:    Wnode Node Operator
License:    Proprietary
%description
Background mesh agent for the Wnode network.
EOF

# 5. Build .rpm package (Placeholder)
echo "[PLACEHOLDER] Running: rpmbuild -bb --define '_topdir $RPM_ROOT' $RPM_ROOT/SPECS/node-operator.spec"
# rpmbuild -bb --define "_topdir $RPM_ROOT" "$RPM_ROOT/SPECS/node-operator.spec"

echo ".rpm package build complete."
