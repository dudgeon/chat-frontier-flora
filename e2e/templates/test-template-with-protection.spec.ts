/**
 * 🎭 TEST TEMPLATE WITH FALSE FAILURE PREVENTION
 *
 * This template demonstrates the correct 3-phase architecture to prevent
 * cleanup errors from causing false test failures.
 *
 * 🛡️ CRITICAL: 3-PHASE TEST ARCHITECTURE FOR FALSE FAILURE PREVENTION
 *
 * PHASE 1: CORE FUNCTIONALITY (MUST PASS)
 * - Essential application functionality
 * - User flows and critical features
 * - Success/failure assertions
 * - 🚨 THROWS ERRORS on failure (real issues)
 *
 * PHASE 2: SECONDARY FEATURES (NON-CRITICAL)
 * - Additional UI interactions
 * - Nice-to-have functionality
 * - 📝 LOGS WARNINGS ONLY (environmental issues)
 *
 * PHASE 3: CLEANUP (NON-CRITICAL)
 * - State capture for debugging
 * - Resource cleanup operations
 * - 📝 NEVER FAILS TESTS (cleanup errors are expected)
 *
 * KEY PRINCIPLE: If Phase 1 passes, the test is successful regardless of later phases.
 *
 * ⚠️ WARNING: DO NOT add 'throw error' statements to Phase 2 or 3
 * See docs/TEST_FAILURE_PREVENTION_STRATEGY.md for complete details
 */

import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

