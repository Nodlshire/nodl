#!/bin/bash
set -e
sudo useradd -r -s /bin/false wnode || true
sudo cp nodl-core /usr/local/bin/
sudo chmod +x /usr/local/bin/nodl-core
sudo mkdir -p /etc/wnode
sudo chown wnode:wnode /etc/wnode
sudo cp nodl-core.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nodl-core
sudo systemctl start nodl-core
