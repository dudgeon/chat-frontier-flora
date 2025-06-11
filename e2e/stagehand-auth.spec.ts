import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

/**
 * 🎭 STAGEHAND AUTHENTICATION TESTS
 *
 * Unified test suite that runs against any environment (local/preview/production)
 * controlled by environment variables:
 *
 * - No env vars = local testing (localhost:19006)
 * - DEPLOY_PREVIEW_URL = preview deployment testing
 * - TEST_PRODUCTION = production testing (frontier-family-flora.netlify.app)
 */

// Environment detection
const PRODUCTION_URL = 'https://frontier-family-flora.netlify.app';
const PREVIEW_URL = process.env.DEPLOY_PREVIEW_URL;
const IS_PRODUCTION = process.env.TEST_PRODUCTION === 'true';

// Determine target URL based on environment
function getTargetUrl(): string {
  if (IS_PRODUCTION) return PRODUCTION_URL;
  if (PREVIEW_URL) return PREVIEW_URL;
  return '/'; // Local development (uses Playwright's baseURL)
}

test.describe('Authentication Flow', () => {
  let stagehand: Stagehand;

  test.beforeEach(async () => {
    stagehand = new Stagehand({
      env: 'LOCAL', // Stagehand only supports 'LOCAL' or 'BROWSERBASE'
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY
      }
    });
    await stagehand.init();
  });

  test.afterEach(async () => {
    // Capture final state before cleanup
    try {
      const finalState = await stagehand.page.extract({
        instruction: 'capture the final state of the page',
        schema: z.object({
          currentUrl: z.string().describe('the current page URL'),
          isAuthenticated: z.boolean().describe('whether the user appears to be authenticated'),
          visibleContent: z.string().describe('any important visible content on the page'),
        }),
      });

      console.log('📸 Final page state before cleanup:', finalState);

      // If we're authenticated with no errors, core flow succeeded
      if (finalState.isAuthenticated) {
        console.log('✅ Core authentication flow verified successful');
      }
    } catch (error) {
      // Don't fail the test for cleanup state capture errors
      console.log('ℹ️ Could not capture final state:', error);
    }

    await stagehand.close();
  });

  test('should complete signup flow successfully', async () => {
    const targetUrl = getTargetUrl();
    console.log(`🎭 Testing authentication flow on ${targetUrl}...`);

    // Increase timeout for production/preview testing
    if (IS_PRODUCTION || PREVIEW_URL) {
      test.setTimeout(300000); // 5 minutes for production/preview
    } else {
      test.setTimeout(120000); // 2 minutes for local
    }

    const page = stagehand.page;
    let finalState = null;

    try {
      await page.goto(targetUrl);
      await page.act('wait for the signup form to be visible');

      // Generate test user data
      const testEmail = `test-${Date.now()}@stagehand-demo.com`;
      const testPassword = 'StagehandTest123!';
      const testName = 'Stagehand Tester';
      console.log('📝 Creating account for:', testEmail);

      // Fill out the form using natural language
      await page.act(`fill in the full name field with "${testName}"`);
      await page.act(`fill in the email field with "${testEmail}"`);
      await page.act(`fill in the password field with "${testPassword}"`);
      await page.act(`fill in the confirm password field with "${testPassword}"`);
      await page.act('check the age verification checkbox');
      await page.act('check the development consent checkbox');

      // Submit the form
      await page.act('click the submit button to create the account');
      console.log('⏳ Waiting for signup process to complete...');
      await page.act('wait for the page to finish loading and any loading indicators to disappear');

      // CRITICAL: Capture final state before any cleanup
      const signupResult = await page.extract({
        instruction: 'get the signup result',
        schema: z.object({
          userIsAuthenticated: z.boolean(),
          hasErrorMessages: z.boolean(),
          hasProfileMenu: z.boolean(),
          pageContent: z.string()
        })
      });
      finalState = signupResult;
      console.log('✅ Signup result:', finalState);

      // Core success criteria - same across all environments
      if (finalState.userIsAuthenticated && !finalState.hasErrorMessages) {
        console.log('🎉 Core authentication flow completed successfully!');
      } else {
        throw new Error('Core authentication failed - see finalState for details');
      }

      // Optional: Test profile menu if available
      if (finalState.hasProfileMenu) {
        try {
          console.log('🔍 Testing profile menu functionality...');
          const menuState = await page.extract({
            instruction: 'get profile menu state',
            schema: z.object({
              isMenuOpen: z.boolean(),
              userEmail: z.string(),
              hasLogoutButton: z.boolean()
            })
          });
          console.log('👤 Profile menu state:', menuState);
        } catch (error: unknown) {
          // Don't fail test for menu issues if core auth worked
          const menuError = error as Error;
          console.log('⚠️ Non-critical profile menu error:', menuError.message);
        }
      }
    } catch (error: unknown) {
      const testError = error as Error;
      if (testError.message.includes('context has been closed') && finalState?.userIsAuthenticated) {
        // Test succeeded, cleanup error can be ignored
        console.log('🎉 Core authentication flow completed successfully!');
        console.log('ℹ️ Cleanup errors ignored - core functionality verified');
      } else {
        // Real test failure
        console.error('❌ Test failed:', testError.message);
        throw error;
      }
    }
  });

  test('should complete full user journey successfully', async () => {
    const targetUrl = getTargetUrl();
    console.log(`🎭 Testing complete user journey on ${targetUrl}...`);

    // Increase timeout for production/preview testing
    if (IS_PRODUCTION || PREVIEW_URL) {
      test.setTimeout(300000); // 5 minutes for production/preview
    } else {
      test.setTimeout(120000); // 2 minutes for local
    }

    const page = stagehand.page;
    let finalState = null;

    try {
      // 1. SIGNUP FLOW
      await page.goto(targetUrl);
      await page.act('wait for the signup form to be visible');

      // Generate test user data
      const testEmail = `test-${Date.now()}@stagehand-demo.com`;
      const testPassword = 'StagehandTest123!';
      const testName = 'Stagehand Tester';
      console.log('📝 Creating account for:', testEmail);

      // Fill out the form using natural language
      await page.act(`fill in the full name field with "${testName}"`);
      await page.act(`fill in the email field with "${testEmail}"`);
      await page.act(`fill in the password field with "${testPassword}"`);
      await page.act(`fill in the confirm password field with "${testPassword}"`);
      await page.act('check the age verification checkbox');
      await page.act('check the development consent checkbox');

      // Verify form state before submission
      const formState = await page.extract({
        instruction: 'get the form state',
        schema: z.object({
          isFormValid: z.boolean(),
          submitButtonEnabled: z.boolean(),
          passwordStrength: z.string().nullable()
        })
      });
      console.log('📊 Form state:', formState);
      expect(formState.isFormValid).toBe(true);
      expect(formState.submitButtonEnabled).toBe(true);

      // Submit the form
      await page.act('click the submit button to create the account');
      console.log('⏳ Waiting for signup process to complete...');
      await page.act('wait for the page to finish loading and any loading indicators to disappear');

      // 2. VERIFY CHAT PAGE ACCESS
      const chatPageState = await page.extract({
        instruction: 'verify chat page state - check if user is on the main app page with welcome message and coming soon message',
        schema: z.object({
          isOnChatPage: z.boolean(),
          userIsAuthenticated: z.boolean(),
          hasWelcomeMessage: z.boolean(),
          hasComingSoonMessage: z.boolean(),
          hasProfileMenu: z.boolean()
        })
      });
      console.log('💬 Chat page state:', chatPageState);

      // Core functionality assertions
      expect(chatPageState.userIsAuthenticated).toBe(true);
      expect(chatPageState.hasWelcomeMessage).toBe(true);
      expect(chatPageState.hasComingSoonMessage).toBe(true);
      expect(chatPageState.hasProfileMenu).toBe(true);

      // Mark test as successful after core functionality verification
      console.log('✅ Core functionality verified successful');

      // 3. SECONDARY FEATURES (Non-critical)
      try {
        // Profile menu interaction (non-critical)
        const menuState = await page.extract({
          instruction: 'check profile menu state',
          schema: z.object({
            isMenuOpen: z.boolean(),
            userEmail: z.string(),
            hasLogoutButton: z.boolean()
          })
        });
        console.log('👤 Profile menu state:', menuState);
      } catch (error) {
        // Log but don't fail test - profile menu is secondary
        console.log('ℹ️ Profile menu check skipped:', (error as Error).message);
      }

      // 4. FINAL STATE CAPTURE (Non-critical)
      try {
        const finalState = await page.extract({
          instruction: 'get final page state',
          schema: z.object({
            currentUrl: z.string().nullable(),
            isAuthenticated: z.boolean(),
            visibleContent: z.string()
          })
        });
        console.log('📸 Final page state:', finalState);
      } catch (error) {
        // Log but don't fail test - final state capture is for debugging only
        console.log('ℹ️ Final state capture skipped:', (error as Error).message);
      }

      // Test is considered successful after core functionality verification
      console.log('✅ Test completed successfully - core functionality verified');

    } catch (error: unknown) {
      const testError = error as Error;
      console.error('❌ Test failed:', testError.message);
      throw error;
    }
  });

  // Additional test cases can be added here - they'll automatically run against the right environment
});
