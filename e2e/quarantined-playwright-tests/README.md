# Quarantined Playwright Tests

## Why These Tests Are Quarantined

These Playwright test files have been moved here to prevent them from running accidentally during development. The project has transitioned to using **Stagehand** for E2E testing instead of traditional Playwright selectors.

## Issues with These Tests

1. **Brittle selectors**: These tests use CSS selectors that break when UI changes
2. **False negatives**: Tests fail even when functionality works correctly
3. **High maintenance overhead**: Require constant updates when UI evolves
4. **Mixed test suites**: Running these alongside Stagehand tests creates confusion

## Current E2E Testing Strategy

The project now uses **Stagehand** (@browserbasehq/stagehand) for E2E testing:
- `e2e/stagehand-auth-test.spec.ts` - Local authentication testing
- `e2e/stagehand-production-auth.spec.ts` - Production authentication testing

Stagehand uses AI-powered natural language actions that adapt to UI changes automatically.

## If You Need These Tests

If you need to run any of these quarantined tests:

1. **DON'T** move them back to the main e2e directory
2. **DO** run them individually: `npx playwright test e2e/quarantined-playwright-tests/specific-test.spec.ts`
3. **CONSIDER** converting them to Stagehand format instead

## Package.json Configuration

The main `test:e2e` script now only runs Stagehand tests:
```json
"test:e2e": "playwright test e2e/stagehand-auth-test.spec.ts e2e/stagehand-production-auth.spec.ts"
```

This prevents accidental execution of the quarantined tests.
