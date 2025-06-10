#!/usr/bin/env bash
set -euo pipefail

# Codex Startup Script for chat-frontier-flora
# Installs dependencies and verifies environment

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "==> Initializing Codex environment..."

# Ensure Node 18 is available
REQUIRED_NODE="18"
if ! command -v node >/dev/null 2>&1; then
  echo "Node not found. Installing Node $REQUIRED_NODE via nvm" >&2
fi

if command -v node >/dev/null 2>&1; then
  NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
else
  NODE_MAJOR="0"
fi

if [ "$NODE_MAJOR" != "$REQUIRED_NODE" ]; then
  if ! command -v nvm >/dev/null 2>&1; then
    echo "Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  else
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  fi
  echo "Installing Node 18..."
  nvm install 18
  nvm use 18
fi

node -v
npm -v

# Install npm dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Python dependencies (if any)
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

# Verify environment
npm run status:check || true
./scripts/verify-test-status.sh || true

echo "==> Codex environment setup complete"
