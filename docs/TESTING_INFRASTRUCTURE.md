# Testing Infrastructure Documentation

## Overview

This document describes the comprehensive testing infrastructure for Chat Frontier Flora, covering unit tests, integration tests, end-to-end tests, accessibility testing, and performance monitoring.

## Testing Stack

### Unit & Integration Testing
- **Framework**: Jest + React Testing Library
- **Coverage**: 39 tests across authentication and validation
- **Location**: `apps/web/src/**/*.test.tsx`
- **Command**: `npm test`

### End-to-End Testing
- **Framework**: Playwright
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Coverage**: 90 tests across 5 browsers
- **Location**: `e2e/`
- **Commands**:
  - `npm run test:e2e` - Run all E2E tests
  - `npm run test:e2e:ui` - Run with UI mode
  - `npm run test:visual` - Visual regression testing

### Accessibility Testing
- **Framework**: axe-core with Playwright
- **Standards**: WCAG 2.1 AA compliance
- **Coverage**: All pages and components
- **Command**: `npm run test:a11y`

### Performance Testing
- **Framework**: Lighthouse
- **Metrics**: Performance, Accessibility, Best Practices, SEO
- **Command**: `npm run test:perf`

## Test Structure

### Unit Tests (`apps/web/src/`)

#### AuthContext Tests (`contexts/AuthContext.test.tsx`)
- **15 test cases** covering:
  - Authentication state management
  - User registration and login flows
  - Role-based functionality (primary/child users)
  - Profile updates and error handling
  - Session persistence and cleanup
  - Child account creation

#### Validation Tests (`utils/validation.test.ts`)
- **24 test cases** covering:
  - Email validation
  - Password strength validation
  - Form validation logic
  - Edge cases and error handling

### E2E Tests (`e2e/`)

#### Authentication Flow (`auth-flow.spec.ts`)
- **18 test scenarios** covering:
  - Initial app state and accessibility
  - User registration flow with validation
  - Login/logout functionality
  - Role-based access control
  - Mobile responsiveness
  - Visual regression testing

#### Accessibility Tests (`accessibility.spec.ts`)
- **WCAG 2.1 AA compliance testing**
- **Cross-browser accessibility validation**
- **Keyboard navigation testing**
- **Screen reader compatibility**

#### Deploy Preview Tests (`deploy-preview.spec.ts`)
- **Production environment testing**
- **Performance metrics collection**
- **Cross-browser compatibility**
- **Mobile device testing**

### Helper Functions (`e2e/helpers/`)

#### Authentication Helpers (`auth-helpers.ts`)
- Reusable authentication actions
- Test user credentials
- Common form interactions

## Configuration Files

### Jest Configuration (`apps/web/jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@chat-frontier-flora/shared': '<rootDir>/../../packages/shared/src',
    '^react-native$': 'react-native-web',
    '^@testing-library/react-native$': '@testing-library/react'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native-web|@supabase)/)'
  ]
};
```

### Playwright Configuration (`playwright.config.ts`)
```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.DEPLOY_PREVIEW_URL || 'http://localhost:19006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  webServer: {
    command: 'npm run web',
    url: 'http://localhost:19006',
    reuseExistingServer: !process.env.CI
  }
});
```

## CI/CD Integration

### GitHub Actions (`.github/workflows/test-deploy-preview.yml`)
- **Automated testing on PR creation**
- **Deploy preview testing**
- **Performance audits**
- **Accessibility compliance checks**
- **Cross-browser compatibility validation**
- **Detailed reporting in PR comments**

### Netlify Integration
- **Automatic deploy previews**
- **Environment variable injection**
- **Production-like testing environment**

## Test Commands

### Development
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# ⚠️ CRITICAL: Run E2E tests for LOCAL DEVELOPMENT ONLY
npm run test:e2e:local  # This excludes production and preview tests

# ❌ NEVER use these during local development:
# npm run test:e2e       # This runs ALL tests including production!
# npm run test:all       # This also runs production tests!

# Run E2E tests with UI (for debugging)
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual

# Run performance tests
npm run test:perf
```

