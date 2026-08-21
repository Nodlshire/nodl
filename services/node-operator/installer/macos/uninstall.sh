#!/bin/bash
# Wnode Node Operator Uninstall Script (macOS)

echo "Unloading LaunchDaemon..."
launchctl unload /Library/LaunchDaemons/one.wnode.operator.plist

echo "Removing binary and daemon plist..."
rm -f /usr/local/bin/node-operator
rm -f /Library/LaunchDaemons/one.wnode.operator.plist

echo "Uninstall complete."
# Note: Application Support data is preserved.
