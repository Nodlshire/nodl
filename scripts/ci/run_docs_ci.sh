#!/usr/bin/env bash
set -eo pipefail

echo "==========================================================="
echo "WNODE ENTERPRISE DOCUMENTATION CI/CD ENFORCEMENT SUITE"
echo "==========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

echo ""
echo "--> STEP 1: Running Markdown SOT Linter..."
python3 scripts/seo/markdown_linter.py
MD_EXIT=$?

if [ $MD_EXIT -ne 0 ]; then
    echo "❌ CI FAIL: Markdown SOT Linter failed!"
    exit 1
fi

echo ""
echo "--> STEP 2: Running TSX Page Linter..."
python3 scripts/seo/tsx_linter.py
TSX_EXIT=$?

if [ $TSX_EXIT -ne 0 ]; then
    echo "❌ CI FAIL: TSX Page Linter failed!"
    exit 1
fi

echo ""
echo "--> STEP 3: Running Deterministic TDD Harness..."
python3 scripts/seo/tdd_harness.py
HARNESS_EXIT=$?

if [ $HARNESS_EXIT -ne 0 ]; then
    echo "❌ CI FAIL: Deterministic TDD Harness failed!"
    exit 1
fi

echo ""
echo "==========================================================="
echo "✅ SUCCESS: All Documentation CI/CD Enforcements Passed!"
echo "==========================================================="
exit 0
