#!/bin/bash
set -e

echo "Waiting for services to boot..."
sleep 8

echo "Running Smoke Tests..."

# Define targets: URL, Expected Code (or codes)
declare -a targets=(
  "http://127.0.0.1:3002/login|200" # nodlr
  "http://127.0.0.1:3001/auth/login|200" # command
  "http://127.0.0.1:3003/login|200" # mesh
  "http://127.0.0.1:3003/api/auth/login|405" # mesh unified auth route
  "http://127.0.0.1:3004/signup|200" # web
  "http://127.0.0.1:8080/api/v1/jobs|401" # backend api check (auth required)
)

failed=0
for entry in "${targets[@]}"; do
  IFS='|' read -r url expected <<< "$entry"
  
  # Fetch HTTP status code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  
  if [ "$code" == "$expected" ]; then
    echo "✓ $url status is $code (Expected: $expected)"
  else
    echo "✗ FAIL: $url status is $code (Expected: $expected)"
    failed=$((failed + 1))
  fi
done

if [ $failed -gt 0 ]; then
  echo "Smoke tests failed with $failed errors."
  exit 1
fi

echo "All smoke tests passed successfully!"