### CI/CD
```bash
# Run all tests in CI mode
npm run test:ci

# Run E2E tests against deploy preview
DEPLOY_PREVIEW_URL=https://deploy-preview-123--site.netlify.app npm run test:e2e

# Generate test reports
npm run test:report
```

## Test Data Management

### Mock Data
- **Supabase client mocking** for unit tests
- **Test user credentials** for E2E tests
- **Consistent test data** across environments

### Environment Variables
```bash
# Required for testing
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional for deploy preview testing
DEPLOY_PREVIEW_URL=https://deploy-preview-123--site.netlify.app
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color contrast**: Minimum 4.5:1 ratio
- **Keyboard navigation**: Full keyboard accessibility
- **Screen readers**: Proper ARIA labels and roles
- **Viewport**: No zoom restrictions
- **Semantic HTML**: Proper heading structure and landmarks

### Accessibility Testing Tools
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Performance and accessibility audits
- **Manual testing**: Keyboard navigation and screen reader testing

## Performance Standards

### Lighthouse Budgets (`lighthouserc.js`)
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:19006'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }]
      }
    }
  }
};
```

## Troubleshooting

### Common Issues

#### Jest Module Resolution
```bash
# If tests fail with module resolution errors
npm install --save-dev @babel/preset-env @babel/preset-react @babel/preset-typescript
```

#### Playwright Browser Installation
```bash
# Install browser binaries
npx playwright install
```

#### Environment Variables
```bash
# Check if .env file exists
ls -la | grep env

# Copy environment variables
cp ../../.env .env
```

### Debug Commands
```bash
# Debug Jest tests
npm test -- --verbose

# Debug Playwright tests
npx playwright test --debug

# Generate test coverage
npm test -- --coverage

# View test reports
npx playwright show-report
```

## Best Practices

### Test Writing
1. **Descriptive test names** that explain the expected behavior
2. **Arrange-Act-Assert** pattern for clear test structure
3. **Mock external dependencies** to ensure test isolation
4. **Test user behavior** rather than implementation details
5. **Use data-testid** attributes for reliable element selection

### Maintenance
1. **Regular test review** to ensure relevance and accuracy
2. **Update test data** when application logic changes
3. **Monitor test performance** and optimize slow tests
4. **Keep dependencies updated** for security and compatibility
5. **Document test failures** and their resolutions

### Continuous Improvement
1. **Analyze test coverage** to identify gaps
2. **Add tests for new features** before implementation
3. **Refactor tests** when code structure changes
4. **Monitor accessibility compliance** continuously
5. **Performance regression testing** on every deployment

## Metrics and Reporting

### Test Coverage
- **Current coverage**: 39/39 tests passing (100%)
- **Code coverage**: Available via Jest coverage reports
- **E2E coverage**: 90 tests across 5 browsers

### Performance Metrics
- **Lighthouse scores**: Performance, Accessibility, Best Practices, SEO
- **Core Web Vitals**: LCP, FID, CLS measurements
- **Bundle size**: Monitored via webpack-bundle-analyzer

### Accessibility Metrics
- **WCAG 2.1 AA compliance**: Automated testing with axe-core
- **Color contrast**: Minimum 4.5:1 ratio enforcement
- **Keyboard navigation**: Full accessibility validation

This testing infrastructure ensures high-quality, accessible, and performant code delivery while maintaining comprehensive coverage across all application features.

## Conservative Testing Protocol (Required)

**⚠️ CRITICAL WARNING: The `npm run test:e2e` command runs ALL E2E tests including production tests against live URLs. During local development, you MUST use `npm run test:e2e:local` instead to test only against localhost:19006.**

## MANDATORY PRE-FLIGHT CHECKLIST (Before ANY Testing)

**AI MUST complete ALL items before proceeding with any testing:**

