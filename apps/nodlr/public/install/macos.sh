#!/bin/bash
set -e

# Wnode Headless Node Installer for macOS

if [ -z "$1" ]; then
  echo "Usage: curl -s <url> | bash -s <registration_token>"
  exit 1
fi

TOKEN=$1
VERSION="v1.0.0"
OS="darwin"
ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "arm64" ]; then
    ARCH="arm64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

BINARY_NAME="nodl-core-${OS}-${ARCH}"
DOWNLOAD_URL="https://github.com/wnode/node-operator/releases/download/${VERSION}/${BINARY_NAME}"

INSTALL_DIR="/usr/local/wnode"
BIN_DIR="/usr/local/bin"
CONFIG_DIR="$HOME/.wnode"

echo "Downloading Wnode Headless Node Operator ($ARCH)..."
sudo mkdir -p $INSTALL_DIR
mkdir -p $CONFIG_DIR
sudo curl -L -o ${INSTALL_DIR}/nodl-core $DOWNLOAD_URL
sudo chmod +x ${INSTALL_DIR}/nodl-core
sudo ln -sf ${INSTALL_DIR}/nodl-core ${BIN_DIR}/nodl-core

echo "Writing registration token..."
echo "$TOKEN" > ${CONFIG_DIR}/token
chmod 600 ${CONFIG_DIR}/token

echo "Creating launchd service..."
mkdir -p ~/Library/LaunchAgents
cat <<EOF > ~/Library/LaunchAgents/one.wnode.headless.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>one.wnode.headless</string>
    <key>ProgramArguments</key>
    <array>
        <string>${BIN_DIR}/nodl-core</string>
        <string>--profile=earth-headless</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

launchctl unload ~/Library/LaunchAgents/one.wnode.headless.plist 2>/dev/null || true
launchctl load -w ~/Library/LaunchAgents/one.wnode.headless.plist

echo "Installation complete. Service 'one.wnode.headless' is running."
