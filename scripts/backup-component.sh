#!/bin/bash

# NativeWind Component Backup Script
# Usage: ./scripts/backup-component.sh <component-file-path>
# Example: ./scripts/backup-component.sh apps/web/src/components/SignUpForm.tsx

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[BACKUP]${NC} $1"
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

# Check if component file path is provided
if [ $# -eq 0 ]; then
    print_error "No component file path provided"
    echo "Usage: $0 <component-file-path>"
    echo "Example: $0 apps/web/src/components/SignUpForm.tsx"
    exit 1
fi

COMPONENT_FILE="$1"

# Check if file exists
if [ ! -f "$COMPONENT_FILE" ]; then
    print_error "File does not exist: $COMPONENT_FILE"
    exit 1
fi

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup filename
BACKUP_FILE="${COMPONENT_FILE}.backup.${TIMESTAMP}"

print_status "Creating backup of $COMPONENT_FILE"

# Create backup
cp "$COMPONENT_FILE" "$BACKUP_FILE"

# Verify backup was created successfully
if [ -f "$BACKUP_FILE" ]; then
    print_success "Backup created: $BACKUP_FILE"

    # Display file info
    echo ""
    echo "Original file: $COMPONENT_FILE"
    echo "Backup file:   $BACKUP_FILE"
    echo "Timestamp:     $TIMESTAMP"
    echo ""

    # Show file sizes
    ORIGINAL_SIZE=$(wc -c < "$COMPONENT_FILE")
    BACKUP_SIZE=$(wc -c < "$BACKUP_FILE")

    echo "Original size: $ORIGINAL_SIZE bytes"
    echo "Backup size:   $BACKUP_SIZE bytes"

    # Verify sizes match
    if [ "$ORIGINAL_SIZE" -eq "$BACKUP_SIZE" ]; then
        print_success "Backup verification: File sizes match"
    else
        print_error "Backup verification: File sizes do not match!"
        exit 1
    fi

    # Create backup log entry
    BACKUP_LOG="backups/backup-log.txt"
    mkdir -p "$(dirname "$BACKUP_LOG")"

    echo "$(date '+%Y-%m-%d %H:%M:%S') | BACKUP | $COMPONENT_FILE -> $BACKUP_FILE" >> "$BACKUP_LOG"

    print_success "Backup logged to $BACKUP_LOG"

    # Show recent backups for this component
    echo ""
    print_status "Recent backups for this component:"
    ls -la "${COMPONENT_FILE}.backup."* 2>/dev/null | tail -5 || echo "No previous backups found"

else
    print_error "Failed to create backup"
    exit 1
fi

echo ""
print_success "Component backup completed successfully!"
print_warning "Remember to test your changes and use rollback-component.sh if needed"