### 1. Compilation Status Check
```bash
# Look for the LAST webpack compilation message
# ✅ GOOD: "web compiled with 1 warning"
# ❌ BAD: "web compiled with 1 error"
# If you see ERROR, STOP and fix before proceeding
```

### 2. Server Health Verification
```bash
# Check if server is running
ps aux | grep "expo start" | grep -v grep

# Verify correct port
curl -s http://localhost:19006 | head -5

# Check for HTML response (not JSON error)
curl -s http://localhost:19006 | grep -E "(<!DOCTYPE|<html)"

# Verify JavaScript bundle loads
curl -s http://localhost:19006/static/js/bundle.js | head -1 | grep "webpackBootstrap"
```

### 3. Environment Verification
```bash
# Confirm no deploy preview URL is set
echo "DEPLOY_PREVIEW_URL: ${DEPLOY_PREVIEW_URL:-'not set'}"

# Verify we're in the right directory
pwd

# Check git branch
git branch --show-current
```

**If ANY check fails, STOP and fix the issue before proceeding.**

## CRITICAL: Environment Variable Contamination

**⚠️ CRITICAL WARNING: Environment variables from previous testing sessions can cause tests to run against the wrong environment!**

### The Problem:
- `DEPLOY_PREVIEW_URL` environment variable persists across terminal sessions
- If set, Playwright tests will run against the deploy preview instead of localhost
- This leads to testing old code that doesn't have your local changes
- You'll see Chromium windows opening with deploy preview URLs instead of localhost

### MANDATORY Before ANY Test Run:
```bash
# 1. Check if DEPLOY_PREVIEW_URL is set
echo "DEPLOY_PREVIEW_URL: ${DEPLOY_PREVIEW_URL:-'not set'}"

# 2. If it shows a URL, UNSET IT for local testing
unset DEPLOY_PREVIEW_URL

# 3. Verify it's unset
echo "DEPLOY_PREVIEW_URL: ${DEPLOY_PREVIEW_URL:-'not set'}"  # Should show 'not set'

# 4. ONLY THEN run your tests
npx playwright test [your-test-file]
```

### How to Verify Test Target:
- **Look at the browser URL** when tests run with `--headed`
- **localhost:19006** = Testing your local changes ✅
- **deploy-preview-XXX.netlify.app** = Testing old deploy preview ❌
- **frontier-family-flora.netlify.app** = Testing production ❌

### Setting Test Targets Explicitly:
```bash
# For local testing (unset the variable)
unset DEPLOY_PREVIEW_URL && npx playwright test

# For preview testing (set the variable)
export DEPLOY_PREVIEW_URL=https://deploy-preview-XXX--frontier-family-flora.netlify.app && npx playwright test

# For production testing
export DEPLOY_PREVIEW_URL=https://frontier-family-flora.netlify.app && npx playwright test
```

### URL Management Best Practices:

**❌ NEVER hardcode URLs in test files:**
```typescript
// BAD - These URLs change!
const LOCALHOST_URL = 'http://localhost:19006';  // Port changes
const PREVIEW_URL = 'https://deploy-preview-2--site.netlify.app';  // Changes per PR
```

**✅ CORRECT URL management:**
```typescript
// GOOD - Use Playwright's baseURL system
await page.goto('/');  // Uses baseURL from config
```

**URL Sources by Environment:**
- **Localhost**: Port determined by available ports (19006, 19007, etc.) - Playwright detects automatically
- **Deploy Preview**: Unique URL per PR - Set by GitHub Actions via `DEPLOY_PREVIEW_URL`
- **Production**: Constant URL - `https://frontier-family-flora.netlify.app`

**If you see tests running against the wrong URL, STOP IMMEDIATELY and fix the environment variable.**

### CRITICAL: Check for Hardcoded URLs in Test Files
Some test files may have hardcoded URLs that override environment variables:
```bash
# Search for hardcoded deploy preview URLs in test files
grep -r "deploy-preview" e2e/
grep -r "frontier-family-flora.netlify.app" e2e/
```

