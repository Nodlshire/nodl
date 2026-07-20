#!/bin/bash
set -e
echo "[+] Starting WNode Operator Standalone Installation..."
sudo mkdir -p /etc/wnode
ARCH=$(uname -m)
case "$ARCH" in
    x86_64)
        TAR_FILE="nodl-core-linux-amd64.tar.gz"
        BIN_NAME="nodl-core-linux-amd64"
        EXPECTED_HASH="da53a95e4ab4bd6f5aa0eda5aec09e820f27288b87088b91b734ad768ddb9c24"
        ;;
    aarch64|arm64)
        TAR_FILE="nodl-core-linux-arm64.tar.gz"
        BIN_NAME="nodl-core-linux-arm64"
        EXPECTED_HASH="a45d27390b58882e10b15ad8e44c3394b6fc56a6ca5b0c162231e22f2f409b19"
        ;;
    *)
        echo "[-] Unsupported architecture: $ARCH"
        exit 1
        ;;
esac
echo "[+] Detected architecture: $ARCH. Target build: $TAR_FILE"
BINARY_URL="https://github.com/wnodeltd/wnode/releases/download/v1.1.0/$TAR_FILE"
echo "[+] Downloading binary from $BINARY_URL..."
sudo curl -fsSL -L "$BINARY_URL" -o "/tmp/$TAR_FILE" || {
  echo "[-] Failed to download binary from GitHub. Exiting."
  exit 1
}
echo "[+] Verifying checksum..."
ACTUAL_HASH=$(sha256sum "/tmp/$TAR_FILE" | awk '{print $1}')
if [ "$ACTUAL_HASH" != "$EXPECTED_HASH" ]; then
    echo "[-] Checksum mismatch! Expected: $EXPECTED_HASH, Got: $ACTUAL_HASH"
    exit 1
fi
echo "[+] Checksum verified."
echo "[+] Extracting binary..."
tar -xzf "/tmp/$TAR_FILE" -C /tmp
sudo mv "/tmp/$BIN_NAME" /usr/local/bin/nodl-core
sudo chmod +x /usr/local/bin/nodl-core

echo "[+] Setting up environment..."
echo "NODLD_API_URL=https://api.wnode.one" | sudo tee /etc/wnode/.env > /dev/null

echo "[+] Configuring systemd service..."
sudo curl -fsSL "https://raw.githubusercontent.com/wnodeltd/wnode/main/node-operator/installer/linux/nodl-core.service" -o /etc/systemd/system/nodl-core.service || sudo tee /etc/systemd/system/nodl-core.service > /dev/null << 'SVC'
[Unit]
Description=Wnode Operator Core Daemon
Documentation=https://wnode.network/docs
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
Group=root
EnvironmentFile=-/etc/wnode/.env
ExecStart=/usr/local/bin/nodl-core --profile=earth-headless --api=${NODLD_API_URL}
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
ProtectSystem=full
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SVC

sudo systemctl daemon-reload
sudo systemctl enable nodl-core.service
sudo systemctl restart nodl-core.service
echo "[+] WNode Operator successfully installed and started!"
