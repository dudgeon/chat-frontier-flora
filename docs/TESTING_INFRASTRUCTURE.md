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

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
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
