# CRITICAL: Entry Point Configuration Warning

## Important Configuration
**package.json `"main"` field MUST be set to `"index.ts"`** - NOT `"test-entry.ts"`

## Issue History
During Metro configuration debugging, we temporarily changed the entry point to `test-entry.ts` for testing minimal compilation. This caused the real app authentication routing to be replaced with a test component.

## Current Status
- ✅ **Correct**: `"main": "index.ts"` → Real app with authentication routing
- ❌ **Wrong**: `"main": "test-entry.ts"` → Test component only

## Files Affected
- `apps/web/package.json` - Main entry point configuration
- `apps/web/index.ts` - Real app entry (imports App.tsx)
- `apps/web/test-entry.ts` - Test component (keep for debugging but don't use as main)

## Verification
Run Puppeteer test to verify authentication forms appear:
```bash
node test-auth-routing.js
```

Should show login/signup forms, NOT "🚀 Metro Minimal Test" message.