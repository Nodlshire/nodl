#!/bin/bash
cd /home/obregan/Documents/nodl/node-operator

rm -rf ~/.wnode-node1 ~/.wnode-node2 ~/.wnode-node3

# We will run 3 nodes with separate WNODE_DIR environment variables
WNODE_DIR=~/.wnode-node1 CMD_API_URL=http://127.0.0.1:3001 ./build/node-operator --headless &
PID1=$!

WNODE_DIR=~/.wnode-node2 CMD_API_URL=http://127.0.0.1:3001 ./build/node-operator --headless &
PID2=$!

WNODE_DIR=~/.wnode-node3 CMD_API_URL=http://127.0.0.1:3001 ./build/node-operator --headless &
PID3=$!

echo "Nodes started with PIDs: $PID1 $PID2 $PID3"
