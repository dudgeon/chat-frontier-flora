# Dynamic Test Naming Guide for chat-frontier-flora

## Overview

This guide documents the best practices for creating dynamic test names that make it obvious in reporting which environment tests were executed against, while maintaining a single unified test suite.

## Problem Statement

When running the same test suite across multiple environments (localhost, preview, production), traditional static test names make it difficult to:
- Identify which environment a test failure occurred in
- Distinguish between environment-specific issues and code issues
- Provide clear reporting for stakeholders and CI/CD pipelines

## Solution: Runtime Environment Detection with Dynamic Naming

Our solution uses **runtime environment detection** combined with **dynamic test naming** to achieve:
- ✅ Single unified test suite (no duplicate files)
- ✅ Clear environment identification in test reports
- ✅ Visual icons for easy scanning
- ✅ Environment-specific conditional tests
- ✅ Consistent naming patterns

## Implementation Approaches

### 1. Basic Environment Detection Function

```typescript
function getEnvironmentInfo() {
  const deployPreviewUrl = process.env.DEPLOY_PREVIEW_URL;
  const testProduction = process.env.TEST_PRODUCTION === 'true';

  if (testProduction) {
    return {
      name: 'Production',
      baseUrl: 'https://frontier-family-flora.netlify.app',
      icon: '🌐'
    };
  } else if (deployPreviewUrl) {
    return {
      name: 'Preview',
      baseUrl: deployPreviewUrl,
      icon: '🔍'
    };
  } else {
    return {
      name: 'Localhost',
      baseUrl: 'http://localhost:19006',
      icon: '🏠'
    };
  }
}
```

### 2. Dynamic Test Suite Names

```typescript
// Get environment info once at module load
const ENV = getEnvironmentInfo();

// Dynamic test suite with environment-aware naming
test.describe(`${ENV.icon} Stagehand Authentication Flow [${ENV.name}]`, () => {
  // Tests go here
});
```

### 3. Dynamic Individual Test Names

```typescript
test(`${ENV.icon} Complete signup and authentication flow on ${ENV.name}`, async () => {
  console.log(`🎭 Testing on ${ENV.name} environment (${ENV.baseUrl})`);
  // Test implementation
});
```

### 4. Conditional Tests Based on Environment

```typescript
// Production-specific test (only runs in production)
if (ENV.name === 'Production') {
  test(`🌐 Production site verification and health check`, async () => {
    // Production-specific verification
  });
}

// Preview-specific test (only runs in preview)
if (ENV.isPreview) {
  test(`🔍 Complete authentication flow on Preview deployment`, async () => {
    // Preview-specific testing
  });
}
```

## Environment Variables Used

| Variable | Purpose | Example |
|----------|---------|---------|
| `DEPLOY_PREVIEW_URL` | Preview deployment URL | `https://deploy-preview-123--site.netlify.app/` |
| `TEST_PRODUCTION` | Force production testing | `true` or `false` |

## Test Report Examples

### Before (Static Names)
```
✓ should complete signup flow with natural language actions
✗ should complete signup flow with natural language actions
✓ should work on production deployment
```

### After (Dynamic Names)
```
🏠 Stagehand Authentication Flow [Localhost]
  ✓ 🏠 Complete signup and authentication flow on Localhost

🔍 Stagehand Authentication Flow [Preview]
  ✗ 🔍 Complete signup and authentication flow on Preview

🌐 Stagehand Authentication Flow [Production]
  ✓ 🌐 Production site verification and health check
```

## Best Practices

### 1. Use Visual Icons for Quick Scanning
- 🏠 Localhost
- 🔍 Preview
- 🌐 Production
- 🎭 General testing
- ✅ Success indicators
- ❌ Failure indicators

### 2. Include Environment in All Log Messages
```typescript
console.log(`📝 Creating account for: ${testEmail} on ${ENV.name}`);
console.log(`✅ ${ENV.name} signup result:`, signupResult);
console.log(`🎉 Core authentication flow completed successfully on ${ENV.name}!`);
```

### 3. Environment-Specific Data Generation
```typescript
// Environment-specific test data
const testEmail = `test-${Date.now()}@stagehand-${ENV.name.toLowerCase()}.com`;
const testName = `Stagehand ${ENV.name} Tester`;
```

### 4. Conditional Test Execution
```typescript
// Skip tests that don't apply to current environment
if (ENV.name === 'Localhost' && requiresSSL) {
  test.skip(true, 'SSL required - localhost uses HTTP');
}
```

## Alternative Approaches Considered

### 1. Parameterized Tests with forEach
```typescript
// Less ideal - creates separate test instances
const environments = ['localhost', 'preview', 'production'];
environments.forEach((env) => {
  test(`Authentication flow on ${env}`, async () => {
    // Test implementation
  });
});
```
**Issues:** Harder to control which environments run, more complex configuration.

### 2. Playwright Projects
```typescript
// Complex setup in playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'localhost', use: { baseURL: 'http://localhost:19006' } },
    { name: 'preview', use: { baseURL: process.env.DEPLOY_PREVIEW_URL } },
    { name: 'production', use: { baseURL: 'https://production.com' } }
  ]
});
```
**Issues:** Requires separate project configurations, harder to share fixtures.

### 3. Custom Reporters
```typescript
// Modifying test names in reporters
class CustomReporter {
  onTestEnd(test, result) {
    const env = detectEnvironment();
    test.title = `[${env}] ${test.title}`;
  }
}
```
**Issues:** Names only change in reports, not in test runner output.

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run Tests on Preview
  env:
    DEPLOY_PREVIEW_URL: ${{ steps.deploy.outputs.preview_url }}
  run: npx playwright test

- name: Run Tests on Production
  env:
    TEST_PRODUCTION: true
  run: npx playwright test
```

### Test Results Analysis
The dynamic naming makes it immediately clear:
- Which environment failed tests occurred in
- Whether failures are environment-specific or code issues
- Progress across different deployment stages

## Troubleshooting

### Environment Not Detected Correctly
```typescript
// Add debug logging to environment detection
function getEnvironmentInfo() {
  console.log('Environment detection:', {
    DEPLOY_PREVIEW_URL: process.env.DEPLOY_PREVIEW_URL,
    TEST_PRODUCTION: process.env.TEST_PRODUCTION
  });
  // ... rest of function
}
```

### Tests Running in Wrong Environment
```typescript
// Add runtime validation
test.beforeEach(async ({ page }) => {
  console.log(`Running test against: ${ENV.baseUrl}`);
  // Add assertion if needed
  if (ENV.name === 'Production' && !ENV.baseUrl.includes('netlify.app')) {
    throw new Error('Production environment misconfigured');
  }
});
```

## Benefits Achieved

1. **Clear Reporting**: Test names immediately show environment context
2. **Single Source of Truth**: One test file handles all environments
3. **Reduced Maintenance**: No duplicate test files to keep in sync
4. **Environment-Specific Logic**: Conditional tests and data generation
5. **Better Debugging**: Environment context in all log messages
6. **Stakeholder Communication**: Visual reports with clear environment indicators

## Future Enhancements

1. **Environment Health Checks**: Pre-test validation of environment state
2. **Dynamic Test Data**: Environment-specific test data sets
3. **Performance Baselines**: Environment-specific performance expectations
4. **Rollback Detection**: Automatic detection of production rollbacks
5. **Multi-Browser Environment Matrix**: Cross-browser testing per environment

This approach provides maximum flexibility while maintaining clarity and reducing complexity in our test automation strategy.
