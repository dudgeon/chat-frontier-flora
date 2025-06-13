import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';
// Load root .env first (superset) then override/extend with .env.stagehand if present
dotenvConfig({ path: path.resolve(__dirname, '..', '.env') });
dotenvConfig({ path: path.resolve(__dirname, '..', '.env.stagehand') });

/**
 * 🎭 STAGEHAND LOGIN FLOW TEST
 *
 * Validates existing user can log in and reach /chat using 3-phase false-failure-prevention architecture.
 *
 * CRITICAL IMPLEMENTATION NOTES:
 *
 * 1. "Remember Me" Checkbox Handling:
 *    - MUST check "Remember me" checkbox to prevent immediate token deletion
 *    - LoginForm.tsx deletes auth token immediately after login if "Remember me" is false
 *    - Without this, user appears to login but gets logged out before test can verify
 *    - This was the PRIMARY cause of login test failures vs signup test successes
 *
 * 2. Form Switching Logic:
 *    - App defaults to signup form, must switch to login form
 *    - Uses specific data-testid selector for reliability
 *    - Includes explicit wait time for form transition animation
 *    - Proper error handling prevents false failures
 *
 * 3. Authentication Detection:
 *    - Uses direct content checking instead of AI extraction (more reliable)
 *    - Checks multiple indicators: welcome message, profile menu, URL, content
 *    - Handles edge cases like expanded profile menus
 *    - AI extraction gave false negatives even when login succeeded
 *
 * 4. Multi-Strategy Button Interaction:
 *    - Primary: Direct testID click
 *    - Fallback: Natural language Stagehand action
 *    - Includes button state debugging for troubleshooting
 *    - Handles various button states during form transitions
 *
 * REQUIREMENTS
 * 1. Set env vars TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD to an existing Supabase user.
 *    – If either var is missing the test is SKIPPED (avoids hard-coding secrets).
 * 2. OPENAI_API_KEY must be set (used by Stagehand).
 *
 * 🛡️ 3-PHASE ARCHITECTURE (CRITICAL - DO NOT MODIFY)
 * PHASE 1  – Core login flow (throws on failure)        ✅ must pass
 * PHASE 2  – Secondary UI checks (logs warnings)       ⚠️ non-critical
 * PHASE 3  – Cleanup (never throws)                    🧹 non-critical
 *
 * ⚠️ WARNING: Modifying this test requires understanding of all the above issues.
 * See docs/LOGIN_TEST_IMPLEMENTATION_GUIDE.md for complete details.
 */

// ---------------- Environment Detection ----------------
function getEnvironmentInfo() {
  const deployPreviewUrl = process.env.DEPLOY_PREVIEW_URL;
  const testProduction = process.env.TEST_PRODUCTION === 'true';

  if (testProduction) {
    return { name: 'Production', baseUrl: 'https://frontier-family-flora.netlify.app', icon: '🌐' };
  }
  if (deployPreviewUrl) {
    return { name: 'Preview', baseUrl: deployPreviewUrl, icon: '🔍' };
  }
  return { name: 'Localhost', baseUrl: 'http://localhost:19006', icon: '🏠' };
}
const ENV = getEnvironmentInfo();

