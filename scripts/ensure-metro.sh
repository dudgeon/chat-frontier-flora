#!/bin/bash
# Check if Metro is running on port 19006, start if not

if ! curl -s http://localhost:19006 > /dev/null 2>&1; then
    echo "🚀 Starting Metro server..."
    cd apps/web && npm run web > /dev/null 2>&1 &
    
    # Wait for Metro to start
    echo "⏳ Waiting for Metro to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:19006 > /dev/null 2>&1; then
            echo "✅ Metro is ready on port 19006"
            exit 0
        fi
        sleep 2
    done
    
    echo "❌ Metro failed to start"
    exit 1
else
    echo "✅ Metro already running on port 19006"
fi