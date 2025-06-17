# GitHub Issue: Technical Debt - Hardcoded localhost URLs Throughout Codebase

## Issue Summary
**Title:** Refactor hardcoded localhost:19006 URLs to use centralized configuration management

**Priority:** Medium (Technical Debt)
**Type:** Enhancement
**Labels:** `technical-debt`, `refactoring`, `configuration`, `testing`

## Problem Description

The codebase contains hundreds of hardcoded references to `http://localhost:19006` across multiple file types, creating significant maintenance overhead and inflexibility in development environments.

### Current Impact
- **149+ hardcoded URL references** across test files, documentation, and configuration
- **Port changes require updating dozens of files** manually
- **Tests break** if development server starts on different port
- **No environment flexibility** for different development setups
- **Maintenance nightmare** for port configuration changes

### Files Affected
```bash
# Search results show 149+ references in:
- Test files (test-*.js, e2e/*.spec.ts)
- Documentation (docs/*.md) 
- Configuration files (playwright.config.ts)
- Historical logs and baselines
- Deployment guides and curl commands
```

## Proposed Solution

### Phase 1: Centralized Configuration
Create a single source of truth for development server URLs:

```typescript
// config/development.ts
export const DEV_CONFIG = {
  SERVER_URL: process.env.DEV_SERVER_URL || 'http://localhost:19006',
  SERVER_PORT: parseInt(process.env.DEV_SERVER_PORT || '19006'),
  // Add other dev config as needed
};
```

### Phase 2: Dynamic Port Detection
Implement automatic port discovery for tests:

```typescript
// utils/server-discovery.ts
export async function discoverDevServer(): Promise<string> {
  const commonPorts = [19006, 8081, 8082, 3000];
  for (const port of commonPorts) {
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.ok) return `http://localhost:${port}`;
    } catch {}
  }
  throw new Error('No development server found');
}
```

### Phase 3: Configuration Abstraction
Replace hardcoded URLs with centralized imports:

```typescript
// Before
await page.goto('http://localhost:19006');

// After  
import { DEV_CONFIG } from '../config/development';
await page.goto(DEV_CONFIG.SERVER_URL);
```

### Phase 4: Environment-Aware Testing
Make tests adapt to actual server configuration:

```typescript
// playwright.config.ts
import { discoverDevServer } from './utils/server-discovery';

export default defineConfig({
  use: {
    baseURL: await discoverDevServer(),
  },
  webServer: {
    command: 'cd apps/web && npm run web',
    port: await getServerPort(), // Dynamic port detection
    reuseExistingServer: true,
  },
});
```

## Benefits of Refactoring

1. **Single Point of Configuration** - Change URL in one place
2. **Environment Flexibility** - Different developers can use different ports
3. **Automatic Port Discovery** - Tests work regardless of server port
4. **Reduced Maintenance** - No more hunting through files for URLs
5. **Better Developer Experience** - Less friction when port conflicts occur
6. **Future-Proof** - Easy to add new environments (staging, preview, etc.)

## Implementation Plan

### Step 1: Configuration Layer (1-2 hours)
- [ ] Create `config/development.ts` with centralized URL management
- [ ] Add environment variable support (`DEV_SERVER_URL`, `DEV_SERVER_PORT`)
- [ ] Create utility functions for common patterns

### Step 2: Core Infrastructure (2-3 hours)
- [ ] Update `playwright.config.ts` to use centralized config
- [ ] Implement dynamic port discovery utility
- [ ] Update main test files to use new configuration

### Step 3: Systematic Replacement (4-6 hours)
- [ ] Replace hardcoded URLs in test files (test-*.js, e2e/*.spec.ts)
- [ ] Update documentation with environment variable usage
- [ ] Replace URLs in utility scripts

### Step 4: Validation (1 hour)
- [ ] Test with different port configurations
- [ ] Verify all tests still pass
- [ ] Update CI/CD documentation

## Migration Strategy

1. **Backward Compatible** - Keep existing hardcoded URLs working during transition
2. **Incremental** - Replace files in logical groups (tests, then docs, then scripts)
3. **Validation** - Test each phase to ensure no regressions
4. **Documentation** - Update developer setup guides with new environment variables

## Success Criteria

- [ ] Single `DEV_SERVER_URL` environment variable controls all URLs
- [ ] Tests automatically discover development server port
- [ ] Changing development port requires zero code changes
- [ ] All existing functionality preserved
- [ ] Improved developer onboarding documentation

---

**Estimated Effort:** 8-12 hours
**Risk Level:** Low (incremental changes with validation)
**Dependencies:** None (can be done independently)

**Note:** This refactoring will significantly improve maintainability and developer experience, especially as the project scales and more developers join with different local configurations.