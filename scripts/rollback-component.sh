#!/bin/bash

# NativeWind Component Rollback Script
# Usage: ./scripts/rollback-component.sh <component-file-path> [backup-timestamp]
# Example: ./scripts/rollback-component.sh apps/web/src/components/SignUpForm.tsx
# Example: ./scripts/rollback-component.sh apps/web/src/components/SignUpForm.tsx 20241208_143022

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[ROLLBACK]${NC} $1"
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
    echo "Usage: $0 <component-file-path> [backup-timestamp]"
    echo "Example: $0 apps/web/src/components/SignUpForm.tsx"
    echo "Example: $0 apps/web/src/components/SignUpForm.tsx 20241208_143022"
    exit 1
fi

COMPONENT_FILE="$1"
BACKUP_TIMESTAMP="$2"

# Check if original component file exists
if [ ! -f "$COMPONENT_FILE" ]; then
    print_error "Component file does not exist: $COMPONENT_FILE"
    exit 1
fi

print_status "Looking for backups of $COMPONENT_FILE"

# Find available backups
BACKUP_FILES=($(ls "${COMPONENT_FILE}.backup."* 2>/dev/null | sort -r))

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    print_error "No backup files found for $COMPONENT_FILE"
    echo "Expected backup files with pattern: ${COMPONENT_FILE}.backup.*"
    exit 1
fi

# Determine which backup to use
if [ -n "$BACKUP_TIMESTAMP" ]; then
    # Use specific timestamp
    BACKUP_FILE="${COMPONENT_FILE}.backup.${BACKUP_TIMESTAMP}"

    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        echo ""
        print_status "Available backups:"
        for backup in "${BACKUP_FILES[@]}"; do
            echo "  $(basename "$backup")"
        done
        exit 1
    fi
else
    # Use most recent backup
    BACKUP_FILE="${BACKUP_FILES[0]}"
    print_status "Using most recent backup: $(basename "$BACKUP_FILE")"
fi

# Show backup info
echo ""
echo "Component file: $COMPONENT_FILE"
echo "Backup file:    $BACKUP_FILE"
echo ""

# Show file sizes and modification times
ORIGINAL_SIZE=$(wc -c < "$COMPONENT_FILE")
BACKUP_SIZE=$(wc -c < "$BACKUP_FILE")

echo "Current file size: $ORIGINAL_SIZE bytes"
echo "Backup file size:  $BACKUP_SIZE bytes"
echo ""

ORIGINAL_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$COMPONENT_FILE" 2>/dev/null || stat -c "%y" "$COMPONENT_FILE" 2>/dev/null || echo "Unknown")
BACKUP_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$BACKUP_FILE" 2>/dev/null || stat -c "%y" "$BACKUP_FILE" 2>/dev/null || echo "Unknown")

echo "Current file modified: $ORIGINAL_DATE"
echo "Backup file created:   $BACKUP_DATE"
echo ""

# Confirm rollback
print_warning "This will overwrite the current component file with the backup."
read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Rollback cancelled"
    exit 0
fi

# Create a backup of current state before rollback
ROLLBACK_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="${COMPONENT_FILE}.pre-rollback.${ROLLBACK_TIMESTAMP}"

print_status "Creating backup of current state: $(basename "$CURRENT_BACKUP")"
cp "$COMPONENT_FILE" "$CURRENT_BACKUP"

# Perform rollback
print_status "Rolling back $COMPONENT_FILE"
cp "$BACKUP_FILE" "$COMPONENT_FILE"

# Verify rollback
if [ -f "$COMPONENT_FILE" ]; then
    RESTORED_SIZE=$(wc -c < "$COMPONENT_FILE")

    if [ "$RESTORED_SIZE" -eq "$BACKUP_SIZE" ]; then
        print_success "Rollback completed successfully"

        # Log rollback
        BACKUP_LOG="backups/backup-log.txt"
        mkdir -p "$(dirname "$BACKUP_LOG")"

        echo "$(date '+%Y-%m-%d %H:%M:%S') | ROLLBACK | $BACKUP_FILE -> $COMPONENT_FILE" >> "$BACKUP_LOG"

        print_success "Rollback logged to $BACKUP_LOG"

        echo ""
        echo "Files created during rollback:"
        echo "  Current state backup: $CURRENT_BACKUP"
        echo "  Restored from:        $BACKUP_FILE"

    else
        print_error "Rollback verification failed: File sizes do not match"
        print_error "Expected: $BACKUP_SIZE bytes, Got: $RESTORED_SIZE bytes"
        exit 1
    fi
else
    print_error "Rollback failed: Component file not found after restore"
    exit 1
fi

echo ""
print_success "Component rollback completed successfully!"
print_status "Remember to restart your development server to see the changes"
print_status "Command: cd apps/web && npm run web"

# Show available backups after rollback
echo ""
print_status "Available backups for this component:"
ls -la "${COMPONENT_FILE}.backup."* "${COMPONENT_FILE}.pre-rollback."* 2>/dev/null | tail -10 || echo "No backups found"
