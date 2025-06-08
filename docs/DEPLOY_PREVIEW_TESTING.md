# 🚀 Deploy Preview Testing with Playwright

This document explains how to test Netlify deploy previews automatically using Playwright for comprehensive end-to-end testing.

## Overview

Deploy preview testing ensures that every pull request is thoroughly tested in a production-like environment before merging. This includes:

- **Functional Testing**: Authentication flows, form validation, navigation
- **Cross-Browser Testing**: Chrome, Firefox, Safari compatibility
- **Mobile Testing**: Responsive design and touch interactions
- **Accessibility Testing**: WCAG 2.1 AA compliance
- **Performance Testing**: Lighthouse audits with budgets
- **Visual Regression**: Screenshot comparisons

## Automatic Testing (CI/CD)

### GitHub Actions Workflow

Every pull request automatically triggers the deploy preview testing workflow:

1. **Wait for Netlify Deploy**: Waits for Netlify to build and deploy the preview
2. **Cross-Browser Testing**: Runs tests on Chrome, Firefox, and Safari
3. **Accessibility Audit**: Validates WCAG compliance
4. **Performance Audit**: Runs Lighthouse with performance budgets
5. **Results Comment**: Posts detailed results as a PR comment

### Required Secrets

Add these secrets to your GitHub repository:

```bash
# GitHub Settings > Secrets and variables > Actions
NETLIFY_TOKEN=your_netlify_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_ci_token  # Optional
```

### Workflow Configuration

The workflow is defined in `.github/workflows/test-deploy-preview.yml` and includes:

- **Multi-browser testing** across Chrome, Firefox, Safari
- **Mobile device testing** with responsive viewports
- **Accessibility auditing** with axe-core
- **Performance monitoring** with Lighthouse CI
- **Automatic PR comments** with test results

## Manual Testing

### Local Testing Script

Test any deploy preview URL locally:

```bash
# Test a specific deploy preview
./scripts/test-deploy-preview.sh https://deploy-preview-123--your-site.netlify.app

# Test with custom production URL for comparison
./scripts/test-deploy-preview.sh \
  https://deploy-preview-123--your-site.netlify.app \
  https://your-production-site.netlify.app
```

### Manual Commands

```bash
# Set the deploy preview URL
export DEPLOY_PREVIEW_URL=https://deploy-preview-123--your-site.netlify.app

# Run all deploy preview tests
npm run test:preview

# Run with browser UI (for debugging)
npm run test:preview:headed

# Run only accessibility tests
npm run test:a11y

# Run with specific browser
npx playwright test deploy-preview.spec.ts --project=chromium
```

## Test Coverage

### Authentication Flow Testing
- ✅ User registration with validation
- ✅ Login/logout functionality
- ✅ Role-based access control
- ✅ Protected route navigation
- ✅ Form validation and error handling

### Production Environment Validation
- ✅ Environment variables loading
- ✅ Build optimization verification
- ✅ Console error detection
- ✅ Performance metrics collection

### Cross-Browser Compatibility
- ✅ Chrome/Chromium functionality
- ✅ Firefox compatibility
- ✅ Safari/WebKit support
- ✅ Mobile Chrome testing
- ✅ Mobile Safari testing

### Accessibility Compliance
- ✅ WCAG 2.1 AA standards
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast validation
- ✅ Form labeling verification

### Performance Monitoring
- ✅ First Contentful Paint < 2s
- ✅ Largest Contentful Paint < 4s
- ✅ Cumulative Layout Shift < 0.1
- ✅ Total Blocking Time < 300ms
- ✅ Bundle size < 1MB

## Configuration Files

### Playwright Configuration (`playwright.config.ts`)
- Automatically uses `DEPLOY_PREVIEW_URL` when set
- Skips local server startup for deploy preview testing
- Configures multiple browser projects
- Sets up proper timeouts and retry logic

### Lighthouse Configuration (`lighthouserc.js`)
- Performance budgets and thresholds
- Accessibility requirements
- Best practices validation
- Bundle size monitoring

## Test Structure

