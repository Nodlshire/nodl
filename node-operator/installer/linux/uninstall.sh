#!/bin/bash
# Wnode Node Operator Uninstall Script (Linux)

echo "Stopping node-operator service..."
systemctl stop node-operator.service
systemctl disable node-operator.service

echo "Removing binary and service files..."
rm -f /usr/bin/node-operator
rm -f /etc/systemd/system/node-operator.service

echo "Uninstall complete."
# Note: Data directory /var/lib/node-operator is preserved by default.
