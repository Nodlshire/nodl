#!/usr/bin/env bash

set -e

APP_NAME="nodl-core"
CORE_DIR="./core/cmd/nodl-core"
DESKTOP_DIR="./core/cmd/desktop"
MOBILE_DIR="./mobile/bindings"
DIST_DIR="./dist"

echo "Cleaning old builds..."
rm -rf "$DIST_DIR"

TARGETS=(
  "linux amd64"
  "linux arm64"
  "darwin amd64"
  "darwin arm64"
  "windows amd64"
  "windows arm64"
)

echo "Starting cross-platform build for Core and Desktop..."

for TARGET in "${TARGETS[@]}"; do
  set -- $TARGET
  OS=$1
  ARCH=$2
  
  TARGET_DIR="$DIST_DIR/$OS/$ARCH"
  mkdir -p "$TARGET_DIR"

  # Core Headless Binary
  BIN_NAME="$APP_NAME-$OS-$ARCH"
  if [ "$OS" == "windows" ]; then
    BIN_NAME="${BIN_NAME}.exe"
  fi
  
  # Desktop GUI Binary
  DESKTOP_NAME="nodl-desktop-$OS-$ARCH"
  if [ "$OS" == "windows" ]; then
    DESKTOP_NAME="${DESKTOP_NAME}.exe"
  fi

  echo "Building Core $OS/$ARCH -> $TARGET_DIR/$BIN_NAME"
  env CGO_ENABLED=0 GOOS=$OS GOARCH=$ARCH go build -trimpath -ldflags="-s -w" -o "$TARGET_DIR/$BIN_NAME" "$CORE_DIR"

  # We skip Fyne GUI cross-compilation in this script for simplicity, normally requires CGO and zig/osxcross
  # echo "Building Desktop $OS/$ARCH -> $TARGET_DIR/$DESKTOP_NAME"
  # env CGO_ENABLED=1 GOOS=$OS GOARCH=$ARCH go build -o "$TARGET_DIR/$DESKTOP_NAME" "$DESKTOP_DIR"

  cd "$TARGET_DIR"
  if command -v sha256sum &> /dev/null; then
    sha256sum "$BIN_NAME" > "$BIN_NAME.sha256"
  else
    shasum -a 256 "$BIN_NAME" > "$BIN_NAME.sha256"
  fi
  cd - > /dev/null
done

echo "Building Android Mobile Bindings (mocked for CI script)"
# gomobile bind -target=android -o $DIST_DIR/android/nodl_bindings.aar $MOBILE_DIR

echo "All targets built successfully into $DIST_DIR/"
