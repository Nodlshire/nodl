#!/bin/bash
set -e

# Wnode Headless Node Installer for Linux

if [ -z "$1" ]; then
  echo "Usage: curl -s <url> | bash -s <registration_token>"
  exit 1
fi

TOKEN=$1
VERSION="v1.0.0"
OS="linux"
ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="arm64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

BINARY_NAME="nodl-core-linux-${ARCH}"
DOWNLOAD_URL="https://github.com/wnodeltd/wnode/releases/download/${VERSION}/${BINARY_NAME}"

INSTALL_DIR="/opt/wnode"
BIN_DIR="/usr/local/bin"
CONFIG_DIR="/etc/wnode"

echo "Downloading Wnode Headless Node Operator ($ARCH)..."
sudo mkdir -p $INSTALL_DIR
sudo mkdir -p $CONFIG_DIR
sudo curl -L -o ${INSTALL_DIR}/nodl-core $DOWNLOAD_URL
sudo chmod +x ${INSTALL_DIR}/nodl-core
sudo ln -sf ${INSTALL_DIR}/nodl-core ${BIN_DIR}/nodl-core

echo "Writing registration token..."
echo "$TOKEN" | sudo tee ${CONFIG_DIR}/token > /dev/null
sudo chmod 600 ${CONFIG_DIR}/token

echo "Creating systemd service..."
cat <<EOF | sudo tee /etc/systemd/system/wnode-no.service > /dev/null
[Unit]
Description=Wnode Headless Node Operator
After=network.target

[Service]
ExecStart=${BIN_DIR}/nodl-core --profile=earth-headless
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable wnode-no
sudo systemctl restart wnode-no

echo "Installation complete. Service 'wnode-no' is running."