**If you find hardcoded URLs, replace them with environment-aware URLs:**
```typescript
// ❌ BAD - Hardcoded URL
const PREVIEW_URL = 'https://deploy-preview-2--frontier-family-flora.netlify.app';

// ✅ GOOD - Environment-aware URL
const TEST_URL = process.env.DEPLOY_PREVIEW_URL || 'http://localhost:19006';
```

## CRITICAL: Understanding Webpack Compilation Status

**This is the #1 source of wasted time and false test results:**

### Compilation Status Guide:
- **"web compiled with 1 warning"** = ✅ SUCCESS - Page will work
- **"web compiled with 1 error"** = ❌ BROKEN - Page will NOT work
- **"ERROR in ..."** = ❌ Blocking compilation failure - MUST fix
- **"WARNING in ..."** = ⚠️ Non-blocking - Usually safe to ignore

### Common Compilation Errors and Solutions:
1. **"Module not found: Can't resolve"** - Missing import or file
2. **"Module parse failed"** - Webpack can't understand the file (often TypeScript in wrong location)
3. **"The keyword 'interface' is reserved"** - TypeScript file in non-TypeScript configured directory

**NEVER proceed with testing if you see "compiled with X error(s)"**

**To prevent regressions and ensure maximum reliability, follow this protocol for ALL changes:**

## Phase 1: Local Development & Testing

### 1.1 Code Changes
- Make changes on a feature branch
- Commit frequently with clear messages
- Keep changes focused and minimal

### 1.2 Pre-Test Verification (MANDATORY)
- Complete the **MANDATORY PRE-FLIGHT CHECKLIST** above
- Fix any compilation errors before proceeding
- Ensure server is running on localhost:19006

### 1.3 Automated Testing
```bash
# Unit tests first
npm test

# E2E tests - LOCAL ONLY
npm run test:e2e:local  # NOT npm run test:e2e!
```

### 1.4 AI Verification (MANDATORY)
**AI must verify ALL of the following before asking developer to inspect:**
1. ✅ Webpack shows "compiled with X warning(s)" NOT "error(s)"
2. ✅ Server responds with HTML: `curl -s http://localhost:19006 | grep "<html"`
3. ✅ JavaScript bundle loads: `curl -s http://localhost:19006/static/js/bundle.js | head -1`
4. ✅ No console errors in terminal output
5. ✅ Can access expected UI elements via curl

**If ANY verification fails, AI must fix it before proceeding.**

### 1.5 Developer Visual Inspection
**Only after AI verification passes:**
- Verify UI changes appear correctly
- Test all interactive elements
- Check keyboard navigation
- Verify responsive design
- Test complete user flows

## Phase 2: Pull Request & Preview Deploy

### 2.1 Create Pull Request
- Push feature branch
- Create PR with clear description
- Wait for Netlify preview deploy

### 2.2 Preview Testing
```bash
# Set preview URL
export DEPLOY_PREVIEW_URL=https://deploy-preview-XXX--frontier-family-flora.netlify.app

# Run preview tests
npm run test:preview
```

### 2.3 Manual Preview Verification
- Test all changed features in preview
- Verify no regressions
- Check performance metrics

## Phase 3: Production Deployment

### 3.1 Merge to Main
- Only after ALL preview tests pass
- Squash commits if needed
- Use clear merge commit message

### 3.2 Production Verification
```bash
# Run production tests
npm run test:production
```

### 3.3 Post-Deploy Monitoring
- Check error logs
- Monitor performance metrics
- Be ready to rollback if issues arise

**Note:** This conservative, over-testing approach is required due to past regression issues. Never skip regression testing, even for "small" changes.

## LESSONS LEARNED: Common Pitfalls That Waste Hours

Based on actual failures, NEVER do these:

### 1. ❌ Ignoring Compilation Errors
- **Wrong**: "Let me check if it works" when seeing "compiled with 1 error"
- **Right**: Stop immediately and fix the error first

