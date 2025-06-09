# Quick Reference Guide - chat-frontier-flora

## 🚀 Essential Commands

### Development
```bash
# Check status before starting
npm run status:check

# Start development server (with verification)
npm run dev:safe

# Start development server (manual)
cd apps/web && npm run web
```

### Testing
```bash
# Verify test environment first
npm run verify:test-env

# Run tests safely (with verification)
npm run test:safe

# Run localhost tests only
npm run test:localhost

# Run production tests only
npm run test:production
```

### Troubleshooting
```bash
# Check current state
pwd && ps aux | grep expo | grep -v grep

# Kill all Expo processes
pkill -f "expo start"

# Verify server response
curl -s http://localhost:19006 | head -5

# Check environment variables
echo "OPENAI_API_KEY: $([ -n "$OPENAI_API_KEY" ] && echo 'Set' || echo 'Not set')"
echo "DEPLOY_PREVIEW_URL: $DEPLOY_PREVIEW_URL"
```

---

## 🔍 Status Indicators

### Webpack Compilation
- ✅ `web compiled with 1 warning` = SUCCESS
- ❌ `web compiled with 1 error` = BROKEN (must fix)

### Test Results
- ✅ `siteLoaded: true` = Site working
- ✅ `hasSignupForm: true` = Form available
- ✅ `formFieldsVisible: true` = Fields functional

### Environment Detection
- 🏠 No `DEPLOY_PREVIEW_URL` = Localhost/Production mode
- 🌐 `DEPLOY_PREVIEW_URL` set = Preview mode

---

## 🛠️ Common Fixes

### "Module not found" errors
```bash
# Check for Gluestack UI remnants
find . -name "*.tsx" -exec grep -l "gluestack" {} \;

# Restart clean server
pkill -f "expo start" && cd apps/web && npm run web
```

### Test failures
```bash
# Verify test framework
npm run verify:test-env

# Check quarantined tests
ls -la e2e/quarantined-playwright-tests/
```

### Directory confusion
```bash
# Always check location
pwd

# For Expo commands, must be in apps/web
cd apps/web
```

---

## 📋 Pre-Flight Checklist

Before any major operation:
- [ ] `pwd` shows `chat-frontier-flora`
- [ ] `npm run status:check` shows clean state
- [ ] `npm run verify:test-env` passes
- [ ] No compilation errors in terminal

---

## 🚨 Emergency Procedures

### If tests start failing unexpectedly
1. `npm run verify:test-env`
2. Check for Playwright tests in active directory
3. Verify Stagehand framework is being used
4. Check environment variables

### If development server won't start
1. `pkill -f "expo start"`
2. `cd apps/web`
3. `npm run web`
4. Wait for "web compiled with 1 warning"

### If deployment fails
1. Check Netlify build logs
2. Verify no compilation errors locally
3. Test preview deployment first
4. Never merge without preview testing

---

**Quick Help**: Run `npm run status:check` for instant environment overview
