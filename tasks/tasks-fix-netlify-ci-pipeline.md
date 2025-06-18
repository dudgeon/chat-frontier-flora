# Fix Netlify CI Pipeline - Metro Conversion Issue

**Based on:** GitHub Issue #24 - Fix Netlify CI build after Metro conversion - webpack commands obsolete

## Problem Summary
After converting from Webpack to Metro bundler, Netlify CI deployment fails because build commands still reference webpack-specific Expo commands (`expo export:web`) instead of Metro-compatible commands (`expo export`).

## Relevant Files

- `netlify.toml` - Main Netlify configuration file containing build commands
- `package.json` - Contains npm scripts including `build:web` command
- `apps/web/package.json` - Web app specific package.json
- `.env` - Environment variables that need to be verified in Netlify
- `apps/web/.env` - Local web app environment file
- `docs/DEPLOYMENT.md` - Documentation that may need updating (if exists)

### Notes

- Test locally with `cd apps/web && npx expo export` before deploying
- Verify Netlify environment variables are properly configured
- Check that publish directory matches Metro output location
- No unit tests required for configuration changes, but manual testing is critical

## Tasks

- [ ] 1.0 Update Build Configuration for Metro Compatibility
  - [ ] 1.1 Read current `package.json` to understand existing `build:web` script
  - [ ] 1.2 Update `build:web` script from `expo export:web` to `expo export`
  - [ ] 1.3 Verify the script works locally by running `npm run build:web`
  - [ ] 1.4 Check if any other scripts reference webpack-specific commands
- [ ] 2.0 Verify Metro Build Output and Directory Structure
  - [ ] 2.1 Run `cd apps/web && npx expo export` locally to test Metro build
  - [ ] 2.2 Document the actual output directory created by Metro
  - [ ] 2.3 Compare output structure with current Netlify publish directory expectation
  - [ ] 2.4 Verify all required assets (HTML, JS, CSS) are generated correctly
- [ ] 3.0 Update Netlify Deployment Configuration
  - [ ] 3.1 Read current `netlify.toml` configuration
  - [ ] 3.2 Update build command to use Metro-compatible command
  - [ ] 3.3 Verify/update publish directory to match Metro output
  - [ ] 3.4 Check Netlify environment variables are properly configured
  - [ ] 3.5 Verify edge functions configuration is still compatible
- [ ] 4.0 Test and Validate CI Pipeline
  - [ ] 4.1 Create test commit to trigger Netlify build
  - [ ] 4.2 Monitor Netlify build logs for successful completion
  - [ ] 4.3 Test deployed application functionality (auth, routing, chat)
  - [ ] 4.4 Verify all environment variables work in production
  - [ ] 4.5 Run E2E tests against deployed version
- [ ] 5.0 Update Documentation and Cleanup
  - [ ] 5.1 Update CLAUDE.md build commands section if needed
  - [ ] 5.2 Close GitHub issue #24 with summary of changes
  - [ ] 5.3 Document any Metro-specific deployment considerations
  - [ ] 5.4 Verify all team members can still build locally