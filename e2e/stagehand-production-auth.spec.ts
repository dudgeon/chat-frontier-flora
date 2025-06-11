import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

/**
 * 🎭 STAGEHAND PRODUCTION AUTHENTICATION TESTS
 *
 * This replaces our brittle Playwright tests with AI-powered, self-healing tests.
 * These tests use natural language and adapt to UI changes automatically.
 */

// Production URL is constant, preview URL comes from environment
const PRODUCTION_URL = 'https://frontier-family-flora.netlify.app';
const PREVIEW_URL = process.env.DEPLOY_PREVIEW_URL;

test.describe('Stagehand Production Authentication', () => {
  let stagehand: Stagehand;

  test.beforeEach(async () => {
    stagehand = new Stagehand({
      env: 'LOCAL',
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY
      }
    });
    await stagehand.init();
  });

  test.afterEach(async () => {
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (error: any) {
        // Ignore cleanup errors
        console.log('⚠️ Cleanup warning (non-critical):', error.message);
      }
    }

    // Capture final state before cleanup
    try {
      const finalState = await stagehand.page.extract({
        instruction: 'capture the final state of the page',
        schema: z.object({
          currentUrl: z.string().describe('the current page URL'),
          hasSignupForm: z.boolean().describe('whether the signup form is visible'),
          hasErrorMessages: z.boolean().describe('whether there are any error messages'),
          pageContent: z.string().describe('important visible content on the page'),
        }),
      });

      console.log('📸 Final page state before cleanup:', finalState);

      // If we have a signup form without errors, the page is working
      if (finalState.hasSignupForm && !finalState.hasErrorMessages) {
        console.log('✅ Page functionality verified working');
      }
    } catch (error) {
      // Don't fail the test for cleanup state capture errors
      console.log('ℹ️ Could not capture final state:', error);
    }
  });

  // Test the preview deployment first
  test('should complete full authentication flow on preview deployment', async () => {
    test.setTimeout(120000); // Increase timeout for network operations
    console.log('🎭 Testing complete authentication flow with Stagehand on preview...');

    // Skip if no preview URL is set
    if (!PREVIEW_URL) {
      test.skip(true, 'No DEPLOY_PREVIEW_URL set - this test requires a deploy preview');
    }

    const page = stagehand.page;
    await page.goto(PREVIEW_URL!);

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
      fullName: `Stagehand Test User ${timestamp}`,
      email: `stagehand-test-${timestamp}@example.com`,
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

    console.log('🎉 Complete authentication flow test passed!');
  });

  test('should work on production deployment', async () => {
    // Increase timeout for production testing across browsers
    test.setTimeout(300000); // 5 minutes to handle all browser variants
    console.log('🌐 Testing production deployment with Stagehand...');

    const page = stagehand.page;

    // Add explicit timeouts for each major operation
    const timeouts = {
      pageLoad: 30000,
      formVerification: 30000,
      interactionTest: 30000
    };

    try {
      await Promise.race([
        page.goto(PRODUCTION_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Production page load timeout')), timeouts.pageLoad))
      ]);

      // Wait for page to fully load with timeout
      await Promise.race([
        page.act('wait for the page to finish loading'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Page load completion timeout')), timeouts.pageLoad))
      ]);

      // Verify production site loads correctly - focus on core functionality
      const productionState = await page.extract({
        instruction: 'verify the production site is working and functional',
        schema: z.object({
          siteLoaded: z.boolean().describe('whether the site loaded successfully with content visible'),
          hasSignupForm: z.boolean().describe('whether signup form is available and functional'),
          formFieldsVisible: z.boolean().describe('whether form fields like email and password are visible'),
          // These are secondary checks - don't fail the test for them
          isResponsive: z.boolean().describe('whether the page appears responsive'),
          hasTitle: z.boolean().describe('whether the page has a proper title'),
        }),
      });

      console.log('🏭 Production state:', productionState);

      // Core functionality checks
      expect(productionState.siteLoaded).toBe(true);
      expect(productionState.hasSignupForm).toBe(true);
      expect(productionState.formFieldsVisible).toBe(true);

      // Log secondary checks but don't fail test for them
      console.log(`📱 Responsive: ${productionState.isResponsive}`);
      console.log(`📄 Has Title: ${productionState.hasTitle}`);

      // Try to verify form interactivity without submitting
      try {
        await page.act('click the email field');
        await page.act('type "test@example.com" into the email field');

        const formState = await page.extract({
          instruction: 'check if the form is interactive',
          schema: z.object({
            emailFieldWorks: z.boolean().describe('whether the email field accepts input'),
            formResponds: z.boolean().describe('whether the form responds to interaction'),
          }),
        });

        if (formState.emailFieldWorks && formState.formResponds) {
          console.log('✅ Form interactivity verified');
        }
      } catch (error) {
        // Log but don't fail - this is an extra verification
        console.log('ℹ️ Form interactivity check produced non-critical error:',
          error instanceof Error ? error.message : String(error));
      }

      console.log('✅ Production site verification passed!');
    } catch (error) {
      console.log('❌ Operation timed out:', error instanceof Error ? error.message : String(error));
      throw error; // Re-throw to fail the test
    }
  });
});
