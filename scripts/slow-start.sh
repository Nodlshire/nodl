#!/bin/bash

# Fedora Network Compatibility: Force 127.0.0.1
export HOST=127.0.0.1

LOG_DIR="/home/obregan/Documents/nodl/logs"
mkdir -p "$LOG_DIR"

echo "🐢 Starting services slowly (20s delay between each)..."

# 1. Redis
echo "[1/7] Starting Redis..."
nohup redis-server > "$LOG_DIR/redis.log" 2>&1 &
sleep 20

# 2. nodld
echo "[2/7] Starting nodld..."
cd /home/obregan/Documents/nodl/nodld
nohup go run cmd/nodld/main.go > "$LOG_DIR/nodld.log" 2>&1 &
sleep 20


# 5. mesh
echo "[5/7] Starting mesh..."
cd /home/obregan/Documents/nodl/apps/mesh
nohup npm run dev > "$LOG_DIR/mesh.log" 2>&1 &
sleep 20

# 6. command
echo "[6/7] Starting command..."
cd /home/obregan/Documents/nodl/apps/command
nohup npm run dev > "$LOG_DIR/command.log" 2>&1 &
sleep 20

# 7. web
echo "[7/7] Starting web..."
cd /home/obregan/Documents/nodl/apps/web
nohup npm run dev > "$LOG_DIR/web.log" 2>&1 &

echo "✅ All services initiated. Checking status in 10s..."
sleep 10

ps aux | grep -E "redis-server|nodld|next-dev|npm" | grep -v grep

echo "🚀 Done."