### 2. ❌ Running Wrong Test Commands
- **Wrong**: `npm run test:e2e` during local development
- **Right**: `npm run test:e2e:local` for local testing only

### 3. ❌ Claiming Success Without Verification
- **Wrong**: "The page should be working now"
- **Right**: Run the verification checklist and show evidence

### 4. ❌ Testing in Wrong Environment
- **Wrong**: Running tests without checking DEPLOY_PREVIEW_URL
- **Right**: Always verify test target matches development phase

### 5. ❌ Asking Developer to Check Broken Code
- **Wrong**: "Please check localhost" without AI verification
- **Right**: Complete ALL verification steps first

### 6. ❌ Making Multiple Changes at Once
- **Wrong**: Fix 5 things then test
- **Right**: Fix one thing, verify it works, then proceed

### 7. ❌ Contradicting Own Verification
- **Wrong**: "✅ Working" then immediately "❓ Unknown"
- **Right**: Stick to evidence-based status reporting

## CRITICAL: Test Environment Verification

**Before running ANY tests, AI must verify the correct test environment:**

### Environment Verification Protocol:
1. **Identify Development Phase**:
   - Local development = Test against `localhost:19006`
   - Preview testing = Test against deploy preview URL
   - Production testing = Test against production URL

2. **Check Test Configuration**:
   - Verify `playwright.config.ts` baseURL setting
   - Check package.json test scripts for target URLs
   - Confirm environment variables match intended target

3. **Verify Server Status**:
   - For localhost testing: Confirm local server is running on correct port
   - For preview testing: Confirm preview URL is accessible
   - For production testing: Confirm production URL is live

4. **Document Test Target**:
   - Always state which environment tests are targeting
   - Never assume test environment - always verify first

### Test Environment Rules:
- **Local Development**: Tests MUST run against `localhost:19006`
  - **EXCLUDE production tests**: Use `npm run test:e2e -- --grep-invert "Production"` or test specific files
  - **NEVER run** `npm run test:e2e` without filtering during local development
- **Preview Testing**: Tests run against Netlify deploy preview URL
  - Use `npm run test:preview` for preview-specific tests
- **Production Testing**: Tests run against production URL
  - Use `playwright test production-test.spec.ts` for production-only tests
- **NEVER mix environments** - this leads to false results and wasted time

### CRITICAL: Local Development E2E Testing Commands
```bash
# ❌ WRONG - This runs ALL tests including production tests
npm run test:e2e

# ✅ CORRECT - Run only local development tests
playwright test auth-flow.spec.ts accessibility.spec.ts
# OR
npm run test:e2e -- --grep-invert "Production"
```

## CRITICAL: AI Verification Requirements

**The AI must NEVER ask the developer to inspect something without first verifying it works. This includes:**

### Common Failure Patterns to Check:
1. **Server responds with JSON instead of HTML** - Always check response content, not just HTTP status
2. **Compilation errors** - Check terminal output for "Module not found", "ERROR in", etc.
3. **Wrong port assumptions** - Verify the actual port the server is running on
4. **App not loading despite server running** - Test actual UI functionality, not just server status
5. **Testing wrong environment** - Verify tests target correct environment (localhost vs preview vs production)

### Required AI Verification Steps:
1. **Verify test environment matches development phase**
2. Check terminal output for any ERROR messages
3. Verify server responds with actual HTML content (not JSON)
4. Confirm no compilation failures
5. Test that the UI actually loads and renders
6. Only AFTER all verification passes, ask developer to inspect

**Violation of this protocol wastes developer time and is unacceptable.**

## CRITICAL: Production Deployment Monitoring

**⚠️ CRITICAL: Production deployments take time and AI cannot assume they're ready immediately after merge.**

### Production Deployment Process:
1. **PR Merge to Main** - Triggers production build
2. **Netlify Build Process** - Can take 2-10 minutes depending on changes
3. **Deployment Propagation** - Additional time for CDN updates

### MANDATORY: Check Deployment Status Before Testing

**❌ NEVER assume production is ready immediately after merge**

