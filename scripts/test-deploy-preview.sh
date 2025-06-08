#!/bin/bash

# 🚀 Test Deploy Preview Script
#
# Usage:
#   ./scripts/test-deploy-preview.sh https://deploy-preview-123--your-site.netlify.app
#   ./scripts/test-deploy-preview.sh https://your-production-site.netlify.app
#
# This script runs the same tests that execute in CI against deploy previews

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if URL is provided
if [ -z "$1" ]; then
    print_error "Please provide a deploy preview URL"
    echo "Usage: $0 <deploy-preview-url>"
    echo "Example: $0 https://deploy-preview-123--your-site.netlify.app"
    exit 1
fi

DEPLOY_URL="$1"
PRODUCTION_URL="${2:-https://chat-frontier-flora.netlify.app}"

print_status "Testing deploy preview: $DEPLOY_URL"
print_status "Production URL for comparison: $PRODUCTION_URL"

# Check if the URL is accessible
print_status "Checking if deploy preview is accessible..."
if ! curl -s --head "$DEPLOY_URL" | head -n 1 | grep -q "200 OK"; then
    print_error "Deploy preview URL is not accessible: $DEPLOY_URL"
    exit 1
fi
print_success "Deploy preview is accessible"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm ci
fi

# Install Playwright browsers if needed
if [ ! -d "node_modules/@playwright" ]; then
    print_status "Installing Playwright browsers..."
    npx playwright install
fi

# Set environment variables
export DEPLOY_PREVIEW_URL="$DEPLOY_URL"
export PRODUCTION_URL="$PRODUCTION_URL"

print_status "Running Playwright tests against deploy preview..."

# Run the deploy preview tests
if npm run test:preview; then
    print_success "Playwright tests passed!"
else
    print_error "Playwright tests failed!"
    exit 1
fi

print_status "Running accessibility tests..."

# Run accessibility tests
if npm run test:a11y; then
    print_success "Accessibility tests passed!"
else
    print_warning "Accessibility tests failed - check the report for details"
fi

# Run Lighthouse audit if lighthouse is available
if command -v lighthouse &> /dev/null; then
    print_status "Running Lighthouse performance audit..."

    # Create reports directory
    mkdir -p reports

    # Run Lighthouse
    lighthouse "$DEPLOY_URL" \
        --output=html \
        --output-path=reports/lighthouse-report.html \
        --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
        --quiet

    print_success "Lighthouse report generated: reports/lighthouse-report.html"
else
    print_warning "Lighthouse not installed - skipping performance audit"
    print_status "To install Lighthouse: npm install -g lighthouse"
fi

# Generate summary
print_status "Test Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎭 Deploy Preview Tests: ✅ Completed"
echo "♿ Accessibility Tests: ✅ Completed"
echo "📊 Performance Audit: $([ -f reports/lighthouse-report.html ] && echo "✅ Completed" || echo "⚠️ Skipped")"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Reports generated:"
echo "  • Playwright Report: playwright-report/index.html"
echo "  • Test Results: test-results/"
if [ -f reports/lighthouse-report.html ]; then
    echo "  • Lighthouse Report: reports/lighthouse-report.html"
fi
echo ""
print_success "All tests completed! Check the reports for detailed results."

# Open reports if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "Open Playwright report in browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open playwright-report/index.html
    fi
fi
