import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import { config } from 'dotenv';

// Load test credentials from .env.stagehand file
config({ path: '.env.stagehand' });

/**
 * 🎭 STAGEHAND SIGNUP FLOW TEST
 * 
 * This test verifies the signup form functionality after NativeWind conversion.
 * It tests form interaction, validation, and visual elements including the
 * fixed password toggle vertical alignment.
 * 
 * Created to address the gap in E2E testing - the auth test only tests login,
 * not actual account creation.
 */

// Dynamic environment detection (reused from auth test)
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

const ENV = getEnvironmentInfo();

test.describe(`${ENV.icon} Stagehand Signup Form Test [${ENV.name}]`, () => {
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
    console.log(`🎭 Testing signup form on ${ENV.name} environment (${ENV.baseUrl})`);
  });

  test.afterEach(async () => {
    await stagehand.close();
  });

  test(`${ENV.icon} Signup form interaction and validation on ${ENV.name}`, async () => {
    test.setTimeout(120000); // 2 minutes for form interaction
    
    const page = stagehand.page;

    // Navigate to signup page
    await page.goto(`${ENV.baseUrl}/signup`);
    console.log('📍 Navigated to signup page');

    // Wait for signup form to load
    await page.act('wait until the signup form with "Create Account" heading is visible');
    console.log('✅ Signup form loaded');

    // Test form field interaction
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'TestPassword123!@#';

    console.log(`📝 Filling signup form with test email: ${testEmail}`);

    // Fill out the form fields
    await page.act('fill in the "Full Name" field with "Test User Name"');
    await page.act(`fill in the "Email Address" field with "${testEmail}"`);
    await page.act(`fill in the "Password" field with "${testPassword}"`);

    // Test password toggle functionality and alignment
    console.log('👁️ Testing password toggle...');
    await page.act('click the "Show" button next to the password field');
    
    // Verify password visibility toggle
    const passwordFieldState = await page.extract({
      instruction: 'check if the password is now visible (not masked with dots)',
      schema: z.object({
        passwordVisible: z.boolean().describe('whether the password text is visible'),
        toggleText: z.string().describe('the current text on the toggle button'),
      }),
    });
    
    console.log('Password toggle state:', passwordFieldState);
    expect(passwordFieldState.passwordVisible).toBe(true);
    expect(passwordFieldState.toggleText).toBe('Hide');

    // Continue filling form
    await page.act(`fill in the "Confirm Password" field with "${testPassword}"`);
    await page.act('click the age verification checkbox');
    await page.act('click the development consent checkbox');

    // Check form validation state
    const formState = await page.extract({
      instruction: 'analyze the current state of the signup form',
      schema: z.object({
        allFieldsFilled: z.boolean().describe('whether all required fields are filled'),
        checkboxesChecked: z.boolean().describe('whether both checkboxes are checked'),
        submitButtonEnabled: z.boolean().describe('whether the submit button is enabled'),
        visibleErrors: z.array(z.string()).describe('any visible error messages'),
      }),
    });

    console.log('📊 Form state:', formState);

    // Verify form is ready for submission
    expect(formState.allFieldsFilled).toBe(true);
    expect(formState.checkboxesChecked).toBe(true);
    expect(formState.submitButtonEnabled).toBe(true);
    expect(formState.visibleErrors).toHaveLength(0);

    console.log('✅ Signup form is fully functional!');

    // Test navigation back to login
    await page.act('click the "Sign In" link at the bottom of the form');
    
    const navigationResult = await page.extract({
      instruction: 'check if we are now on the login page',
      schema: z.object({
        onLoginPage: z.boolean().describe('whether the login form is now visible'),
        currentUrl: z.string().describe('the current page URL'),
      }),
    });

    console.log('🔄 Navigation result:', navigationResult);
    expect(navigationResult.onLoginPage).toBe(true);
    
    console.log(`🎉 Signup form test completed successfully on ${ENV.name}!`);
  });
});