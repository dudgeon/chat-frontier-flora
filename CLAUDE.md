# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Environment & Development Server
```bash
# Check environment status before starting work
npm run status:check
npm run verify:test-env

# Start web development server (automatically copies .env from root)
cd apps/web && npm run web
# OR safely with environment verification
npm run dev:safe

# Start mobile development
npm run dev:mobile -- --ios    # iOS simulator
npm run dev:mobile -- --android # Android emulator
```

### Building & Deployment
```bash
# Build web application (Expo web export)
cd apps/web && npm run build
# OR from root
npm run build:web

# Build mobile (requires EAS setup)
npm run build:mobile
```

### Testing Commands
```bash
# Safe E2E testing with environment verification
npm run test:safe

# Environment-specific testing
npm run test:localhost      # Local testing only
npm run test:production     # Production verification only

# Specific test suites
npm run test:e2e           # All E2E tests
npm run test:e2e:login     # Login-specific tests
npm run test:e2e:ui        # Interactive test runner
npm run test:e2e:debug     # Debug mode with browser

# Unit tests (in web app)
cd apps/web && npm test
```

### Linting & Type Checking
```bash
# Run linting across all workspaces
npm run lint

# Type checking (in web app)
cd apps/web && npx tsc --noEmit
```

## Project Architecture

### Monorepo Structure
- **Yarn Workspaces** with `apps/*` and `packages/*`
- **apps/web**: Expo web app using React Native for Web
- **apps/mobile**: Expo mobile app with React Navigation
- **packages/shared**: Shared types, API client, utilities
- **packages/ui**: Shared UI components
- Code sharing via workspace references (`workspace:*`)

### Authentication System Architecture
- **Context-based state**: `AuthContext` provides global authentication state
- **Supabase Auth integration** with session persistence and automatic token refresh
- **Role-based access control**: Primary/Child user hierarchy enforced by database RLS policies
- **Protected routing**: Route guards with automatic redirection
- **Edge Functions fallback**: Authentication can work with Edge Functions or client-side only

**Critical Authentication Files:**
- `apps/web/src/contexts/AuthContext.tsx` - Core authentication logic and state management
- `apps/web/src/components/auth/SignUpForm.tsx` - User registration with complex validation
- `supabase/migrations/20240325_create_user_profiles.sql` - Database schema for user profiles

### Chat System Architecture
- **Component composition**: `ChatInterface` → `MessageList` + `MessageComposer` + `ChatHistoryPane`
- **Mock streaming**: Character-by-character message rendering simulation
- **Cross-platform components**: React Native components working on both web and mobile
- **Prepared for real-time**: Architecture ready for Supabase real-time subscriptions

### Technology Stack Integration
- **Expo 50.x** for universal React Native development
- **NativeWind 4.1+** for Tailwind CSS in React Native (strict compatibility required)
- **Supabase** for authentication, database, and real-time features
- **React 18.2.0** (exact version required for React Native Web compatibility)
- **TypeScript** throughout with strict configuration

### Testing Architecture
- **Stagehand-based E2E tests**: All active tests written using Stagehand AI (natural language browser automation)
- **Playwright test runner**: Executes Stagehand tests across multiple browsers (Chromium, Firefox, WebKit, Mobile)
- **Archived traditional Playwright tests**: Located in `e2e/archived/` and `e2e/quarantined-playwright-tests/` - ignore these
- **Current active tests**: All in `e2e/stagehand-*.spec.ts` files using AI-powered interactions
- **3-phase test structure**: Core (must pass) → Secondary (warnings) → Cleanup (never fails)
- **Environment-aware testing**: Dynamic test behavior based on localhost/preview/production

## Critical Development Rules

### Environment Management
- **Root `.env` file**: Contains all environment variables, automatically copied to `apps/web/.env`
- **Prefixed variables**: All Expo variables must use `EXPO_PUBLIC_` prefix
- **Environment verification**: Always run `npm run status:check` when debugging issues

### React Version Requirements
- **Exact React 18.2.0** required for React Native Web compatibility
- **No version ranges** allowed in package.json (use exact versions)
- **Legacy peer deps**: `.npmrc` must contain `legacy-peer-deps=true` for monorepo resolution

### NativeWind Compatibility
- **NativeWind 4.1+** strict compatibility requirements
- **Cross-platform styling**: Use NativeWind classes that work on both web and mobile
- **Theme integration**: Custom theme defined in `tailwind.config.js`

### Authentication Development
- **Never modify auth files** without reading `docs/AUTHENTICATION_FLOW_DOCUMENTATION.md` first
- **RLS policies**: Database-level security enforced in Supabase
- **Session management**: Automatic token refresh handled by Supabase client
- **Testing**: Login tests require special handling due to "Remember me" checkbox behavior

### Testing Guidelines
- **All tests are Stagehand-based**: Write tests using natural language AI actions, not traditional Playwright syntax
- **Ignore archived tests**: Traditional Playwright tests in `e2e/archived/` and `e2e/quarantined-playwright-tests/` are obsolete
- **Active test files**: Only work with `e2e/stagehand-*.spec.ts` files
- **E2E test protection**: See `docs/LOGIN_TEST_IMPLEMENTATION_GUIDE.md` for implementation details
- **Environment isolation**: Test data isolated from production via environment-specific stores
- **False failure prevention**: 3-phase architecture prevents unreliable test failures

### Deployment Requirements 
- **Build verification**: Always test builds locally before pushing
- **React version consistency**: Ensure exact React versions across all packages
- **Environment variables**: Verify all required env vars are set for target environment
- **Preview testing**: Never merge to main without preview deployment testing

## Development Workflow

1. **Start work**: Run `npm run status:check` to verify environment
2. **Environment setup**: Ensure `.env` exists in project root with required variables
3. **Development**: Use `npm run dev:safe` to start with environment verification
4. **Testing**: Run `npm run test:safe` for comprehensive E2E testing
5. **Pre-commit**: Verify builds work locally and tests pass
6. **Deployment**: Test on preview deployment before merging to main

## Important File Locations

### Configuration Files
- `.env` - Root environment variables (copied to apps/web/.env)
- `netlify.toml` - Deployment and edge function configuration
- `playwright.config.ts` - E2E testing configuration
- `tailwind.config.js` - NativeWind styling configuration

### Authentication System
- `apps/web/src/contexts/AuthContext.tsx` - Core auth logic
- `apps/web/src/components/auth/` - Auth forms and validation
- `supabase/migrations/` - Database schema and RLS policies

### Chat System
- `apps/web/src/components/chat/` - Chat interface components
- `apps/web/src/components/ChatPage.tsx` - Main chat page layout

### Testing
- `e2e/stagehand-*.spec.ts` - Active Stagehand-based E2E tests (AI-powered)
- `e2e/archived/` and `e2e/quarantined-playwright-tests/` - Obsolete traditional Playwright tests (ignore)
- `playwright.config.ts` - Test runner configuration 
- `docs/LOGIN_TEST_IMPLEMENTATION_GUIDE.md` - Critical testing documentation

Never create files unless absolutely necessary. Always prefer editing existing files. The authentication system was complex to implement correctly - handle auth-related changes with extreme care.