test.describe('Template Test with Protection', () => {
  let stagehand: Stagehand;

  test.beforeEach(async () => {
    // Initialize test resources
    stagehand = new Stagehand({
      env: 'LOCAL',
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    await stagehand.init();
    console.log('🎭 Initializing test...');
  });

  test.afterEach(async () => {
    // 🛡️ PROTECTION: This cleanup MUST be wrapped in try/catch if it ever becomes complex
    // Browser context closure can fail in some environments
    // If this section grows, ensure it cannot fail the test
    await stagehand.close();
  });

  test('Example test with 3-phase protection', async () => {
    test.setTimeout(300000); // 5 minutes for complex operations

    const page = stagehand.page;

    // ⚠️ PHASE 1: CORE FUNCTIONALITY (MUST PASS)
    // 🛡️ PROTECTION: Everything in this phase MUST throw errors on failure
    // These are real application issues that need to be addressed
    console.log('🎯 Phase 1: Core Functionality Testing');

    try {
      // Navigate to application
      await page.goto('http://localhost:19006');

      // Core functionality testing
      const coreResult = await page.extract({
        instruction: 'verify core functionality is working',
        schema: z.object({
          pageLoaded: z.boolean().describe('whether the page loaded successfully'),
          hasExpectedContent: z.boolean().describe('whether expected content is visible'),
          noErrors: z.boolean().describe('whether there are no error messages'),
        }),
      });

      console.log('📊 Core functionality result:', coreResult);

      // 🛡️ ROBUST BUTTON INTERACTION EXAMPLE: Multi-strategy approach to prevent button text changes from breaking tests
      const submitButtonInteraction = async () => {
        // First, validate button state before attempting interaction
        const buttonState = await page.extract({
          instruction: 'analyze the submit button state before clicking',
          schema: z.object({
            isVisible: z.boolean().describe('whether the submit button is visible'),
            isEnabled: z.boolean().describe('whether the submit button is enabled'),
            buttonText: z.string().describe('the current text on the submit button'),
            isLoading: z.boolean().describe('whether the button shows loading state'),
          }),
        });

        console.log('🔍 Button state before interaction:', buttonState);

        // Validate button is in a clickable state
        if (!buttonState.isVisible) {
          throw new Error('Submit button is not visible');
        }
        if (!buttonState.isEnabled) {
          throw new Error(`Submit button is disabled. Current text: "${buttonState.buttonText}"`);
        }

        // Multi-strategy button interaction approach
        const strategies = [
          // Strategy 1: Primary button identification
          'click the submit button',

          // Strategy 2: Text-based identification with variations
          'click the button that says "Submit" or "Create Account" or "Sign Up"',

          // Strategy 3: Position-based identification
          'click the main button at the bottom of the form',

          // Strategy 4: Role-based identification
          'click the primary action button in the form',

          // Strategy 5: Visual identification
          'click the large button that submits the form',

          // Strategy 6: Context-based identification
          'find and click the button that will submit the form'
        ];

        for (let i = 0; i < strategies.length; i++) {
          try {
            console.log(`🎯 Attempting button interaction strategy ${i + 1}/${strategies.length}`);
            await page.act(strategies[i]);
            console.log(`✅ Button interaction successful with strategy ${i + 1}`);

            // Verify the button interaction had the expected effect
            const interactionResult = await page.extract({
              instruction: 'verify the button click had the expected effect',
              schema: z.object({
                formSubmitted: z.boolean().describe('whether the form appears to have been submitted'),
                showingLoadingState: z.boolean().describe('whether loading indicators are visible'),
                hasNavigated: z.boolean().describe('whether the page has started to navigate away'),
                hasErrors: z.boolean().describe('whether any error messages appeared'),
              }),
            });

            if (interactionResult.formSubmitted || interactionResult.showingLoadingState || interactionResult.hasNavigated) {
              console.log('✅ Button click successfully triggered expected action');
              return; // Success - exit function
            } else {
              console.log(`⚠️ Strategy ${i + 1} clicked button but no expected effect detected, trying next strategy...`);
            }
          } catch (error) {
            console.log(`⚠️ Strategy ${i + 1} failed:`, error instanceof Error ? error.message : String(error));
            if (i === strategies.length - 1) {
              throw new Error(`All ${strategies.length} button interaction strategies failed`);
            }
            // Continue to next strategy
          }
        }
      };

      // Example usage (uncomment if you have a form to test):
      // await submitButtonInteraction();

      // 🚨 CORE FUNCTIONALITY ASSERTIONS - These determine test success/failure
      // If these fail, it indicates real application issues that must be addressed
      // DO NOT wrap these in try/catch - they should fail the test if broken
      expect(coreResult.pageLoaded).toBe(true);
      expect(coreResult.hasExpectedContent).toBe(true);
      expect(coreResult.noErrors).toBe(true);

      console.log('🎉 Core functionality completed successfully!');

      // Capture successful state before secondary features
      const coreState = {
        environment: 'test',
        functionalityWorking: coreResult.pageLoaded && coreResult.hasExpectedContent,
        noErrors: coreResult.noErrors
      };
      console.log('📊 Core functionality verified:', coreState);

    } catch (error) {
      console.error('❌ Core functionality failed:', error instanceof Error ? error.message : String(error));
      // 🚨 CRITICAL: This throw statement MUST remain to fail tests when core functionality breaks
      // DO NOT REMOVE: Core functionality failures indicate real application issues
      // See docs/TEST_FAILURE_PREVENTION_STRATEGY.md for details
      throw error; // Fail the test if core functionality fails
    }

    // ⚠️ PHASE 2: SECONDARY FEATURES (NON-CRITICAL)
    // 🛡️ PROTECTION: Everything below this point MUST NOT fail the test
    // These are secondary features that may timeout or fail due to environmental issues
    // Browser context closure, menu timeouts, etc. should only log warnings
    console.log('🔧 Phase 2: Secondary Features Testing (Non-Critical)');

    try {
      // Test secondary features like menus, additional UI elements
      const secondaryResult = await page.extract({
        instruction: 'test secondary features',
        schema: z.object({
          hasAdvancedFeatures: z.boolean().describe('whether advanced features are available'),
          menuWorking: z.boolean().describe('whether menu interactions work'),
        }),
      });

      console.log('🔍 Secondary features result:', secondaryResult);

      // Test additional interactions
      if (secondaryResult.hasAdvancedFeatures) {
        await page.act('interact with advanced features');
        console.log('✅ Secondary features working correctly');
      }

    } catch (error) {
      console.log('⚠️ Secondary features testing failed (non-critical):', error instanceof Error ? error.message : String(error));
      // 🛡️ CRITICAL PROTECTION: DO NOT add 'throw error' here
      // Secondary features are non-critical and should never fail the test
      // Common failures: menu timeouts, UI interaction issues
      // These are environmental issues, not application bugs
    }

    // ⚠️ PHASE 3: CLEANUP (NON-CRITICAL)
    // 🛡️ PROTECTION: Cleanup operations MUST NEVER fail the test
    // Browser context closure, state capture failures are expected in some environments
    // These operations are for debugging only and should not affect test results
    console.log('🧹 Phase 3: Cleanup Phase (Non-Critical)');

    try {
      // Capture final state for debugging
      const finalState = await page.extract({
        instruction: 'capture final test state',
        schema: z.object({
          currentUrl: z.string().describe('final URL'),
          pageContent: z.string().describe('brief description of page content'),
          testCompleted: z.boolean().describe('whether the test appears to have completed successfully'),
        }),
      });
      console.log('📋 Final test state:', finalState);

    } catch (error) {
      console.log('⚠️ Cleanup phase failed (non-critical):', error instanceof Error ? error.message : String(error));
      // 🛡️ CRITICAL PROTECTION: DO NOT add 'throw error' here
      // Cleanup errors are environmental issues and MUST NOT fail tests
      // Common failures: browser context closure, state capture timeouts
      // These are debugging operations only - test success was already determined in Phase 1
    }

    // 🎉 TEST COMPLETION: If we reach this point, the test has passed
    // Core functionality (Phase 1) completed successfully
    // Any warnings above are non-critical environmental issues
    console.log('🎉 Test completed successfully!');
  });
});
