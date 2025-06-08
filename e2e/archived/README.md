# Archived Playwright Authentication Tests

This folder contains Playwright-based authentication tests and helpers that were used in the Frontier Family Flora project prior to the adoption of Stagehand for end-to-end authentication testing.

## Archived Files
- `auth-flow.spec.ts`: Comprehensive authentication flow test (signup, login, logout, error handling).
- `debug-auth.spec.ts`: Debugging-focused test for authentication edge cases.
- `debug-existing-auth.spec.ts`: Test for flows involving pre-existing authenticated users.
- `debug-authenticated-user.spec.ts`: Test for user state after authentication.
- `helpers/auth-helpers.ts`: Shared Playwright helper functions for authentication flows.

## Context & Rationale for Archiving
- **Purpose:** These tests were originally written to automate and validate the authentication experience for users, including signup, login, logout, and error handling.
- **What Worked:**
  - Automated regression coverage for core auth flows.
  - Caught breaking changes in authentication UI and backend.
  - Provided a baseline for CI/CD quality gates.
- **What Didn't Work:**
  - Tests were brittle: frequent failures due to UI selector changes, timing issues, and async race conditions.
  - High maintenance overhead: required constant updates as the UI evolved.
  - False negatives: tests failed even when the app worked for real users, due to selector or timing mismatches.
- **Why Replaced:**
  - Stagehand offers AI-powered, self-healing tests that adapt to UI changes and reflect real user experience.
  - 90% reduction in test maintenance.
  - No more false negatives from selector/timing issues.
  - Structured data extraction and schema validation.

## Reference
If you need to reference legacy Playwright authentication logic, see the files in this folder. For current tests, see the Stagehand-based specs in the main `e2e/` directory.
