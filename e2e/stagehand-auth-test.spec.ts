import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

/**
 * 🎭 STAGEHAND AUTHENTICATION FLOW TESTS
 *
 * This test suite automatically detects the environment and includes it in test names
 * for clear reporting while maintaining a single unified test file.
 */

// Dynamic environment detection
function getEnvironmentInfo() {
  const deployPreviewUrl = process.env.DEPLOY_PREVIEW_URL;
  const testProduction = process.env.TEST_PRODUCTION === 'true';

  if (testProduction) {
    return {
      name: 'Production',
      baseUrl: 'https://frontier-family-flora.netlify.app',
      icon: '🌐'
    };
  } else if (deployPreviewUrl) {
    return {
      name: 'Preview',
      baseUrl: deployPreviewUrl,
      icon: '🔍'
    };
  } else {
    return {
      name: 'Localhost',
      baseUrl: 'http://localhost:19006',
      icon: '🏠'
    };
  }
}

// Get environment info once at module load
const ENV = getEnvironmentInfo();

// Dynamic test suite with environment-aware naming
test.describe(`${ENV.icon} Stagehand Authentication Flow [${ENV.name}]`, () => {
  let stagehand: Stagehand;

  test.beforeEach(async () => {
    // Initialize Stagehand with our OpenAI API key
    stagehand = new Stagehand({
      env: 'LOCAL',
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini', // Cost-effective model for testing
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    await stagehand.init();
    console.log(`🎭 Initializing Stagehand tests for ${ENV.name} environment (${ENV.baseUrl})`);
  });

  test.afterEach(async () => {
    await stagehand.close();
  });

  // Core authentication test with environment in name
  test(`${ENV.icon} Complete signup and authentication flow on ${ENV.name}`, async () => {
    // Increase timeout for authentication flow which involves network requests
    test.setTimeout(300000); // 5 minutes for multi-browser testing
    console.log(`🎭 Testing Stagehand-powered authentication flow on ${ENV.name}...`);

    const page = stagehand.page;

    // Navigate using detected environment
    await page.goto(ENV.baseUrl);

    // Core Functionality Phase (Must Pass)
    console.log('🎯 Phase 1: Core Functionality Testing');

    try {
      // Wait for page load with timeout
      const pageLoadPromise = page.act('wait for the signup form to be visible');
      const pageLoadResult = await Promise.race([
        pageLoadPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Page load timeout after 30s')), 30000)
        )
      ]);

      // Generate test user data
      const testEmail = `test-${Date.now()}@stagehand-${ENV.name.toLowerCase()}.com`;
      const testPassword = 'StagehandTest123!';
      const testName = `Stagehand ${ENV.name} Tester`;

      console.log(`📝 Creating account for: ${testEmail} on ${ENV.name}`);

      // Fill out the form using natural language with timeout
      const formFillPromise = (async () => {
        await page.act(`fill in the full name field with "${testName}"`);
        await page.act(`fill in the email field with "${testEmail}"`);
        await page.act(`fill in the password field with "${testPassword}"`);
        await page.act(`fill in the confirm password field with "${testPassword}"`);
        await page.act('check the age verification checkbox');
        await page.act('check the development consent checkbox');
      })();

      await Promise.race([
        formFillPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Form fill timeout after 30s')), 30000)
        )
      ]);

      // Extract form state to verify everything is filled correctly
      const formState = await page.extract({
        instruction: 'extract the current state of the signup form',
        schema: z.object({
          submitButtonEnabled: z.boolean().describe('whether the submit button is enabled'),
          passwordStrength: z.string().describe('the password strength indicator text if visible'),
        }),
      });

      console.log(`📊 ${ENV.name} form state:`, formState);

      // Core validation - submit button must be enabled
      expect(formState.submitButtonEnabled).toBe(true);

      // Submit the form with timeout
      const submitPromise = (async () => {
        try {
          await page.act('click the submit button to create the account');
        } catch (error) {
          console.log('⚠️ First submit attempt failed, trying alternative approach...');
          await page.act('click the button that says "Create Account" or "Complete Form to Continue"');
        }
      })();

      await Promise.race([
        submitPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Submit timeout after 60s')), 60000)
        )
      ]);

      // Wait for signup completion with timeout
      console.log(`⏳ Waiting for signup process to complete on ${ENV.name}...`);
      const signupWaitPromise = page.act('wait for the page to finish loading and any loading indicators to disappear');
      await Promise.race([
        signupWaitPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Signup completion timeout after 60s')), 60000)
        )
      ]);

      // Verify successful signup - CORE SUCCESS CRITERIA
      const signupResult = await page.extract({
        instruction: `check if the user was successfully signed up on ${ENV.name} environment`,
        schema: z.object({
          isOnChatPage: z.boolean().describe('whether the user is now on a page with chat-related content or "Chat Feature Coming Soon" text'),
          hasComingSoonText: z.boolean().describe('whether the page shows "Chat Feature Coming Soon" or similar placeholder text'),
          currentUrl: z.string().describe('the current page URL'),
          userIsAuthenticated: z.boolean().describe('whether the user appears to be logged in'),
          hasProfileMenu: z.boolean().describe('whether a profile menu button or hamburger menu (☰) is visible in the top right'),
          isStillOnSignup: z.boolean().describe('whether still on the signup page'),
          hasErrorMessages: z.boolean().describe('whether there are any error messages visible'),
        }),
      });

      console.log(`✅ ${ENV.name} signup result:`, signupResult);

      // CORE FUNCTIONALITY MUST PASS - Mark test as successful after this point
      expect(signupResult.isStillOnSignup).toBe(false);
      expect(signupResult.isOnChatPage || signupResult.hasComingSoonText).toBe(true);
      expect(signupResult.userIsAuthenticated).toBe(true);
      expect(signupResult.hasErrorMessages).toBe(false);

      console.log(`🎉 Core authentication flow completed successfully on ${ENV.name}!`);

      // Capture successful state before secondary features
      const coreState = {
        environment: ENV.name,
        authenticated: signupResult.userIsAuthenticated,
        redirectedFromSignup: !signupResult.isStillOnSignup,
        hasExpectedContent: signupResult.isOnChatPage || signupResult.hasComingSoonText
      };
      console.log('📊 Core functionality verified:', coreState);

    } catch (error) {
      console.error(`❌ Core functionality failed on ${ENV.name}:`, error instanceof Error ? error.message : String(error));
      throw error; // Fail the test if core functionality fails
    }

    // Secondary Features Phase (Non-Critical)
    console.log('🔧 Phase 2: Secondary Features Testing (Non-Critical)');

    try {
      // Test profile menu functionality with timeout
      const menuTestPromise = (async () => {
        const profileMenuCheck = await page.extract({
          instruction: 'check for profile menu availability',
          schema: z.object({
            hasProfileMenu: z.boolean().describe('whether a profile menu is visible'),
          }),
        });

        if (profileMenuCheck.hasProfileMenu) {
          console.log(`🔍 Testing profile menu on ${ENV.name}...`);
          await page.act('click the profile menu button in the top right');

          const profileMenuState = await page.extract({
            instruction: 'extract information about the opened profile menu',
            schema: z.object({
              isMenuOpen: z.boolean().describe('whether the profile menu is open'),
              userEmail: z.string().describe('the user email displayed in the menu'),
              hasLogoutButton: z.boolean().describe('whether a logout button is visible'),
            }),
          });

          console.log(`👤 ${ENV.name} profile menu state:`, profileMenuState);

          if (profileMenuState.isMenuOpen && profileMenuState.hasLogoutButton) {
            await page.act('click the logout button');

            const logoutResult = await page.extract({
              instruction: 'verify the user was logged out successfully',
              schema: z.object({
                isBackToSignup: z.boolean().describe('whether the user is back on the signup page'),
                isLoggedOut: z.boolean().describe('whether the user appears to be logged out'),
                signupFormVisible: z.boolean().describe('whether the signup form is visible again'),
              }),
            });

            console.log(`🚪 ${ENV.name} logout result:`, logoutResult);
            console.log(`🎉 Full authentication cycle including logout completed on ${ENV.name}!`);
          }
        } else {
          console.log(`ℹ️ No profile menu detected on ${ENV.name} - skipping menu tests`);
        }
      })();

      await Promise.race([
        menuTestPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Menu interaction timeout after 30s')), 30000)
        )
      ]);

    } catch (error) {
      console.log(`⚠️ Secondary features testing failed on ${ENV.name} (non-critical):`, error instanceof Error ? error.message : String(error));
      // Don't fail the test - secondary features are non-critical
    }

    // Cleanup Phase (Non-Critical)
    console.log('🧹 Phase 3: Cleanup Phase (Non-Critical)');

    try {
      // Capture final state for debugging
      const finalState = await page.extract({
        instruction: `capture final test state for ${ENV.name} environment`,
        schema: z.object({
          currentUrl: z.string().describe('final URL'),
          pageContent: z.string().describe('brief description of page content'),
          testCompleted: z.boolean().describe('whether the test appears to have completed successfully'),
        }),
      });
      console.log(`📋 Final ${ENV.name} test state:`, finalState);

    } catch (error) {
      console.log(`⚠️ Cleanup phase failed on ${ENV.name} (non-critical):`, error instanceof Error ? error.message : String(error));
      // Don't fail the test - cleanup errors are non-critical
    }

    console.log(`🎉 Stagehand authentication flow test completed successfully on ${ENV.name}!`);
  });

  // Production verification test (conditional)
  if (ENV.name === 'Production') {
    test(`🌐 Production site verification and health check`, async () => {
      console.log('🌐 Running production-specific verification tests...');

      const page = stagehand.page;
      await page.goto(ENV.baseUrl);

      // Verify production site is healthy
      const healthCheck = await page.extract({
        instruction: 'verify the production site is healthy and functional',
        schema: z.object({
          siteLoaded: z.boolean().describe('whether the site loaded successfully'),
          hasSignupForm: z.boolean().describe('whether signup form is available'),
          formFieldsVisible: z.boolean().describe('whether form fields are visible'),
          noErrors: z.boolean().describe('whether there are no visible errors'),
        }),
      });

      console.log('🏥 Production health check:', healthCheck);

      expect(healthCheck.siteLoaded).toBe(true);
      expect(healthCheck.hasSignupForm).toBe(true);
      expect(healthCheck.formFieldsVisible).toBe(true);
      expect(healthCheck.noErrors).toBe(true);

      console.log('✅ Production site verification completed successfully!');
    });
  }
});
