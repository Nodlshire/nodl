#!/bin/bash
echo "===================================================="
echo "STEP 1 — Start Backend Services"
echo "===================================================="

start_service() {
  local name=$1
  local cmd=$2
  local port=$3
  echo "Starting $name on port $port..."
  eval "PORT=$port $cmd > /dev/null 2>&1 &"
  local pid=$!
  echo "PID: $pid"
  sleep 5
  echo "Port $port status:"
  ss -tuln | grep ":$port " || echo "Not listening"
  echo "---"
}

start_service "nodld backend" "./nodld_bin" 8081
start_service "mesh-backend" "npm start --prefix apps/mesh" 8082
start_service "wnoder-backend" "npm start --prefix apps/wnoder" 8083
start_service "command-backend" "npm start --prefix apps/command" 8084

echo "===================================================="
echo "STEP 2 — Start Frontends"
echo "===================================================="

start_service "apps/wnoder" "npm start --prefix apps/wnoder" 3002
start_service "apps/mesh" "npm start --prefix apps/mesh" 3001
start_service "apps/command" "npm start --prefix apps/command" 3000
