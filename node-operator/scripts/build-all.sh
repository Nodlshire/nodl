#!/usr/bin/env bash

set -e

# Configuration
APP_NAME="node-operator"
SOURCE_DIR="./src/main"
DIST_DIR="./dist"

# Clean previous builds
echo "Cleaning old builds..."
rm -rf "$DIST_DIR"

# Targets matrix
# OS ARCH
TARGETS=(
  "linux amd64"
  "linux arm64"
  "darwin amd64"
  "darwin arm64"
  "windows amd64"
  "windows arm64"
)

echo "Starting cross-platform build..."

for TARGET in "${TARGETS[@]}"; do
  # Read os and arch into variables
  set -- $TARGET
  OS=$1
  ARCH=$2
  
  # Set directory structure
  TARGET_DIR="$DIST_DIR/$OS/$ARCH"
  mkdir -p "$TARGET_DIR"

  # Determine binary name and extension
  BIN_NAME="$APP_NAME-$OS-$ARCH"
  if [ "$OS" == "windows" ]; then
    BIN_NAME="${BIN_NAME}.exe"
  fi
  
  BIN_PATH="$TARGET_DIR/$BIN_NAME"

  echo "Building $OS/$ARCH -> $BIN_PATH"
  
  # Build statically linked binary
  env CGO_ENABLED=0 GOOS=$OS GOARCH=$ARCH \
    go build -trimpath -ldflags="-s -w" -o "$BIN_PATH" "$SOURCE_DIR"

  # Generate SHA-256 Checksum
  echo "Generating checksum for $BIN_NAME..."
  
  cd "$TARGET_DIR"
  if command -v sha256sum &> /dev/null; then
    sha256sum "$BIN_NAME" > "$BIN_NAME.sha256"
  else
    shasum -a 256 "$BIN_NAME" > "$BIN_NAME.sha256"
  fi
  cd - > /dev/null
  
  # Output binary size
  SIZE=$(du -h "$BIN_PATH" | cut -f1)
  echo "Done: $BIN_NAME ($SIZE)"
done

echo "All targets built successfully into $DIST_DIR/"
