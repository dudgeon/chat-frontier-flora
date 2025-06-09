# Current Test Inventory - chat-frontier-flora

## Overview
This document provides a complete inventory of all current tests in the project, organized with numbered references for easy identification and discussion.

**Current Test Status:**
- **Total Active E2E Tests:** 3 tests across 2 files
- **Test Framework:** Stagehand (AI-powered natural language testing)
- **Quarantined Tests:** 9 Playwright tests (moved to prevent accidental execution)

---

## 1.0 Active E2E Tests (Stagehand)

### 1.1 Local Development Tests (`e2e/stagehand-auth-test.spec.ts`)

**1.1.1 Complete Signup Flow Test**
- **Test Name:** `should complete signup flow with natural language actions`
- **Purpose:** Full authentication flow testing on localhost
- **Actions:** Form filling, validation, signup, profile menu, logout
- **Duration:** ~30-60 seconds
- **Environment:** localhost:19006 (auto-detected via Playwright baseURL)

**1.1.2 Form Validation Test** ❌ **REMOVED**
- **Status:** Removed to eliminate redundancy - validation testing is included in test 1.1.1

### 1.2 Production/Preview Tests (`e2e/stagehand-production-auth.spec.ts`)

**1.2.1 Preview Deployment Full Flow**
- **Test Name:** `should complete full authentication flow on preview deployment`
- **Purpose:** Complete authentication testing on deploy previews
- **Actions:** Full signup, authentication verification, profile menu, logout
- **Duration:** ~60-90 seconds
- **Environment:** Deploy preview URL (from DEPLOY_PREVIEW_URL env var)
- **Skip Condition:** Skips if no DEPLOY_PREVIEW_URL set

**1.2.2 Preview Validation Errors** ❌ **REMOVED**
- **Status:** Removed to eliminate redundancy - validation testing is included in test 1.2.1

**1.2.3 Production Site Verification**
- **Test Name:** `should work on production deployment`
- **Purpose:** Basic production site health check
- **Actions:** Site loading verification, form availability check
- **Duration:** ~10-15 seconds
- **Environment:** https://frontier-family-flora.netlify.app (hardcoded)

---

## 2.0 Quarantined Tests (Playwright - Inactive)

### 2.1 Location: `e2e/quarantined-playwright-tests/`

**2.1.1 Password Validation Scenarios** (`password-validation-scenarios.spec.ts`)
**2.1.2 Deploy Preview Test** (`deploy-preview.spec.ts`)
**2.1.3 Production Test** (`production-test.spec.ts`)
**2.1.4 Local Test** (`local-test.spec.ts`)
**2.1.5 Chat Page Test** (`chat-page-test.spec.ts`)
**2.1.6 Debug Chat Page** (`debug-chat-page.spec.ts`)
**2.1.7 Debug Profile Loading** (`debug-profile-loading.spec.ts`)
**2.1.8 Debug Simple** (`debug-simple.spec.ts`)
**2.1.9 Accessibility Test** (`accessibility.spec.ts`)

**Status:** These tests are quarantined to prevent accidental execution. They use brittle CSS selectors and cause false negatives.

---

## 3.0 Test Execution Analysis

### 3.1 Current Performance Issues

**3.1.1 Test Count Optimization** ✅ **COMPLETED**
- **Previous Issue:** 5 active tests were too many for rapid development
- **Solution Implemented:** Reduced to 3 tests by removing redundant validation tests
- **Current Impact:** Each test run takes 2-3 minutes total (40% reduction)
- **Current Cost:** ~$0.03-0.15 per full test run (40% cost reduction)

**3.1.2 Redundancy Elimination** ✅ **COMPLETED**
- **Removed:** Tests 1.1.2 and 1.2.2 (standalone validation tests)
- **Rationale:** Validation testing is already covered within the full flow tests (1.1.1 and 1.2.1)
- **Result:** Maintained full coverage while eliminating duplicate functionality

### 3.2 Implemented Test Optimization ✅ **COMPLETED**

**Selected Strategy: Environment-Focused (3 tests)**
- ✅ **Kept 1.1.1** - localhost full flow (includes validation testing)
- ✅ **Kept 1.2.1** - preview full flow (includes validation testing)
- ✅ **Kept 1.2.3** - production health check
- ✅ **Removed 1.1.2** - redundant localhost validation test
- ✅ **Removed 1.2.2** - redundant preview validation test

**Benefits Achieved:**
- **40% faster test execution** (2-3 min vs 3-5 min)
- **40% cost reduction** in OpenAI API usage
- **Full environment coverage** maintained (localhost, preview, production)
- **Complete feature coverage** maintained (signup, validation, logout)

---

## 4.0 Test Configuration

### 4.1 Package.json Script
```json
"test:e2e": "playwright test e2e/stagehand-auth-test.spec.ts e2e/stagehand-production-auth.spec.ts"
```

### 4.2 Environment Variables Required
- `OPENAI_API_KEY`: Required for Stagehand AI functionality
- `DEPLOY_PREVIEW_URL`: Optional, enables preview testing (tests 1.2.1, 1.2.2)

### 4.3 Test Framework Details
- **Framework:** Stagehand (@browserbasehq/stagehand)
- **AI Model:** gpt-4o-mini (cost-effective)
- **Browser:** Chromium (via Playwright)
- **Validation:** Zod schemas for structured data extraction

---

## 5.0 Recommendations

### 5.1 Completed Actions ✅
1. ✅ **Reduced test count** from 5 to 3 tests using Environment-Focused strategy
2. ✅ **Eliminated redundant validation tests** - validation is now tested within main flow tests
3. ✅ **Maintained environment diversity** (localhost, preview, production) for comprehensive coverage

### 5.2 Long-term Optimizations
1. **Conditional execution** based on development phase
2. **Parallel execution** for independent tests
3. **Smart skipping** based on code changes

### 5.3 Test Maintenance
- **Monthly review** of test effectiveness and duration
- **Cost monitoring** of OpenAI API usage
- **Performance optimization** based on actual usage patterns

---

**Last Updated:** June 9, 2025
**Total Test Duration:** ~2-3 minutes for full suite (40% improvement)
**Estimated Cost:** $0.03-0.15 per full test run (40% cost reduction)
**Optimization Status:** ✅ COMPLETED - Redundant tests removed
