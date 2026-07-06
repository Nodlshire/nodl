#!/bin/bash
set -e

echo "Stopping and deleting PM2 process registry..."
pm2 delete all || true

echo "Evicting Next.js build caches (.next, .turbo, dist)..."
find . -type d -name ".next" -prune -exec rm -rf {} \;
find . -type d -name ".turbo" -prune -exec rm -rf {} \;
find . -type d -name "dist" -prune -exec rm -rf {} \;
find . -name ".cache" -path "*/node_modules/*" -type d -exec rm -rf {} +

echo "Galaxy Purged. Ready for clean build."
