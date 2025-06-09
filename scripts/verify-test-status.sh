#!/bin/bash

# Test Status Verification Script
# Prevents common testing failures by checking prerequisites

echo "🔍 Verifying Test Environment Status..."

# Check current directory
CURRENT_DIR=$(pwd)
if [[ ! "$CURRENT_DIR" == *"chat-frontier-flora" ]]; then
    echo "❌ ERROR: Must be run from chat-frontier-flora root directory"
    echo "Current: $CURRENT_DIR"
    exit 1
fi

# Check for required environment variables
echo "📋 Checking environment variables..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ ERROR: OPENAI_API_KEY not set (required for Stagehand)"
    exit 1
fi
echo "✅ OPENAI_API_KEY: Set"

# Check test framework files exist
echo "📋 Checking test files..."
if [ ! -f "e2e/stagehand-auth-test.spec.ts" ]; then
    echo "❌ ERROR: Localhost test file missing"
    exit 1
fi
if [ ! -f "e2e/stagehand-production-auth.spec.ts" ]; then
    echo "❌ ERROR: Production test file missing"
    exit 1
fi
echo "✅ Test files: Present"

# Check quarantined tests are not in active directory
QUARANTINED_COUNT=$(find e2e/ -name "*.spec.ts" -path "*/quarantined-playwright-tests/*" | wc -l)
ACTIVE_COUNT=$(find e2e/ -name "*.spec.ts" -not -path "*/quarantined-playwright-tests/*" | wc -l)
echo "📊 Test inventory: $ACTIVE_COUNT active, $QUARANTINED_COUNT quarantined"

if [ "$ACTIVE_COUNT" -ne 2 ]; then
    echo "⚠️  WARNING: Expected 2 active test files, found $ACTIVE_COUNT"
    echo "Active tests found:"
    find e2e/ -name "*.spec.ts" -not -path "*/quarantined-playwright-tests/*"
fi

# Check package.json test script
TEST_SCRIPT=$(grep -o '"test:e2e":[^"]*"[^"]*"' package.json || echo "NOT_FOUND")
if [[ "$TEST_SCRIPT" == *"stagehand"* ]]; then
    echo "✅ Test script: Configured for Stagehand"
else
    echo "❌ ERROR: Test script not configured for Stagehand"
    echo "Found: $TEST_SCRIPT"
    exit 1
fi

# Check for running Expo processes (can interfere with tests)
EXPO_PROCESSES=$(ps aux | grep -E "(expo|webpack)" | grep -v grep | wc -l)
if [ "$EXPO_PROCESSES" -gt 0 ]; then
    echo "⚠️  WARNING: $EXPO_PROCESSES Expo/Webpack processes running"
    echo "Consider stopping them if tests fail"
    ps aux | grep -E "(expo|webpack)" | grep -v grep | head -3
fi

# Check environment type
if [ -n "$DEPLOY_PREVIEW_URL" ]; then
    echo "🌐 Environment: Preview deployment ($DEPLOY_PREVIEW_URL)"
    echo "Will run: localhost + preview + production tests"
else
    echo "🏠 Environment: Localhost/Production"
    echo "Will run: localhost + production tests (preview skipped)"
fi

echo ""
echo "✅ Test environment verification complete!"
echo "🚀 Ready to run: npm run test:e2e"
