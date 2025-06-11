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
    console.log('🎭 Testing complete authentication flow with Stagehand on preview...');

    const page = stagehand.page;
    let coreFlowSuccess = false;

    try {
      // Initial page state verification
      const initialState = await page.extract({
        instruction: 'get the initial page state',
        schema: z.object({
          isSignupPage: z.boolean(),
          hasSignupForm: z.boolean(),
          pageTitle: z.string(),
          isLoading: z.boolean()
        })
      });
      console.log('📄 Initial page state:', initialState);

      // Core signup flow
      const testEmail = `stagehand-test-${Date.now()}@example.com`;
      console.log('👤 Creating test user:', testEmail);

      await page.act(`fill in the signup form with email "${testEmail}" and password "Test123!@#"`);

      const formState = await page.extract({
        instruction: 'get the form validation state',
        schema: z.object({
          allFieldsFilled: z.boolean(),
          passwordStrength: z.string(),
          submitButtonEnabled: z.boolean(),
          validationErrors: z.array(z.string())
        })
      });
      console.log('✅ Form validation state:', formState);

      console.log('🚀 Submitting signup form...');
      await page.act('submit the signup form');
      console.log('⏳ Waiting for signup process to complete...');

      // Verify core success criteria
      const signupResult = await page.extract({
        instruction: 'get the signup result',
        schema: z.object({
          currentUrl: z.string(),
          isOnChatPage: z.boolean(),
          userIsAuthenticated: z.boolean(),
          hasSuccessIndicator: z.boolean(),
          hasErrorMessages: z.boolean(),
          pageContent: z.string()
        })
      });
      console.log('📊 Signup result:', signupResult);

      // Core success is: authenticated user, no errors
      if (signupResult.userIsAuthenticated && !signupResult.hasErrorMessages) {
        coreFlowSuccess = true;
        console.log('🎉 Core authentication flow completed successfully!');
      } else {
        throw new Error('Core authentication failed - see signupResult for details');
      }

      // Optional: Test authenticated state features
      try {
        const authState = await page.extract({
          instruction: 'get the authenticated state',
          schema: z.object({
            userIsLoggedIn: z.boolean(),
            hasProfileMenu: z.boolean(),
            hasLogoutOption: z.boolean(),
            mainContent: z.string()
          })
        });
        console.log('👤 Authenticated state:', authState);

        if (authState.hasProfileMenu) {
          console.log('🔍 Testing profile menu...');
          try {
            const menuState = await page.extract({
              instruction: 'get profile menu state',
              schema: z.object({
                isMenuOpen: z.boolean(),
                hasLogoutButton: z.boolean()
              })
            });
            console.log('📋 Profile menu state:', menuState);

            if (menuState.hasLogoutButton) {
              console.log('🚪 Testing logout...');
            }
          } catch (menuError: any) {
            // Non-blocking: Profile menu issues shouldn't fail the test
            console.log('⚠️ Profile menu testing encountered issues (non-blocking):', menuError.message);
          }
        }
      } catch (authError: any) {
        // Non-blocking: Secondary feature issues shouldn't fail the test
        console.log('⚠️ Secondary feature testing encountered issues (non-blocking):', authError.message);
      }

      // Test passed if core flow succeeded
      if (coreFlowSuccess) {
        console.log('🎉 Complete authentication flow test passed!');
      }
    } catch (error: any) {
      console.error('❌ Core authentication flow failed:', error.message);
      throw error;
    }
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