**✅ ALWAYS verify deployment status before running production tests:**

```bash
# Check if production shows updated content
curl -s https://frontier-family-flora.netlify.app/ | grep -o '<title>[^<]*</title>'

# If still shows old content, deployment is not complete
```

### Required Protocol:
1. **After merging to main** - Wait for user confirmation that production deployment is complete
2. **Ask user**: "Is the production deployment complete? I can see [old/new] content at the production URL"
3. **Only proceed with production testing** after user confirms deployment is ready
4. **Alternative**: Use Netlify MCP to check deployment status programmatically

### Netlify MCP Integration:
If available, use Netlify MCP tools to:
- Check deployment status
- Get deployment logs
- Verify build completion
- Monitor deployment progress

**Never run production tests against stale deployments - this wastes time and gives false results.**

## CRITICAL: Understanding Webpack Compilation Status

**This is the #1 source of wasted time and false test results:**

### Compilation Status Guide:
- **"web compiled with 1 warning"** = ✅ SUCCESS - Page will work
- **"web compiled with 1 error"** = ❌ BROKEN - Page will NOT work
- **"ERROR in ..."** = ❌ Blocking compilation failure - MUST fix
- **"WARNING in ..."** = ⚠️ Non-blocking - Usually safe to ignore

### Common Compilation Errors and Solutions:
1. **"Module not found: Can't resolve"** - Missing import or file
2. **"Module parse failed"** - Webpack can't understand the file (often TypeScript in wrong location)
3. **"The keyword 'interface' is reserved"** - TypeScript file in non-TypeScript configured directory

**NEVER proceed with testing if you see "compiled with X error(s)"**

**To prevent regressions and ensure maximum reliability, follow this protocol for ALL changes:**

## Phase 1: Local Development & Testing

### 1.1 Code Changes
- Make changes on a feature branch
- Commit frequently with clear messages
- Keep changes focused and minimal

### 1.2 Pre-Test Verification (MANDATORY)
- Complete the **MANDATORY PRE-FLIGHT CHECKLIST** above
- Fix any compilation errors before proceeding
- Ensure server is running on localhost:19006

### 1.3 Automated Testing
```bash
# Unit tests first
npm test

# E2E tests - LOCAL ONLY
npm run test:e2e:local  # NOT npm run test:e2e!
```

### 1.4 AI Verification (MANDATORY)
**AI must verify ALL of the following before asking developer to inspect:**
1. ✅ Webpack shows "compiled with X warning(s)" NOT "error(s)"
2. ✅ Server responds with HTML: `curl -s http://localhost:19006 | grep "<html"`
3. ✅ JavaScript bundle loads: `curl -s http://localhost:19006/static/js/bundle.js | head -1`
4. ✅ No console errors in terminal output
5. ✅ Can access expected UI elements via curl

**If ANY verification fails, AI must fix it before proceeding.**

### 1.5 Developer Visual Inspection
**Only after AI verification passes:**
- Verify UI changes appear correctly
- Test all interactive elements
- Check keyboard navigation
- Verify responsive design
- Test complete user flows

## Phase 2: Pull Request & Preview Deploy

### 2.1 Create Pull Request
- Push feature branch
- Create PR with clear description
- Wait for Netlify preview deploy

### 2.2 Preview Testing
```bash
# Set preview URL
export DEPLOY_PREVIEW_URL=https://deploy-preview-XXX--frontier-family-flora.netlify.app

# Run preview tests
npm run test:preview
```

### 2.3 Manual Preview Verification
- Test all changed features in preview
- Verify no regressions
- Check performance metrics

## Phase 3: Production Deployment

### 3.1 Merge to Main
- Only after ALL preview tests pass
- Squash commits if needed
- Use clear merge commit message

### 3.2 Production Verification
```bash
# Run production tests
npm run test:production
```

### 3.3 Post-Deploy Monitoring
- Check error logs
- Monitor performance metrics
- Be ready to rollback if issues arise

