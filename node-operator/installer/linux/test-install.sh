#!/bin/bash
set -e

echo "[+] Starting WNode Operator Standalone Installation..."

# 1. Setup local configuration directory
sudo mkdir -p /etc/wnode

# 2. Determine system architecture
ARCH=$(uname -m)
BINARY_NAME="wnode-operator-linux-amd64"

if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  BINARY_NAME="wnode-operator-linux-arm64"
fi

echo "[+] Detected architecture: $ARCH. Target binary: $BINARY_NAME"

# 3. Download the pre-compiled binary from GitHub staging
BINARY_URL="https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/bin/$BINARY_NAME"
echo "[+] Downloading binary from $BINARY_URL..."
sudo curl -fsSL "$BINARY_URL" -o /usr/local/bin/wnode-operator || {
  echo "[-] Failed to download binary from GitHub. Exiting."
  exit 1
}

sudo chmod +x /usr/local/bin/wnode-operator

# 4. Configure systemd service
echo "[+] Configuring systemd service..."
SYSTEMD_URL="https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/installer/linux/nodl-core.service"
sudo curl -fsSL "$SYSTEMD_URL" -o /etc/systemd/system/nodl-core.service || {
  # Fallback: create a basic service file inline if the fetch fails
  sudo tee /etc/systemd/system/nodl-core.service > /dev/null << 'SVC'
[Unit]
Description=WNode Core Operator
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/wnode-operator run
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVC
}

# 5. Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable nodl-core.service
sudo systemctl restart nodl-core.service

echo "[+] WNode Operator successfully installed and started!"
