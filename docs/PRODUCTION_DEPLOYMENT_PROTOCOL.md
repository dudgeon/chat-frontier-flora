# Production Deployment Protocol
## MANDATORY PROCEDURES FOR CHAT-FRONTIER-FLORA

### 🚨 CRITICAL FAILURE PREVENTION RULES

**ABSOLUTE RULE #1: NEVER MERGE TO MAIN WITHOUT PREVIEW TESTING**
- Merging directly to main without preview deployment testing is a **CRITICAL FAILURE**
- This wastes time, money, and breaks user trust
- AI must STOP immediately if attempting to bypass this workflow

**ABSOLUTE RULE #2: ALWAYS RUN FROM APPS/WEB DIRECTORY**
- Expo commands MUST ALWAYS be run from `apps/web` directory, never from root
- Running from root causes "Module not found: Can't resolve '../../App'" error
- Before ANY Expo command: `cd apps/web` first

### 📋 MANDATORY 5-STEP DEPLOYMENT WORKFLOW

#### Step 1: Local Development & Testing
```bash
# ALWAYS run from apps/web directory
cd apps/web
npm run web

# Verify compilation success
# ✅ REQUIRED: "web compiled with 1 warning" (vm warning is normal)
# ❌ FAILURE: "web compiled with 1 error" means BROKEN - must fix first

# Verify server response
curl -s http://localhost:19006 | head -5

# Run E2E tests for localhost ONLY
cd ../../
npm run test:localhost
```

**VERIFICATION CHECKLIST:**
- [ ] Server compiles with "web compiled with 1 warning" (not error)
- [ ] HTTP 200 response from localhost:19006
- [ ] JavaScript bundle loads correctly
- [ ] E2E tests pass or show expected functionality
- [ ] Manual testing confirms all features work

#### Step 2: Create Feature Branch & PR
```bash
# Create feature branch (NEVER work directly on main)
git checkout -b feature/description-of-changes

# Commit changes with descriptive message
git add .
git commit -m "feat: detailed description of changes with verification status"

# Push to feature branch
git push origin feature/description-of-changes

# Create PR via GitHub UI or CLI
gh pr create --title "Feature: Description" --body "Detailed description and testing notes"
```

#### Step 3: Preview Deployment Testing
```bash
# PR automatically triggers preview deployment
# Wait for preview URL (format: https://deploy-preview-X--frontier-family-flora.netlify.app/)

# Test preview deployment thoroughly
curl -s https://deploy-preview-X--frontier-family-flora.netlify.app/ | head -5

# Run E2E tests against preview (if configured)
DEPLOY_PREVIEW_URL=https://deploy-preview-X--frontier-family-flora.netlify.app/ npm run test:preview
```

**PREVIEW VERIFICATION CHECKLIST:**
- [ ] Preview deployment builds successfully
- [ ] Preview URL loads correctly
- [ ] All functionality works on preview
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified
- [ ] Authentication flow tested end-to-end

#### Step 4: CI/CD Verification
```bash
# Verify all CI checks pass
gh pr checks

# Review any failed checks and fix issues
# Re-run tests if needed
```

**CI VERIFICATION CHECKLIST:**
- [ ] All automated tests pass
- [ ] Build process completes successfully
- [ ] No linting errors
- [ ] Security scans pass
- [ ] Performance benchmarks meet requirements

#### Step 5: Production Deployment
```bash
# ONLY after preview testing and CI pass
gh pr merge --squash

# Verify production deployment status
netlify api listSiteDeploys --data='{"site_id":"a2e3354b-f93c-4875-9c4d-0afb9dbdf6b9"}' | head -20

# Wait 2-10 minutes for deployment to complete
# Check deployment state is "ready" not "error" or "building"

# Test production URL
curl -s https://frontier-family-flora.netlify.app/ | head -5

# Run production verification tests
npm run test:production
```

**PRODUCTION VERIFICATION CHECKLIST:**
- [ ] Netlify deployment status shows "ready"
- [ ] Production URL responds correctly
- [ ] New bundle files deployed (check JS/CSS filenames)
- [ ] All critical user flows work
- [ ] No regressions introduced

### 🛑 EMERGENCY ROLLBACK PROCEDURES

#### Immediate Rollback (if production is broken)
```bash
# Revert the merge commit
git revert HEAD -m 1
git push origin main

# Or rollback to previous deployment in Netlify UI
# Site Settings > Deploys > [Previous Deploy] > Publish Deploy
```

#### Investigation & Fix
```bash
# Check deployment logs
netlify api getSiteDeploy --data='{"deploy_id":"DEPLOY_ID"}'

# Check browser console for errors
# Check server logs for backend issues
# Run local tests to reproduce issue
```

### 🚫 PROHIBITED ACTIONS

**NEVER DO THESE:**
- ❌ `git push origin main` without PR and preview testing
- ❌ Run Expo commands from root directory
- ❌ Merge PR without preview deployment verification
- ❌ Deploy to production without local testing first
- ❌ Claim success without evidence (curl, tests, user confirmation)
- ❌ Skip E2E testing for critical changes
- ❌ Ignore compilation errors or warnings

### 📊 STATUS COMMUNICATION PROTOCOL

**Use Clear Status Indicators:**
- ✅ **VERIFIED WORKING** - All 5 verification steps completed with evidence
- ⚠️ **PARTIALLY WORKING** - Some features work, specify what doesn't
- ❌ **BROKEN** - Compilation errors, server failures, or critical bugs
- 🔄 **IN PROGRESS** - Currently making changes or running tests
- ❓ **UNKNOWN** - Need to investigate or verify status

**Evidence Requirements:**
- Always show terminal output for compilation status
- Include curl responses for server verification
- Document test results with specific pass/fail counts
- Screenshot critical UI states when needed

### 🔧 TROUBLESHOOTING COMMON ISSUES

#### Server Won't Start
```bash
# Kill existing processes
pkill -f "expo start"

# Clear cache and restart
cd apps/web
npm run web -- --clear
```

#### Compilation Errors
```bash
# Check for babel configuration issues
# Verify NativeWind setup in babel.config.js
# Ensure all imports are correct
# Check for TypeScript errors
```

#### E2E Test Failures
```bash
# Check if tests are running against correct environment
# Verify Stagehand configuration
# Check for UI changes that break selectors
# Review test screenshots in test-results/ directory
```

### 📝 DOCUMENTATION REQUIREMENTS

**Every deployment must include:**
- Detailed commit message explaining changes
- PR description with testing notes
- Evidence of successful local testing
- Confirmation of preview deployment testing
- Production verification results

### 🎯 SUCCESS METRICS

**Deployment is successful when:**
- All 5 workflow steps completed
- No regressions in critical user flows
- Performance metrics maintained
- Security scans pass
- User feedback is positive

### 🔄 CONTINUOUS IMPROVEMENT

**After each deployment:**
- Document any issues encountered
- Update this protocol if gaps found
- Share lessons learned with team
- Improve automation where possible

---

**Remember: This protocol exists to prevent costly mistakes and maintain user trust. Following it religiously will save time and money in the long run.**
