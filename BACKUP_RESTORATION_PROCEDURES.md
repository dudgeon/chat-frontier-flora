# Backup and Restoration Procedures

## Backup Locations

### Git Backup
- **Branch**: `gluestack-ui-pilot-backup`
- **Commit**: "BACKUP: Pre-Gluestack UI pilot baseline"
- **Location**: Local git repository
- **Commit Hash**: 2278582

### File System Backup
- **Location**: `../chat-frontier-flora-backup/`
- **Full Path**: `/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora-backup/`
- **Created**: June 8, 2025
- **Contents**: Complete project directory including all files, node_modules, and git history

## Restoration Procedures

### Option 1: Git Branch Restoration (Recommended)
```bash
# Switch to backup branch
git checkout gluestack-ui-pilot-backup

# Create new working branch from backup
git checkout -b gluestack-ui-pilot-restored

# Or reset main branch to backup state
git checkout main
git reset --hard gluestack-ui-pilot-backup
```

### Option 2: File System Restoration (Emergency)
```bash
# Navigate to parent directory
cd ..

# Remove current project (CAUTION!)
rm -rf chat-frontier-flora

# Restore from backup
cp -r chat-frontier-flora-backup chat-frontier-flora

# Navigate back to project
cd chat-frontier-flora
```

### Option 3: Selective File Restoration
```bash
# Restore specific files from backup
cp ../chat-frontier-flora-backup/path/to/file ./path/to/file

# Or restore specific directories
cp -r ../chat-frontier-flora-backup/apps/web/src/components/ ./apps/web/src/components/
```

## Verification Steps After Restoration

1. **Check git status**: `git status`
2. **Verify dependencies**: `npm install`
3. **Test development server**: `cd apps/web && npm run web`
4. **Run test suite**: `npm test`
5. **Run E2E tests**: `npm run test:e2e`

## Emergency Contacts and Escalation

- **Primary**: User approval required for any restoration
- **Documentation**: This file and `docs/REGRESSION_PREVENTION_PROTOCOL.md`
- **Rollback Triggers**: See regression prevention protocol for immediate rollback scenarios

## Backup Verification

- ✅ Git backup created: `gluestack-ui-pilot-backup` branch
- ✅ File system backup created: `../chat-frontier-flora-backup/`
- ✅ Backup procedures documented
- ✅ Restoration procedures tested and verified
