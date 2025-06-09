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
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    await stagehand.init();
  });

  test.afterEach(async () => {
    await stagehand.close();
  });

  // Test the preview deployment first
  test('should complete full authentication flow on preview deployment', async () => {
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
    expect(pageState.isLoading).toBe(false);

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
    expect(formValidation.validationErrors).toHaveLength(0);

    // Submit the form
    console.log('🚀 Submitting signup form...');
    await page.act('click the create account or sign up button');

    // Wait for signup to complete and check result
    const signupResult = await page.extract({
      instruction: 'check the result of the signup attempt',
      schema: z.object({
        wasSuccessful: z.boolean().describe('whether the signup appears to have been successful'),
        currentUrl: z.string().describe('the current page URL'),
        isOnChatPage: z.boolean().describe('whether the user is now on a chat page'),
        isOnDashboard: z.boolean().describe('whether the user is on a dashboard page'),
        isStillOnSignup: z.boolean().describe('whether still on the signup page'),
        loadingComplete: z.boolean().describe('whether any loading indicators have finished'),
        errorMessages: z.array(z.string()).describe('any error messages displayed'),
      }),
    });

    console.log('📊 Signup result:', signupResult);

    // Verify successful signup and redirect
    expect(signupResult.wasSuccessful).toBe(true);
    expect(signupResult.isOnChatPage || signupResult.isOnDashboard).toBe(true);
    expect(signupResult.isStillOnSignup).toBe(false);
    expect(signupResult.loadingComplete).toBe(true);
    expect(signupResult.errorMessages).toHaveLength(0);

    // Test the authenticated user interface
    const authenticatedState = await page.extract({
      instruction: 'analyze the authenticated user interface',
      schema: z.object({
        userIsLoggedIn: z.boolean().describe('whether the user appears to be logged in'),
        userEmail: z.string().describe('the user email displayed if visible'),
        hasProfileMenu: z.boolean().describe('whether a profile menu or user menu is visible'),
        hasLogoutOption: z.boolean().describe('whether a logout option is available'),
        mainContent: z.string().describe('description of the main page content'),
      }),
    });

    console.log('👤 Authenticated state:', authenticatedState);
    expect(authenticatedState.userIsLoggedIn).toBe(true);
    expect(authenticatedState.hasProfileMenu || authenticatedState.hasLogoutOption).toBe(true);

    // Test profile menu functionality
    if (authenticatedState.hasProfileMenu) {
      console.log('🔍 Testing profile menu...');
      await page.act('click on the profile menu or user menu');

      const profileMenuState = await page.extract({
        instruction: 'analyze the opened profile menu',
        schema: z.object({
          isMenuOpen: z.boolean().describe('whether the profile menu is now open'),
          displayedEmail: z.string().describe('the email address shown in the menu'),
          hasLogoutButton: z.boolean().describe('whether a logout button is visible'),
          menuOptions: z.array(z.string()).describe('list of menu options available'),
        }),
      });

      console.log('📋 Profile menu state:', profileMenuState);
      expect(profileMenuState.isMenuOpen).toBe(true);
      expect(profileMenuState.hasLogoutButton).toBe(true);

      // Test logout functionality
      console.log('🚪 Testing logout...');
      await page.act('click the logout button');

      const logoutResult = await page.extract({
        instruction: 'verify the logout was successful',
        schema: z.object({
          isLoggedOut: z.boolean().describe('whether the user appears to be logged out'),
          isBackOnSignupPage: z.boolean().describe('whether back on the signup/login page'),
          signupFormVisible: z.boolean().describe('whether the signup form is visible again'),
          currentUrl: z.string().describe('the current page URL'),
        }),
      });

      console.log('✅ Logout result:', logoutResult);
      expect(logoutResult.isLoggedOut).toBe(true);
      expect(logoutResult.isBackOnSignupPage).toBe(true);
      expect(logoutResult.signupFormVisible).toBe(true);
    }

    console.log('🎉 Complete authentication flow test passed!');
  });



  test('should work on production deployment', async () => {
    console.log('🌐 Testing production deployment with Stagehand...');

    const page = stagehand.page;
    await page.goto(PRODUCTION_URL);

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
});
