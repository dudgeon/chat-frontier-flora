# Detective Controls for Error Prevention

## Purpose
This document outlines detective controls implemented in the project to prevent recurring errors and maintain system reliability. These controls serve as early warning systems and preventive measures to catch issues before they impact production.

## Current Controls

### 1. Deployment Workflow Verification
- **Control**: Strict enforcement of preview deployments before production
- **Implementation**: See `PRODUCTION_DEPLOYMENT_PROTOCOL.md`
- **Prevention**: Prevents direct pushes to main without proper testing

### 2. Directory Context Validation
- **Control**: Expo commands must run from apps/web directory
- **Implementation**: Pre-commit hooks and documentation
- **Prevention**: Avoids build failures from incorrect directory context

### 3. Build Status Monitoring
- **Control**: Webpack compilation warning vs error verification
- **Implementation**: CI checks and deployment protocols
- **Prevention**: Catches build issues before deployment

### 4. Test Selector Standards
- **Control**: Enforced use of data-testid selectors
- **Implementation**: E2E test configurations
- **Prevention**: Prevents flaky tests from inconsistent selectors

## Adding New Controls

When adding a new detective control:

1. Document the error that prompted the control
2. Describe the implementation details
3. Explain how it prevents recurrence
4. Add any relevant configuration or code examples

## Control Categories

### Build Process Controls
- Directory context validation
- Dependency verification
- Compilation status checks

### Testing Controls
- Selector standards
- Environment-specific checks
- Authentication flow validation

### Deployment Controls
- Preview deployment requirements
- CI check verification
- Production verification steps

## Maintenance

This document should be updated whenever:
- A new preventable error is encountered
- A new detective control is implemented
- Existing controls are modified or improved
- New best practices are established

## Recent Additions

_Add new controls here as they are implemented, with date and rationale_
