#!/bin/bash
set -e
sudo cp nodl-core /usr/local/bin/
sudo chmod +x /usr/local/bin/nodl-core
sudo mkdir -p /Library/Logs/Wnode
sudo cp com.nodl.core.plist /Library/LaunchDaemons/
sudo launchctl load -w /Library/LaunchDaemons/com.nodl.core.plist
