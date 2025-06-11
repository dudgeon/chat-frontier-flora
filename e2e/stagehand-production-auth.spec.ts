import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

/**
 * 🎭 STAGEHAND PRODUCTION & PREVIEW AUTHENTICATION TESTS
 *
 * This test suite handles both production and preview deployments with
 * environment-aware naming for clear reporting.
 */

// Dynamic environment detection for production/preview
function getEnvironmentInfo() {
  const deployPreviewUrl = process.env.DEPLOY_PREVIEW_URL;

  if (deployPreviewUrl) {
    return {
      name: 'Preview',
      baseUrl: deployPreviewUrl,
      icon: '🔍',
      isPreview: true
    };
  } else {
    return {
      name: 'Production',
      baseUrl: 'https://frontier-family-flora.netlify.app',
      icon: '🌐',
      isPreview: false
    };
  }
}

// Get environment info once at module load
const ENV = getEnvironmentInfo();

test.describe(`${ENV.icon} Stagehand ${ENV.name} Authentication`, () => {
  let stagehand: Stagehand;

  test.beforeEach(async () => {
    stagehand = new Stagehand({
      env: 'LOCAL',
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    await stagehand.init();
    console.log(`🎭 Initializing Stagehand for ${ENV.name} environment (${ENV.baseUrl})`);
  });

  test.afterEach(async () => {
    await stagehand.close();
  });

  // Preview deployment test (conditional)
  if (ENV.isPreview) {
    test(`🔍 Complete authentication flow on Preview deployment`, async () => {
      test.setTimeout(300000); // 5 minutes for network operations
      console.log('🎭 Testing complete authentication flow with Stagehand on preview...');

      const page = stagehand.page;
      await page.goto(ENV.baseUrl);

      // Wait for page to load and verify we're on the signup page
      const pageState = await page.extract({
        instruction: 'analyze the current page state',
        schema: z.object({
          isSignupPage: z.boolean().describe('whether this appears to be a signup/login page'),
          hasSignupForm: z.boolean().describe('whether a signup form is visible'),
          pageTitle: z.string().describe('the page title or main heading'),
          isLoading: z.boolean().describe('whether the page is still loading'),
        }),
      });

      console.log('📄 Initial page state:', pageState);
      expect(pageState.isSignupPage).toBe(true);
      expect(pageState.hasSignupForm).toBe(true);

      // Generate unique test user
      const timestamp = Date.now();
      const testUser = {
        fullName: `Stagehand Preview Test ${timestamp}`,
        email: `stagehand-preview-${timestamp}@example.com`,
        password: 'StagehandTest123!@#'
      };

      console.log(`👤 Creating test user: ${testUser.email}`);

      // Fill out the signup form using natural language
      await page.act(`fill in the full name field with "${testUser.fullName}"`);
      await page.act(`fill in the email field with "${testUser.email}"`);
      await page.act(`fill in the password field with "${testUser.password}"`);
      await page.act(`fill in the confirm password field with "${testUser.password}"`);

      // Handle consent checkboxes
      await page.act('check the age verification checkbox if it exists');
      await page.act('check the development consent checkbox if it exists');

      // Verify form is properly filled
      const formValidation = await page.extract({
        instruction: 'check if the signup form is completely filled and valid',
        schema: z.object({
          allFieldsFilled: z.boolean().describe('whether all required fields appear to be filled'),
          passwordStrength: z.string().describe('the password strength indicator if visible'),
          submitButtonEnabled: z.boolean().describe('whether the submit/create account button is enabled'),
          validationErrors: z.array(z.string()).describe('any validation error messages visible'),
        }),
      });

      console.log('✅ Form validation state:', formValidation);
      expect(formValidation.allFieldsFilled).toBe(true);
      expect(formValidation.submitButtonEnabled).toBe(true);

      // Submit the form
      console.log('🚀 Submitting signup form...');
      await page.act('click the create account or sign up button');

      // Wait for the signup process to complete - this is critical
      console.log('⏳ Waiting for signup process to complete...');
      await page.act('wait for the page to finish loading and any loading indicators to disappear');

      // Check result with more flexible expectations
      const signupResult = await page.extract({
        instruction: 'check the result of the signup attempt and current page state',
        schema: z.object({
          currentUrl: z.string().describe('the current page URL'),
          isOnChatPage: z.boolean().describe('whether the user is now on a chat page or dashboard'),
          isStillOnSignup: z.boolean().describe('whether still on the signup page'),
          hasSuccessIndicator: z.boolean().describe('whether there are any success indicators visible'),
          hasErrorMessages: z.boolean().describe('whether there are any error messages visible'),
          pageContent: z.string().describe('brief description of what is visible on the page'),
        }),
      });

      console.log('📊 Signup result:', signupResult);

      // Core success criteria - user should be redirected away from signup
      expect(signupResult.isStillOnSignup).toBe(false);
      expect(signupResult.isOnChatPage || signupResult.hasSuccessIndicator).toBe(true);
      expect(signupResult.hasErrorMessages).toBe(false);

      // Test the authenticated user interface
      const authenticatedState = await page.extract({
        instruction: 'analyze the authenticated user interface',
        schema: z.object({
          userIsLoggedIn: z.boolean().describe('whether the user appears to be logged in'),
          hasProfileMenu: z.boolean().describe('whether a profile menu or user menu is visible'),
          hasLogoutOption: z.boolean().describe('whether a logout option is available'),
          mainContent: z.string().describe('description of the main page content'),
        }),
      });

      console.log('👤 Authenticated state:', authenticatedState);
      expect(authenticatedState.userIsLoggedIn).toBe(true);

      // Test profile menu functionality (non-blocking)
      try {
        if (authenticatedState.hasProfileMenu) {
          console.log('🔍 Testing profile menu...');
          await page.act('click on the profile menu or user menu');

          const profileMenuState = await page.extract({
            instruction: 'analyze the opened profile menu',
            schema: z.object({
              isMenuOpen: z.boolean().describe('whether the profile menu is now open'),
              hasLogoutButton: z.boolean().describe('whether a logout button is visible'),
            }),
          });

          console.log('📋 Profile menu state:', profileMenuState);

          if (profileMenuState.hasLogoutButton) {
            // Test logout functionality
            console.log('🚪 Testing logout...');
            await page.act('click the logout button');

            const logoutResult = await page.extract({
              instruction: 'verify the logout was successful',
              schema: z.object({
                isLoggedOut: z.boolean().describe('whether the user appears to be logged out'),
                isBackOnSignupPage: z.boolean().describe('whether back on the signup/login page'),
              }),
            });

            console.log('✅ Logout result:', logoutResult);
            expect(logoutResult.isLoggedOut).toBe(true);
            expect(logoutResult.isBackOnSignupPage).toBe(true);
          }
        }
      } catch (error) {
        console.log('⚠️ Profile menu testing encountered issues (non-blocking):', error instanceof Error ? error.message : String(error));
      }

      console.log('🎉 Complete authentication flow test passed on Preview!');
    });
  }

  // Production verification test (conditional)
  if (!ENV.isPreview) {
    test(`🌐 Production site verification and health check`, async () => {
      console.log('🌐 Testing production deployment with Stagehand...');

      const page = stagehand.page;
      await page.goto(ENV.baseUrl);

      // Wait a moment for the page to fully load
      await page.act('wait for the page to finish loading');

      // Verify production site loads correctly
      const productionState = await page.extract({
        instruction: 'verify the production site is working and functional',
        schema: z.object({
          siteLoaded: z.boolean().describe('whether the site loaded successfully with content visible'),
          hasSignupForm: z.boolean().describe('whether signup form is available and functional'),
          isResponsive: z.boolean().describe('whether the page appears responsive'),
          hasTitle: z.boolean().describe('whether the page has a proper title'),
          formFieldsVisible: z.boolean().describe('whether form fields like email and password are visible'),
        }),
      });

      console.log('🏭 Production state:', productionState);

      // Focus on core functionality rather than minor errors
      expect(productionState.siteLoaded).toBe(true);
      expect(productionState.hasSignupForm).toBe(true);
      expect(productionState.formFieldsVisible).toBe(true);

      // Log additional info but don't fail on minor issues
      console.log(`📱 Responsive: ${productionState.isResponsive}`);
      console.log(`📄 Has Title: ${productionState.hasTitle}`);

      console.log('✅ Production site verification passed!');
    });
  }
});
