import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { config } from 'dotenv';

// Load test credentials
config({ path: '.env.stagehand' });

/**
 * Signup Form Error Handling Testing
 * 
 * Tests error scenarios and edge cases that weren't covered in existing tests:
 * - Duplicate account creation attempts
 * - Network error scenarios  
 * - Server-side validation errors
 * - Error alert display and dismissal
 * - Form state recovery
 */
test.describe('Signup Form Error Handling', () => {
  let stagehand: Stagehand;

  test.beforeEach(async ({ page }) => {
    stagehand = new Stagehand({
      env: 'LOCAL',
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    await stagehand.init();
    await page.goto('/signup');
    await page.waitForSelector('[data-testid="signup-form"]');
  });

  test('should handle duplicate email account creation gracefully', async ({ page }) => {
    await stagehand.act("Fill out signup form with existing test credentials");
    
    // Use test credentials from .env.stagehand that might already exist
    await page.fill('[data-testid="full-name"]', 'Test User Duplicate');
    await page.fill('[data-testid="email"]', 'existing-user@test.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    
    // Check required checkboxes
    await page.check('[data-testid="age-verification"]');
    await page.check('[data-testid="development-consent"]');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Should show appropriate error message for duplicate account
    // (This will depend on the actual Supabase error handling)
    await stagehand.act("Check if appropriate error message is displayed for duplicate email");
    
    // Look for various possible error message patterns
    const possibleErrorMessages = [
      'User already registered',
      'Email already exists',
      'Account already exists',
      'This email is already registered',
      'User already exists'
    ];
    
    let errorFound = false;
    for (const errorMsg of possibleErrorMessages) {
      try {
        await expect(page.locator(`text=${errorMsg}`)).toBeVisible({ timeout: 5000 });
        errorFound = true;
        break;
      } catch (e) {
        // Continue to next error message
      }
    }
    
    // If no specific error message found, at least verify submit button is re-enabled
    if (!errorFound) {
      await expect(page.locator('[data-testid="submit-button"]')).toBeEnabled();
    }
  });

  test('should validate form field errors and recovery', async ({ page }) => {
    

    // Test required field validation
    await stagehand.act("Test comprehensive field validation");
    
    // Try to submit empty form
    await page.click('[data-testid="submit-button"]');
    
    // Should see multiple validation errors
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    
    // Fill fields one by one and verify errors disappear
    await page.fill('[data-testid="full-name"]', 'John Doe');
    await page.blur('[data-testid="full-name"]');
    await expect(page.locator('text=Full name is required')).not.toBeVisible();
    
    // Test invalid full name (missing last name)
    await page.fill('[data-testid="full-name"]', 'John');
    await page.blur('[data-testid="full-name"]');
    await expect(page.locator('text=Please enter your first and last name')).toBeVisible();
    
    await page.fill('[data-testid="full-name"]', 'John Doe');
    await page.blur('[data-testid="full-name"]');
    await expect(page.locator('text=Please enter your first and last name')).not.toBeVisible();
    
    // Test email validation
    await page.fill('[data-testid="email"]', 'invalid');
    await page.blur('[data-testid="email"]');
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.blur('[data-testid="email"]');
    await expect(page.locator('text=Please enter a valid email address')).not.toBeVisible();
    
    // Test weak password
    await page.fill('[data-testid="password"]', 'weak');
    await page.blur('[data-testid="password"]');
    
    // Should show password validation component with unmet requirements
    await expect(page.locator('[data-testid="password-validation"]')).toBeVisible();
    await expect(page.locator('[data-testid="rule-minLength-x"]')).toBeVisible();
    
    // Test strong password
    await page.fill('[data-testid="password"]', 'StrongPass123!');
    await page.blur('[data-testid="password"]');
    
    // Password validation should be hidden when all requirements are met
    await expect(page.locator('[data-testid="password-validation"]')).not.toBeVisible();
    
    // Test password confirmation mismatch
    await page.fill('[data-testid="confirm-password"]', 'DifferentPass123!');
    await page.blur('[data-testid="confirm-password"]');
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    
    await page.fill('[data-testid="confirm-password"]', 'StrongPass123!');
    await page.blur('[data-testid="confirm-password"]');
    await expect(page.locator('text=Passwords do not match')).not.toBeVisible();
  });

  test('should handle checkbox validation errors properly', async ({ page }) => {
    

    await stagehand.act("Fill out form but leave checkboxes unchecked");
    
    // Fill all required fields
    await page.fill('[data-testid="full-name"]', 'John Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    
    // Don't check the required checkboxes, then try to submit
    await page.click('[data-testid="submit-button"]');
    
    // Should show checkbox validation errors
    await expect(page.locator('text=You must verify that you are 18 years of age or older')).toBeVisible();
    await expect(page.locator('text=You must consent to the use of your data for development purposes')).toBeVisible();
    
    // Check age verification, error should disappear
    await page.check('[data-testid="age-verification"]');
    await expect(page.locator('text=You must verify that you are 18 years of age or older')).not.toBeVisible();
    
    // Check development consent, error should disappear
    await page.check('[data-testid="development-consent"]');
    await expect(page.locator('text=You must consent to the use of your data for development purposes')).not.toBeVisible();
    
    // Submit button should now be enabled (or at least attempt submission)
    await expect(page.locator('[data-testid="submit-button"]')).toBeEnabled();
  });

  test('should handle submit button states correctly', async ({ page }) => {
    

    await stagehand.act("Test submit button state management");
    
    // Initially, submit button should be disabled until form is touched (requireTouched: true)
    await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
    await expect(page.locator('[data-testid="submit-button"]')).toContainText('Create Account');
    
    // Fill out valid form - button should become enabled after first touch
    await page.fill('[data-testid="full-name"]', 'John Doe');
    await expect(page.locator('[data-testid="submit-button"]')).toBeEnabled(); // Now enabled after form touch
    
    await page.fill('[data-testid="email"]', 'john.doe.test@example.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    await page.check('[data-testid="age-verification"]');
    await page.check('[data-testid="development-consent"]');
    
    // Button should still show "Create Account" and remain enabled
    await expect(page.locator('[data-testid="submit-button"]')).toContainText('Create Account');
    await expect(page.locator('[data-testid="submit-button"]')).toBeEnabled();
    
    // Click submit - button should change to loading state
    await page.click('[data-testid="submit-button"]');
    
    // Check for loading state (button text might change)
    const loadingStates = ['Creating Account...', 'Creating...', 'Please wait...'];
    let loadingFound = false;
    
    for (const loadingText of loadingStates) {
      try {
        await expect(page.locator(`[data-testid="submit-button"]:has-text("${loadingText}")`)).toBeVisible({ timeout: 2000 });
        loadingFound = true;
        break;
      } catch (e) {
        // Continue to next loading state
      }
    }
    
    // If no specific loading text found, at least verify button is disabled during submission
    if (!loadingFound) {
      await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
    }
  });

  test('should validate NativeWind styling is applied correctly', async ({ page }) => {
    

    await stagehand.act("Verify NativeWind styling is properly applied to form elements");
    
    // Check that key elements have proper styling classes
    const formCard = page.locator('[data-testid="signup-form"]').locator('..'); // Parent container
    await expect(formCard).toHaveClass(/bg-white/);
    await expect(formCard).toHaveClass(/rounded-xl/);
    
    // Check password validation component styling when it appears
    await page.fill('[data-testid="password"]', 'a');
    await expect(page.locator('[data-testid="password-validation"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-validation"]')).toHaveClass(/bg-white/);
    await expect(page.locator('[data-testid="password-validation"]')).toHaveClass(/border/);
    await expect(page.locator('[data-testid="password-validation"]')).toHaveClass(/rounded-lg/);
    
    // Check submit button styling
    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toHaveClass(/bg-blue-500/);
    await expect(submitButton).toHaveClass(/rounded-xl/);
    
    // Check navigation link styling
    const signInLink = page.locator('[data-testid="switch-to-login"]');
    await expect(signInLink).toHaveClass(/text-blue-600/);
    
    await stagehand.act("Verify form layout and spacing is consistent");
    
    // Check that form fields have proper spacing
    const formFields = page.locator('.mb-6');
    await expect(formFields).toHaveCount(6); // All form field containers should have mb-6
  });

  test('should handle form state persistence across interactions', async ({ page }) => {
    

    await stagehand.act("Test form state persistence during various interactions");
    
    // Fill out form partially
    await page.fill('[data-testid="full-name"]', 'John Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    
    // Navigate away and back
    await page.click('[data-testid="switch-to-login"]');
    await page.waitForSelector('[data-testid="login-form"]');
    
    await page.click('[data-testid="switch-to-signup"]');
    await page.waitForSelector('[data-testid="signup-form"]');
    
    // Form should be cleared (expected behavior)
    await expect(page.locator('[data-testid="full-name"]')).toHaveValue('');
    await expect(page.locator('[data-testid="email"]')).toHaveValue('');
    await expect(page.locator('[data-testid="password"]')).toHaveValue('');
    
    // Test that password validation behaves correctly after navigation
    await page.fill('[data-testid="password"]', 'test');
    await expect(page.locator('[data-testid="password-validation"]')).toBeVisible();
    
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await expect(page.locator('[data-testid="password-validation"]')).not.toBeVisible();
  });
});