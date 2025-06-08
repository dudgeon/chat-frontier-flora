import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

/**
 * 🎭 STAGEHAND AUTHENTICATION PROOF-OF-CONCEPT
 *
 * This test demonstrates how Stagehand would solve our authentication testing issues:
 * - No more brittle selectors that break when UI changes
 * - Natural language actions that adapt to page changes
 * - Structured data extraction with validation
 * - Self-healing tests that work even when elements move
 */

// Use Playwright's baseURL which handles environment detection automatically

test.describe('Stagehand Authentication Flow', () => {
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
  });

  test.afterEach(async () => {
    await stagehand.close();
  });

  test('should complete signup flow with natural language actions', async () => {
    console.log('🎭 Testing Stagehand-powered authentication flow...');

    const page = stagehand.page;

    // Navigate to the base URL (automatically determined by Playwright config)
    await page.goto('/');

    // Instead of brittle selectors, use natural language!
    await page.act('wait for the signup form to be visible');

    // Generate test user data
    const testEmail = `test-${Date.now()}@stagehand-demo.com`;
    const testPassword = 'StagehandTest123!';
    const testName = 'Stagehand Tester';

    console.log(`📝 Creating account for: ${testEmail}`);

    // Fill out the form using natural language
    await page.act(`fill in the full name field with "${testName}"`);
    await page.act(`fill in the email field with "${testEmail}"`);
    await page.act(`fill in the password field with "${testPassword}"`);
    await page.act(`fill in the confirm password field with "${testPassword}"`);

    // Handle checkboxes with natural language
    await page.act('check the age verification checkbox');
    await page.act('check the development consent checkbox');

    // Extract form state to verify everything is filled correctly
    const formState = await page.extract({
      instruction: 'extract the current state of the signup form',
      schema: z.object({
        isFormValid: z.boolean().describe('whether the form appears to be completely filled and valid'),
        submitButtonEnabled: z.boolean().describe('whether the submit button is enabled'),
        passwordStrength: z.string().describe('the password strength indicator text if visible'),
      }),
    });

    console.log('📊 Form state:', formState);

    // Verify form is ready for submission
    expect(formState.isFormValid).toBe(true);
    expect(formState.submitButtonEnabled).toBe(true);

    // Submit the form
    await page.act('click the create account button');

    // Wait for and verify successful signup with natural language
    const signupResult = await page.extract({
      instruction: 'check if the user was successfully signed up and redirected',
      schema: z.object({
        isOnChatPage: z.boolean().describe('whether the user is now on the chat page'),
        currentUrl: z.string().describe('the current page URL'),
        userIsAuthenticated: z.boolean().describe('whether the user appears to be logged in'),
        loadingComplete: z.boolean().describe('whether any loading indicators have finished'),
      }),
    });

    console.log('✅ Signup result:', signupResult);

    // Verify successful authentication
    expect(signupResult.isOnChatPage).toBe(true);
    expect(signupResult.currentUrl).toContain('/chat');
    expect(signupResult.userIsAuthenticated).toBe(true);
    expect(signupResult.loadingComplete).toBe(true);

    // Test the profile menu functionality
    await page.act('click the profile menu button in the top right');

    const profileMenuState = await page.extract({
      instruction: 'extract information about the opened profile menu',
      schema: z.object({
        isMenuOpen: z.boolean().describe('whether the profile menu is open'),
        userEmail: z.string().describe('the user email displayed in the menu'),
        hasLogoutButton: z.boolean().describe('whether a logout button is visible'),
      }),
    });

    console.log('👤 Profile menu state:', profileMenuState);

    // Verify profile menu works
    expect(profileMenuState.isMenuOpen).toBe(true);
    expect(profileMenuState.userEmail).toBe(testEmail);
    expect(profileMenuState.hasLogoutButton).toBe(true);

    // Test logout functionality
    await page.act('click the logout button');

    const logoutResult = await page.extract({
      instruction: 'verify the user was logged out successfully',
      schema: z.object({
        isBackToSignup: z.boolean().describe('whether the user is back on the signup page'),
        isLoggedOut: z.boolean().describe('whether the user appears to be logged out'),
        signupFormVisible: z.boolean().describe('whether the signup form is visible again'),
      }),
    });

    console.log('🚪 Logout result:', logoutResult);

    // Verify successful logout
    expect(logoutResult.isBackToSignup).toBe(true);
    expect(logoutResult.isLoggedOut).toBe(true);
    expect(logoutResult.signupFormVisible).toBe(true);

    console.log('🎉 Stagehand authentication flow test completed successfully!');
  });

  test('should handle form validation with natural language', async () => {
    console.log('🔍 Testing form validation with Stagehand...');

    const page = stagehand.page;
    await page.goto('/');

    // Test password validation in real-time
    await page.act('fill in the password field with "weak"');

    const passwordValidation = await page.extract({
      instruction: 'extract password validation feedback',
      schema: z.object({
        passwordStrength: z.string().describe('the password strength level shown'),
        validationMessages: z.array(z.string()).describe('any validation messages displayed'),
        isPasswordAcceptable: z.boolean().describe('whether the password meets requirements'),
      }),
    });

    console.log('🔐 Password validation:', passwordValidation);

    // Verify weak password is caught
    expect(passwordValidation.isPasswordAcceptable).toBe(false);

    // Test with strong password
    await page.act('clear the password field and enter "StrongPassword123!"');

    const strongPasswordValidation = await page.extract({
      instruction: 'extract updated password validation feedback',
      schema: z.object({
        passwordStrength: z.string().describe('the password strength level shown'),
        isPasswordAcceptable: z.boolean().describe('whether the password meets requirements'),
      }),
    });

    console.log('💪 Strong password validation:', strongPasswordValidation);

    // Verify strong password is accepted
    expect(strongPasswordValidation.isPasswordAcceptable).toBe(true);
  });
});