// Skip test altogether if creds are missing – prevents unintended failures in CI
const LOGIN_EMAIL = process.env.TEST_LOGIN_EMAIL;
const LOGIN_PASSWORD = process.env.TEST_LOGIN_PASSWORD;
if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  Skipping Login Flow test – TEST_LOGIN_EMAIL / PASSWORD env vars not set');
  test.describe.skip('Stagehand Login Flow', () => {/* skipped */});
} else {
  // ---------------- Test Suite ----------------
  test.describe(`${ENV.icon} Stagehand Login Flow [${ENV.name}]`, () => {
    let stagehand: Stagehand;

    test.beforeEach(async () => {
      stagehand = new Stagehand({
        env: 'LOCAL',
        apiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        modelClientOptions: { apiKey: process.env.OPENAI_API_KEY },
      });
      await stagehand.init();
      console.log(`🎭 Stagehand login test initialised – ${ENV.name}`);
    });

    test.afterEach(async () => {
      await stagehand.close();
    });

    test(`${ENV.icon} User can log in and reach chat on ${ENV.name}`, async () => {
      test.setTimeout(60000); // 60s overall timeout – fail fast
      const page = stagehand.page;

      // -------- PHASE 1 – CORE FUNCTIONALITY (MUST PASS) --------
      console.log('🎯 Phase 1: Core Login Flow');

      try {
        // Navigate to root
        await page.goto(ENV.baseUrl);

        // CRITICAL: Wait for page to load completely before any interactions
        // Prevents race conditions with form rendering
        await page.act('wait for the page to finish loading and any loading indicators to disappear');

        // CRITICAL: Form Switching Logic
        // App defaults to signup form, must switch to login form
        // Uses specific data-testid for reliability, includes error handling
        const switchToLoginVisible = await page.locator('[data-testid="switch-to-login"]').isVisible().catch(() => false);
        if (switchToLoginVisible) {
          console.log('📝 Switching from signup to login form');
          await page.locator('[data-testid="switch-to-login"]').click();
          // CRITICAL: Wait for form transition animation to complete
          // Without this, subsequent form interactions may fail
          await page.waitForTimeout(1000);
        }

        // Fill login form using natural language (more robust than selectors)
        console.log(`📝 Logging in as: ${LOGIN_EMAIL}`);
        await page.act(`fill in the email field with "${LOGIN_EMAIL}"`);
        await page.act(`fill in the password field with "${LOGIN_PASSWORD}"`);

        // CRITICAL: "Remember Me" Checkbox Handling
        // This is THE MOST IMPORTANT part of the login test
        // LoginForm.tsx immediately deletes auth token after login if "Remember me" is false
        // Without this, user appears to login but gets logged out before verification
        const rememberMeVisible = await page.locator('[data-testid="remember-me-checkbox"]').isVisible().catch(() => false);
        if (rememberMeVisible) {
          const isChecked = await page.locator('[data-testid="remember-me-checkbox"]').isChecked().catch(() => false);
          if (!isChecked) {
            console.log('☑️ Checking "Remember me" checkbox');
            await page.locator('[data-testid="remember-me-checkbox"]').click();
          }
        }

        // Extract button state for debugging purposes
        // Helps troubleshoot button interaction failures
        const buttonState = await page.extract({
          instruction: 'Extract the submit button state',
          schema: z.object({
            isVisible: z.boolean(),
            isEnabled: z.boolean(),
            buttonText: z.string(),
            isLoading: z.boolean()
          })
        });
        console.log(`🔍 Button state before interaction: ${JSON.stringify(buttonState)}`);

        // CRITICAL: Multi-Strategy Button Clicking
        // Button state can vary during form transitions, need fallback strategies
        console.log('🎯 Attempting button click');
        let buttonClicked = false;

        // Strategy 1: Direct testID click (preferred)
        try {
          await page.locator('[data-testid="submit-button"]').click({ timeout: 5000 });
          buttonClicked = true;
          console.log('✅ Button clicked via testID');
        } catch {
          // Strategy 2: Natural language fallback
          try {
            await page.act('click the submit button or sign in button');
            buttonClicked = true;
            console.log('✅ Button clicked via natural language');
          } catch {
            console.log('❌ Failed to click button');
          }
        }

        if (!buttonClicked) {
          throw new Error('Failed to click login button');
        }

        // Wait for navigation and authentication to complete
        console.log('⏳ Waiting for login process to complete...');
        await page.act('wait for the page to finish loading and any loading indicators to disappear');

        // CRITICAL: Authentication State Detection
        // Uses direct content checking instead of AI extraction (more reliable)
        // AI extraction gave false negatives even when login was successful
        const pageContent = await page.content();
        const hasComingSoonText = pageContent.includes('Chat Feature Coming Soon') ||
                                 pageContent.includes("We're working hard to bring you an amazing chat experience");
        const hasWelcomeMessage = pageContent.includes('Welcome,') && pageContent.includes(LOGIN_EMAIL);
        const hasProfileMenu = await page.locator('[data-testid="profile-menu-button"], text="👤"').isVisible().catch(() => false);
        const currentUrl = page.url();
        const isOnChatPage = currentUrl.includes('/chat') || hasComingSoonText;

        // CRITICAL: Multiple Authentication Indicators
        // User is authenticated if we see welcome message OR profile menu (it might be expanded already)
        // This handles edge cases like expanded profile menus
        const userIsAuthenticated = hasWelcomeMessage || hasProfileMenu;

        const loginResult = {
          isOnChatPage,
          hasComingSoonText,
          currentUrl,
          userIsAuthenticated,
          hasProfileMenu,
          hasWelcomeMessage,
          hasErrorMessages: pageContent.includes('Invalid') || pageContent.includes('Error') || pageContent.includes('Failed')
        };

        console.log(`✅ Login result: ${JSON.stringify(loginResult, null, 2)}`);

        // CRITICAL: Core Functionality Verification
        // These assertions MUST pass for test to succeed
        expect(loginResult.isOnChatPage).toBe(true);
        expect(loginResult.userIsAuthenticated).toBe(true);
        expect(loginResult.hasErrorMessages).toBe(false);

        console.log('🎉 Core login flow completed successfully!');
        console.log(`📊 Core functionality verified: {
  environment: '${ENV.name}',
  authenticated: ${loginResult.userIsAuthenticated},
  redirectedToChat: ${loginResult.isOnChatPage},
  hasExpectedContent: ${loginResult.hasComingSoonText}
}`);

      } catch (err) {
        console.error('❌ Core login failure:', err);
        throw err; // CRITICAL: Phase 1 failures MUST fail the test
      }

      // -------- PHASE 2 – SECONDARY FEATURES (NON-CRITICAL) --------
      // 🛡️ CRITICAL: Failures in this phase must NOT fail the test
      // These are additional verifications that provide value but aren't core functionality
      console.log('🔧 Phase 2: Secondary Features Testing (Non-Critical)');
      try {
        console.log('🔍 Testing profile menu...');
        await page.act('click on the profile menu button or avatar');
        await page.waitForTimeout(2000);

        const profileMenuState = await page.extract({
          instruction: 'Extract profile menu state',
          schema: z.object({
            isMenuOpen: z.boolean(),
            userEmail: z.string().nullable(),
            hasLogoutButton: z.boolean()
          })
        });

        console.log(`👤 Profile menu state: ${JSON.stringify(profileMenuState, null, 2)}`);
      } catch (err) {
        // CRITICAL: Only log warnings, never throw in Phase 2
        console.warn('⚠️ Secondary feature warning:', err instanceof Error ? err.message : String(err));
      }

      // -------- PHASE 3 – CLEANUP (NON-CRITICAL) --------
      // 🛡️ CRITICAL: This phase must NEVER fail the test
      // Used for debugging information and resource cleanup
      console.log('🧹 Phase 3: Cleanup Phase (Non-Critical)');
      try {
        const finalState = await page.extract({
          instruction: 'Extract final page state',
          schema: z.object({
            currentUrl: z.string().nullable(),
            pageContent: z.string(),
            testCompleted: z.boolean()
          })
        });

        console.log(`📋 Final test state: ${JSON.stringify(finalState, null, 2)}`);
        console.log('🎉 Stagehand login flow test completed successfully!');
      } catch (err) {
        // CRITICAL: Only log warnings, never throw in Phase 3
        console.warn('⚠️ Cleanup warning (ignored):', err instanceof Error ? err.message : String(err));
      }
    });
  });
}
