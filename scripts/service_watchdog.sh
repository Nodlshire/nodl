#!/usr/bin/env bash
# Wnode Service Resilience Watchdog Script
# Automatically monitors and recovers all backend, frontend, and reverse proxy services.

export PATH=/home/obregan/.local/bin:/home/obregan/.hermes/node/bin:/usr/local/bin:/usr/bin:$PATH
export PM2_HOME=/home/obregan/.pm2
WORKDIR="/home/obregan/Documents/nodl"

check_port() {
  local port=$1
  nc -z 127.0.0.1 $port >/dev/null 2>&1 || curl -s --connect-timeout 2 http://127.0.0.1:$port >/dev/null 2>&1
}

PORTS=(8080 3001 3002 3003 3004 80)
DOWN=0

for port in "${PORTS[@]}"; do
  if ! check_port $port; then
    echo "$(date -u) [WATCHDOG ALERT] Port $port is offline!"
    DOWN=1
  fi
done

if [ $DOWN -eq 1 ]; then
  echo "$(date -u) [WATCHDOG ACTION] Resurrecting PM2 process tree..."
  /home/obregan/.local/bin/pm2 resurrect >> /home/obregan/.pm2/watchdog.log 2>&1
  sleep 5

  # Re-test ports
  STILL_DOWN=0
  for port in "${PORTS[@]}"; do
    if ! check_port $port; then
      STILL_DOWN=1
      break
    fi
  done

  if [ $STILL_DOWN -eq 1 ]; then
    echo "$(date -u) [WATCHDOG ACTION] Restarting full ecosystem from config..."
    /home/obregan/.local/bin/pm2 start /home/obregan/Documents/nodl/ecosystem.config.js >> /home/obregan/.pm2/watchdog.log 2>&1
    /home/obregan/.local/bin/pm2 save >> /home/obregan/.pm2/watchdog.log 2>&1
  fi
fi
