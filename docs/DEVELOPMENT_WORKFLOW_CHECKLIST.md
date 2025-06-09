# Development Workflow Checklist - chat-frontier-flora

## 🚨 CRITICAL DEPLOYMENT WORKFLOW - NEVER VIOLATE

**MANDATORY PROTOCOL: NO EXCEPTIONS**

1. **Local Testing First**: All changes MUST be tested locally with full verification
2. **PR for Preview Deploy**: Create PR to trigger preview deployment - NEVER merge without this step
3. **Preview Testing**: Test changes on the preview URL thoroughly
4. **CI Verification**: Ensure all CI checks pass on the preview
5. **Only Then Merge**: Merge to main only after preview testing confirms everything works
6. **Production Verification**: Test production deployment after merge

---

## 📋 Pre-Development Checklist

### Environment Setup
- [ ] Confirm in `chat-frontier-flora` root directory (`pwd`)
- [ ] Environment variables loaded (check with `echo $OPENAI_API_KEY`)
- [ ] No conflicting Expo processes running (`ps aux | grep expo`)
- [ ] Git status clean or changes properly staged

### Test Environment Verification
- [ ] Run `./scripts/verify-test-status.sh` before any testing
- [ ] Confirm only 2 active test files (Stagehand framework)
- [ ] Verify 9 Playwright tests remain quarantined
- [ ] Check package.json test script targets Stagehand files

---

## 🔧 Development Phase Protocols

### Local Development
- [ ] **ALWAYS** run from `apps/web` directory for Expo commands
- [ ] Start server: `cd apps/web && npm run web`
- [ ] Verify compilation: "web compiled with 1 warning" (NOT "1 error")
- [ ] Test localhost: `curl -s http://localhost:19006 | head -5`
- [ ] Run E2E tests: `npm run test:e2e` (from root)

### Code Changes
- [ ] Make ONE change at a time
- [ ] Wait for webpack recompilation after each change
- [ ] Verify change works before proceeding to next
- [ ] Document successful changes before moving forward

### Testing Protocol
- [ ] **Localhost testing**: Unset `DEPLOY_PREVIEW_URL` environment variable
- [ ] **Preview testing**: Set `DEPLOY_PREVIEW_URL` to preview URL
- [ ] **Production testing**: Unset `DEPLOY_PREVIEW_URL`, tests auto-target production

---

## 🚀 Deployment Workflow

### Pre-Merge Requirements
- [ ] All local tests passing
- [ ] Webpack compilation successful ("1 warning", not "1 error")
- [ ] Manual verification of core functionality
- [ ] No console errors in browser
- [ ] Authentication flow tested end-to-end

### PR Creation
- [ ] Create PR to trigger preview deployment
- [ ] Wait for preview build to complete
- [ ] Test on preview URL thoroughly
- [ ] Verify all CI checks pass
- [ ] Get approval if required

### Post-Merge Protocol
- [ ] Wait 2-10 minutes for production deployment
- [ ] Check deployment status: `netlify api listSiteDeploys`
- [ ] Verify deployment state is "ready" not "error"
- [ ] Test production URL: `curl -s https://frontier-family-flora.netlify.app/`
- [ ] Run production E2E tests to confirm functionality

---

## 🛡️ Error Prevention Protocols

### Common Failure Patterns
- [ ] **Directory errors**: Always check `pwd` before Expo commands
- [ ] **Test framework confusion**: Never run Playwright tests (quarantined)
- [ ] **Environment mixing**: Verify test target environment before running
- [ ] **Compilation errors**: Fix "1 error" before claiming success
- [ ] **Premature success claims**: Always verify with evidence

### Evidence-Based Status Reporting
- [ ] ✅ **VERIFIED WORKING**: Compilation + HTTP response + bundle loading + user confirmation
- [ ] ⚠️ **PARTIALLY WORKING**: Specify what works and what doesn't
- [ ] ❌ **BROKEN**: Specific error with evidence
- [ ] 🔄 **IN PROGRESS**: Making changes, not ready for testing
- [ ] ❓ **UNKNOWN**: Need to investigate, don't assume

### Mandatory Self-Check Questions
Before claiming any status, ask:
1. "What evidence do I have?"
2. "Have I completed the 5-step verification checklist?"
3. "Does my claim match the evidence?"
4. "Am I in the correct directory/environment?"
5. "Are there any compilation errors I'm ignoring?"

---

## 🔄 Recovery Procedures

### When Things Go Wrong
- [ ] **Context reset**: Run `pwd`, `ls -la`, `ps aux | grep expo`, `git status`
- [ ] **Compilation errors**: Restart server, check for Gluestack UI remnants
- [ ] **Test failures**: Verify environment, check test framework, run verification script
- [ ] **Deployment issues**: Check Netlify status, verify build logs
- [ ] **Authentication issues**: Check Supabase connection, environment variables

### Emergency Rollback
- [ ] **Component level**: Revert specific file changes
- [ ] **Full project**: `git reset --hard HEAD~1` (if safe)
- [ ] **File system**: Restore from backup if available

---

## 📊 Success Metrics

### Test Performance (Current Baseline)
- **Total test duration**: 2-3 minutes (40% improvement achieved)
- **Test count**: 3 active tests (optimized from 5)
- **Cost per run**: $0.03-0.15 (40% cost reduction achieved)
- **Success rate**: Target >95% for production tests

### Quality Gates
- [ ] All tests passing consistently
- [ ] No false negatives from test framework issues
- [ ] Production deployment verification working
- [ ] Authentication flow reliable end-to-end

---

## 🎯 Next Steps Preparation

### Before Major Changes
- [ ] Run full test suite to establish baseline
- [ ] Document current working state
- [ ] Create backup of critical files
- [ ] Plan rollback strategy

### UI Library Adoption (Future)
- [ ] Review `docs/GLUESTACK_UI_LESSONS_LEARNED.md`
- [ ] Follow `docs/REGRESSION_PREVENTION_PROTOCOL.md`
- [ ] Implement atomic conversion strategy
- [ ] Maintain API compatibility requirements

---

**Last Updated**: June 9, 2025
**Status**: Active - All protocols tested and verified
**Next Review**: After next major feature implementation
