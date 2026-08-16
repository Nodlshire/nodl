#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$PROJECT_DIR/nodld"
OUT_DIR="$PROJECT_DIR/apps/web/public/downloads"
NODLR_OUT_DIR="$PROJECT_DIR/apps/nodlr/public/downloads"

mkdir -p "$OUT_DIR" "$NODLR_OUT_DIR" /tmp/appimage-stage

# 1. Compile native nodld-gui binary
cd "$BUILD_DIR"
/home/obregan/go/pkg/mod/golang.org/toolchain@v0.0.1-go1.25.0.linux-amd64/bin/go build -o /tmp/appimage-stage/nodld-gui cmd/nodld-gui/main.go
chmod +x /tmp/appimage-stage/nodld-gui

# 2. Add Desktop entry and icon
cp "$BUILD_DIR/assets/wnode-node-operator.desktop" /tmp/appimage-stage/
chmod +x /tmp/appimage-stage/nodld-gui

# 3. Create payload archive
cd /tmp/appimage-stage
tar -czf /tmp/payload.tar.gz nodld-gui wnode-node-operator.desktop

# 4. Assemble AppImage binary
APPIMAGE_TARGET="$OUT_DIR/Wnode-Node-Operator-x86_64.AppImage"
NODLR_APPIMAGE_TARGET="$NODLR_OUT_DIR/Wnode-Node-Operator-x86_64.AppImage"

cat << 'EOF' > "$APPIMAGE_TARGET"
#!/bin/sh
# Wnode Sovereign Mesh Node Operator - Self-Executing Linux AppImage
TMPDIR=$(mktemp -d /tmp/wnode-appimage.XXXXXX)
ARCHIVE_LINE=$(grep -a -n "^__PAYLOAD_BELOW__" "$0" | cut -d: -f1)
tail -n +$((ARCHIVE_LINE + 1)) "$0" | tar -xz -C "$TMPDIR" 2>/dev/null
chmod +x "$TMPDIR/nodld-gui"
"$TMPDIR/nodld-gui" "$@"
STATUS=$?
rm -rf "$TMPDIR"
exit $STATUS
__PAYLOAD_BELOW__
EOF

cat /tmp/payload.tar.gz >> "$APPIMAGE_TARGET"
chmod +x "$APPIMAGE_TARGET"

cp "$APPIMAGE_TARGET" "$NODLR_APPIMAGE_TARGET"
chmod +x "$NODLR_APPIMAGE_TARGET"

rm -rf /tmp/appimage-stage /tmp/payload.tar.gz
echo "[✓] AppImage built successfully: $APPIMAGE_TARGET"