**Note:** This conservative, over-testing approach is required due to past regression issues. Never skip regression testing, even for "small" changes.

## LESSONS LEARNED: Common Pitfalls That Waste Hours

Based on actual failures, NEVER do these:

### 1. ❌ Ignoring Compilation Errors
- **Wrong**: "Let me check if it works" when seeing "compiled with 1 error"
- **Right**: Stop immediately and fix the error first

### 2. ❌ Running Wrong Test Commands
- **Wrong**: `npm run test:e2e` during local development
- **Right**: `npm run test:e2e:local` for local testing only

### 3. ❌ Claiming Success Without Verification
- **Wrong**: "The page should be working now"
- **Right**: Run the verification checklist and show evidence

### 4. ❌ Testing in Wrong Environment
- **Wrong**: Running tests without checking DEPLOY_PREVIEW_URL
- **Right**: Always verify test target matches development phase

### 5. ❌ Asking Developer to Check Broken Code
- **Wrong**: "Please check localhost" without AI verification
- **Right**: Complete ALL verification steps first

### 6. ❌ Making Multiple Changes at Once
- **Wrong**: Fix 5 things then test
- **Right**: Fix one thing, verify it works, then proceed

### 7. ❌ Contradicting Own Verification
- **Wrong**: "✅ Working" then immediately "❓ Unknown"
- **Right**: Stick to evidence-based status reporting

## CRITICAL: Test Environment Verification

**Before running ANY tests, AI must verify the correct test environment:**

### Environment Verification Protocol:
1. **Identify Development Phase**:
   - Local development = Test against `localhost:19006`
   - Preview testing = Test against deploy preview URL
   - Production testing = Test against production URL

2. **Check Test Configuration**:
   - Verify `playwright.config.ts` baseURL setting
   - Check package.json test scripts for target URLs
   - Confirm environment variables match intended target

3. **Verify Server Status**:
   - For localhost testing: Confirm local server is running on correct port
   - For preview testing: Confirm preview URL is accessible
   - For production testing: Confirm production URL is live

4. **Document Test Target**:
   - Always state which environment tests are targeting
   - Never assume test environment - always verify first

### Test Environment Rules:
- **Local Development**: Tests MUST run against `localhost:19006`
  - **EXCLUDE production tests**: Use `npm run test:e2e -- --grep-invert "Production"` or test specific files
  - **NEVER run** `npm run test:e2e` without filtering during local development
- **Preview Testing**: Tests run against Netlify deploy preview URL
  - Use `npm run test:preview` for preview-specific tests
- **Production Testing**: Tests run against production URL
  - Use `playwright test production-test.spec.ts` for production-only tests
- **NEVER mix environments** - this leads to false results and wasted time

### CRITICAL: Local Development E2E Testing Commands
```bash
# ❌ WRONG - This runs ALL tests including production tests
npm run test:e2e

# ✅ CORRECT - Run only local development tests
playwright test auth-flow.spec.ts accessibility.spec.ts
# OR
npm run test:e2e -- --grep-invert "Production"
```

## CRITICAL: AI Verification Requirements

**The AI must NEVER ask the developer to inspect something without first verifying it works. This includes:**

### Common Failure Patterns to Check:
1. **Server responds with JSON instead of HTML** - Always check response content, not just HTTP status
2. **Compilation errors** - Check terminal output for "Module not found", "ERROR in", etc.
3. **Wrong port assumptions** - Verify the actual port the server is running on
4. **App not loading despite server running** - Test actual UI functionality, not just server status
5. **Testing wrong environment** - Verify tests target correct environment (localhost vs preview vs production)

### Required AI Verification Steps:
1. **Verify test environment matches development phase**
2. Check terminal output for any ERROR messages
3. Verify server responds with actual HTML content (not JSON)
4. Confirm no compilation failures
5. Test that the UI actually loads and renders
6. Only AFTER all verification passes, ask developer to inspect

**Violation of this protocol wastes developer time and is unacceptable.**