### Deploy Preview Tests (`e2e/deploy-preview.spec.ts`)
```typescript
// Production build validation
test('should load deploy preview successfully')
test('should have correct environment variables loaded')
test('should be accessible in production build')

// Authentication flow testing
test('should handle authentication flow in production environment')
test('should show proper error handling for invalid credentials')
test('should validate forms correctly in production')

// Performance testing
test('should load within acceptable time limits')
test('should have optimized bundle size')

// Cross-browser testing
test('should work consistently across browsers')

// Mobile testing
test('should work on mobile devices in production')

// Production vs Preview comparison
test('should have consistent behavior between preview and production')
test('should have same authentication behavior')
```

### Helper Functions (`e2e/helpers/auth-helpers.ts`)
- Reusable authentication actions
- Form filling utilities
- Navigation helpers
- Assertion utilities

## Debugging

### View Test Results

```bash
# Open Playwright report
npx playwright show-report

# View specific test results
open playwright-report/index.html

# Check Lighthouse report
open reports/lighthouse-report.html
```

### Debug Failed Tests

```bash
# Run in headed mode to see browser
npm run test:preview:headed

# Debug specific test
npx playwright test deploy-preview.spec.ts --debug

# Run with trace viewer
npx playwright test deploy-preview.spec.ts --trace on
```

### Common Issues

1. **Deploy Preview Not Ready**
   - Wait for Netlify build to complete
   - Check deploy preview URL is accessible
   - Verify environment variables are set

2. **Authentication Tests Failing**
   - Verify Supabase environment variables
   - Check database connectivity
   - Validate RLS policies

3. **Performance Tests Failing**
   - Review bundle size and optimization
   - Check for console errors
   - Validate CDN configuration

## Best Practices

### Test Organization
- Use descriptive test names
- Group related tests in describe blocks
- Implement proper setup/teardown
- Use helper functions for common actions

### Environment Management
- Use environment variables for URLs
- Separate test data from production
- Implement proper cleanup procedures
- Handle different deployment environments

### Performance Optimization
- Set appropriate timeouts
- Use efficient selectors
- Minimize test dependencies
- Implement parallel execution

### Accessibility Testing
- Test with keyboard navigation
- Validate screen reader compatibility
- Check color contrast ratios
- Ensure proper ARIA labeling

## Monitoring and Alerts

### GitHub PR Comments
Automatic comments include:
- ✅/❌ Test results by browser
- 📊 Performance metrics
- ♿ Accessibility compliance
- 🔗 Links to detailed reports

### Performance Budgets
- First Contentful Paint: < 2 seconds
- Largest Contentful Paint: < 4 seconds
- Cumulative Layout Shift: < 0.1
- Total Bundle Size: < 1MB
- Unused JavaScript: < 100KB

### Quality Gates
- All accessibility tests must pass
- Performance scores must meet thresholds
- Cross-browser compatibility required
- No critical console errors allowed

## Integration Examples

### Testing New Features
```bash
# Create PR with new authentication feature
git checkout -b feature/new-auth-flow
git push origin feature/new-auth-flow

# GitHub automatically:
# 1. Creates deploy preview
# 2. Runs Playwright tests
# 3. Posts results to PR
# 4. Blocks merge if tests fail
```

### Manual Validation
```bash
# Test specific deploy preview
./scripts/test-deploy-preview.sh https://deploy-preview-456--your-site.netlify.app

# Compare with production
PRODUCTION_URL=https://your-site.netlify.app \
DEPLOY_PREVIEW_URL=https://deploy-preview-456--your-site.netlify.app \
npm run test:preview
```

## Troubleshooting

### Workflow Failures
1. Check GitHub Actions logs
2. Verify Netlify deployment status
3. Validate environment variables
4. Review test failure screenshots

### Local Testing Issues
1. Ensure deploy preview URL is accessible
2. Check network connectivity
3. Verify Playwright browsers are installed
4. Review local environment setup

### Performance Issues
1. Analyze Lighthouse reports
2. Check bundle size and optimization
3. Review network requests
4. Validate CDN configuration

This comprehensive testing setup ensures that every deploy preview is thoroughly validated before merging, maintaining high quality and preventing regressions in production.
