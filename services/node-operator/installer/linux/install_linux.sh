#!/bin/bash
set -e

TOKEN="${NODL_DEVICE_TOKEN:-$1}"
API_BASE="${NODL_API_BASE:-https://nodlr.wnode.one}"

echo "[NODL] Installing NODL Node Operator Headless Daemon..."

sudo mkdir -p /usr/local/bin /etc/nodl

if [ -f "./nodl-core" ]; then
    sudo cp ./nodl-core /usr/local/bin/nodl-core
else
    ARCH=$(uname -m)
    if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
        curl -sSL "https://nodlr.wnode.one/releases/nodl-core-linux-arm64" -o /tmp/nodl-core
    else
        curl -sSL "https://nodlr.wnode.one/releases/nodl-core-linux-amd64" -o /tmp/nodl-core
    fi
    sudo mv /tmp/nodl-core /usr/local/bin/nodl-core
fi

sudo chmod +x /usr/local/bin/nodl-core

if [ -n "$TOKEN" ]; then
    echo "$TOKEN" | sudo tee /etc/nodl/token > /dev/null
    sudo chmod 600 /etc/nodl/token
fi

cat <<EOF | sudo tee /etc/systemd/system/nodl-core.service > /dev/null
[Unit]
Description=NODL Node Operator Core Daemon
Documentation=https://nodlr.wnode.one
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
Environment=NODL_API_BASE=${API_BASE}
ExecStart=/usr/local/bin/nodl-core --profile earth
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now nodl-core

echo "[NODL] Installation complete! Daemon enabled & started via systemd."
