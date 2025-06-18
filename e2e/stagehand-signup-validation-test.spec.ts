import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { config } from 'dotenv';

// Load test credentials
config({ path: '.env.stagehand' });

/**
 * Comprehensive Signup Form Validation Testing
 * 
 * Tests all the critical validation scenarios that were missing from existing E2E tests:
 * - Password validation component with 5 specific rules
 * - Form field validation errors
 * - Visual feedback for validation states
 * - Error handling scenarios
 * - Enhanced UX features (keyboard navigation)
 */
test.describe('Signup Form Validation', () => {
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

  test('should display and validate password requirements in real-time', async ({ page }) => {

    await stagehand.act("Start typing in the password field to trigger password validation");
    await page.fill('[data-testid="password"]', 'a');

    // Verify password validation component appears
    await expect(page.locator('[data-testid="password-validation"]')).toBeVisible();
    await expect(page.locator('text=Your password must contain:')).toBeVisible();

    // Test each password requirement rule individually
    
    // 1. Test minimum length requirement (8 characters)
    await stagehand.act("Check that the minimum length rule shows as incomplete");
    await expect(page.locator('[data-testid="rule-minLength"]')).toContainText('At least 8 characters');
    await expect(page.locator('[data-testid="rule-minLength-x"]')).toBeVisible(); // Should show ✕
    
    await page.fill('[data-testid="password"]', 'abcdefgh'); // 8 characters
    await expect(page.locator('[data-testid="rule-minLength-check"]')).toBeVisible(); // Should show ✓

    // 2. Test uppercase letter requirement
    await stagehand.act("Check uppercase letter requirement");
    await expect(page.locator('[data-testid="rule-hasUppercase"]')).toContainText('At least one uppercase letter');
    await expect(page.locator('[data-testid="rule-hasUppercase-x"]')).toBeVisible(); // Should show ✕
    
    await page.fill('[data-testid="password"]', 'abcdefgH'); // Add uppercase
    await expect(page.locator('[data-testid="rule-hasUppercase-check"]')).toBeVisible(); // Should show ✓

    // 3. Test lowercase letter requirement  
    await stagehand.act("Check lowercase letter requirement");
    await expect(page.locator('[data-testid="rule-hasLowercase"]')).toContainText('At least one lowercase letter');
    await expect(page.locator('[data-testid="rule-hasLowercase-check"]')).toBeVisible(); // Should show ✓ (already has lowercase)

    // 4. Test number requirement
    await stagehand.act("Check number requirement");
    await expect(page.locator('[data-testid="rule-hasNumber"]')).toContainText('At least one number');
    await expect(page.locator('[data-testid="rule-hasNumber-x"]')).toBeVisible(); // Should show ✕
    
    await page.fill('[data-testid="password"]', 'abcdefgH1'); // Add number
    await expect(page.locator('[data-testid="rule-hasNumber-check"]')).toBeVisible(); // Should show ✓

    // 5. Test special character requirement
    await stagehand.act("Check special character requirement");
    await expect(page.locator('[data-testid="rule-hasSpecialChar"]')).toContainText('At least one special character');
    await expect(page.locator('[data-testid="rule-hasSpecialChar-x"]')).toBeVisible(); // Should show ✕
    
    await page.fill('[data-testid="password"]', 'abcdefgH1!'); // Add special char
    await expect(page.locator('[data-testid="rule-hasSpecialChar-check"]')).toBeVisible(); // Should show ✓

    // Verify all rules are now satisfied
    await stagehand.act("Verify all password requirements are now met");
    await expect(page.locator('[data-testid="rule-minLength-check"]')).toBeVisible();
    await expect(page.locator('[data-testid="rule-hasUppercase-check"]')).toBeVisible();
    await expect(page.locator('[data-testid="rule-hasLowercase-check"]')).toBeVisible();
    await expect(page.locator('[data-testid="rule-hasNumber-check"]')).toBeVisible();
    await expect(page.locator('[data-testid="rule-hasSpecialChar-check"]')).toBeVisible();

    // Verify password validation component disappears when requirements are met
    await stagehand.act("Check if password validation component is hidden when all requirements are met");
    await expect(page.locator('[data-testid="password-validation"]')).not.toBeVisible();
  });

  test('should validate form fields and show appropriate error messages', async ({ page }) => {
    // Test email validation
    await stagehand.act("Test email field validation with invalid email");
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.blur('[data-testid="email"]');
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();

    await page.fill('[data-testid="email"]', 'valid@email.com');
    await page.blur('[data-testid="email"]');
    await expect(page.locator('text=Please enter a valid email address')).not.toBeVisible();

    // Test password confirmation mismatch
    await stagehand.act("Test password confirmation mismatch validation");
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'DifferentPass123!');
    await page.blur('[data-testid="confirm-password"]');
    await expect(page.locator('text=Passwords do not match')).toBeVisible();

    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    await page.blur('[data-testid="confirm-password"]');
    await expect(page.locator('text=Passwords do not match')).not.toBeVisible();

    // Test required field validation
    await stagehand.act("Test required field validation for full name");
    await page.fill('[data-testid="full-name"]', '');
    await page.blur('[data-testid="full-name"]');
    await expect(page.locator('text=Full name is required')).toBeVisible();

    // Test checkbox validation
    await stagehand.act("Test checkbox validation for age verification");
    await page.click('[data-testid="submit-button"]');
    await expect(page.locator('text=You must verify that you are 18 years of age or older')).toBeVisible();
    await expect(page.locator('text=You must consent to the use of your data for development purposes')).toBeVisible();
  });

  test('should support enhanced keyboard navigation between fields', async ({ page }) => {
    await stagehand.act("Test Enter key navigation between form fields");
    
    // Start at full name field
    await page.focus('[data-testid="full-name"]');
    await page.fill('[data-testid="full-name"]', 'John Doe');
    
    // Press Enter to move to email field
    await page.press('[data-testid="full-name"]', 'Enter');
    await expect(page.locator('[data-testid="email"]')).toBeFocused();
    
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    
    // Press Enter to move to password field
    await page.press('[data-testid="email"]', 'Enter');
    await expect(page.locator('[data-testid="password"]')).toBeFocused();
    
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    
    // Press Enter to move to confirm password field
    await page.press('[data-testid="password"]', 'Enter');
    await expect(page.locator('[data-testid="confirm-password"]')).toBeFocused();
    
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    
    // Check checkboxes
    await page.check('[data-testid="age-verification"]');
    await page.check('[data-testid="development-consent"]');
    
    // Press Enter on confirm password should attempt form submission
    await stagehand.act("Press Enter on the final field to submit the form");
    await page.press('[data-testid="confirm-password"]', 'Enter');
    
    // Should attempt to submit (will likely show network error in test environment)
    await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
  });

  test('should handle password visibility toggles correctly', async ({ page }) => {
    await stagehand.act("Test password visibility toggle functionality");
    
    // Test password field toggle
    await page.fill('[data-testid="password"]', 'TestPassword123!');
    await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'password');
    
    await page.click('[data-testid="password-toggle"]');
    await expect(page.locator('[data-testid="password-toggle"] text=Hide')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'text');
    
    await page.click('[data-testid="password-toggle"]');
    await expect(page.locator('[data-testid="password-toggle"] text=Show')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'password');

    // Test confirm password field toggle
    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
    await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'password');
    
    await page.click('[data-testid="confirm-password-toggle"]');
    await expect(page.locator('[data-testid="confirm-password-toggle"] text=Hide')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'text');
    
    await page.click('[data-testid="confirm-password-toggle"]');
    await expect(page.locator('[data-testid="confirm-password-toggle"] text=Show')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'password');
  });

  test('should validate checkbox interactions and visual states', async ({ page }) => {
    await stagehand.act("Test checkbox visual states and interactions");
    
    // Test age verification checkbox
    await expect(page.locator('[data-testid="age-verification"]')).not.toBeChecked();
    await page.click('[data-testid="age-verification"]');
    await expect(page.locator('[data-testid="age-verification"]')).toBeChecked();
    
    // Verify checkmark appears
    await expect(page.locator('[data-testid="age-verification"] text=✓')).toBeVisible();
    
    // Test development consent checkbox
    await expect(page.locator('[data-testid="development-consent"]')).not.toBeChecked();
    await page.click('[data-testid="development-consent"]');
    await expect(page.locator('[data-testid="development-consent"]')).toBeChecked();
    
    // Verify checkmark appears
    await expect(page.locator('[data-testid="development-consent"] text=✓')).toBeVisible();
    
    // Test unchecking
    await page.click('[data-testid="age-verification"]');
    await expect(page.locator('[data-testid="age-verification"]')).not.toBeChecked();
  });

  test('should handle navigation between login and signup forms', async ({ page }) => {
    // Test navigation from signup to login
    await stagehand.act("Navigate from signup form to login form");
    await page.click('[data-testid="switch-to-login"]');
    await page.waitForSelector('[data-testid="login-form"]');
    await expect(page.url()).toContain('/login');
    
    // Test navigation from login back to signup
    await stagehand.act("Navigate from login form back to signup form");
    await page.click('[data-testid="switch-to-signup"]');
    await page.waitForSelector('[data-testid="signup-form"]');
    await expect(page.url()).toContain('/signup');
  });
});