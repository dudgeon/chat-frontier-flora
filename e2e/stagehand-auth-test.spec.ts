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

      // If we're on the chat page and authenticated, the core flow succeeded
      if (finalState.currentUrl.includes('/chat') && finalState.isAuthenticated) {
        console.log('✅ Core authentication flow verified successful');
      }
    } catch (error) {
      // Don't fail the test for cleanup state capture errors
      console.log('ℹ️ Could not capture final state:', error);
    }

    await stagehand.close();
  });

  test('should complete signup flow with natural language actions', async () => {
    test.setTimeout(120000);
    console.log('🎭 Testing Stagehand-powered authentication flow...');

    const page = stagehand.page;
    let finalState = null;

    try {
      await page.goto('/');
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

      // Capture form state before submission
      const formState = await page.extract({
        instruction: 'get the form state',
        schema: z.object({
          isFormValid: z.boolean(),
          submitButtonEnabled: z.boolean(),
          passwordStrength: z.string().nullable()
        })
      });
      console.log('📊 Form state:', formState);

      // Submit the form
      await page.act('click the submit button to create the account');
      console.log('⏳ Waiting for signup process to complete...');
      await page.act('wait for the page to finish loading and any loading indicators to disappear');

      // CRITICAL: Capture final state before any cleanup
      const signupResult = await page.extract({
        instruction: 'get the signup result',
        schema: z.object({
          isOnChatPage: z.boolean(),
          hasComingSoonText: z.boolean(),
          currentUrl: z.string(),
          userIsAuthenticated: z.boolean(),
          hasProfileMenu: z.boolean(),
          isStillOnSignup: z.boolean(),
          hasErrorMessages: z.boolean()
        })
      });
      finalState = signupResult;
      console.log('✅ Signup result:', finalState);

      // Only proceed with profile menu if core auth succeeded
      if (finalState && finalState.userIsAuthenticated && finalState.hasProfileMenu) {
        console.log('📋 Profile menu detected:', finalState.hasProfileMenu);

        try {
          console.log('🔍 Attempting to test profile menu functionality...');
          const menuState = await page.extract({
            instruction: 'get profile menu state',
            schema: z.object({
              isMenuOpen: z.boolean(),
              userEmail: z.string(),
              hasLogoutButton: z.boolean()
            })
          }) as { isMenuOpen: boolean; userEmail: string; hasLogoutButton: boolean };
          console.log('👤 Profile menu state:', menuState);
        } catch (error: unknown) {
          // Don't fail test for menu issues if core auth worked
          const menuError = error as Error;
          if (menuError.message.includes('context has been closed')) {
            console.log('ℹ️ Profile menu testing skipped during cleanup');
          } else {
            console.log('⚠️ Non-critical profile menu error:', menuError.message);
          }
        }
      }

      // Capture final page state
      try {
        const pageState = await page.extract({
          instruction: 'get the current page state',
          schema: z.object({
            currentUrl: z.string(),
            isAuthenticated: z.boolean(),
            visibleContent: z.string()
          })
        }) as { currentUrl: string; isAuthenticated: boolean; visibleContent: string };
        console.log('📸 Final page state before cleanup:', pageState);
      } catch (error: unknown) {
        // Don't fail if we can't get final state during cleanup
        const stateError = error as Error;
        if (stateError.message.includes('context has been closed')) {
          console.log('ℹ️ Final state capture skipped during cleanup');
        } else {
          console.log('⚠️ Non-critical state capture error:', stateError.message);
        }
      }

      // Determine test success based on core functionality
      if (finalState && finalState.userIsAuthenticated && !finalState.hasErrorMessages) {
        console.log('🎉 Core authentication flow completed successfully!');
        console.log('🎉 Stagehand authentication flow test completed successfully!');
      } else {
        throw new Error('Core authentication failed - see finalState for details');
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
});
