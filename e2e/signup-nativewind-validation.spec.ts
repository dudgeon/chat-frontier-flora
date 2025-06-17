import { test, expect } from '@playwright/test';

/**
 * NativeWind Signup Form Validation Tests
 * 
 * Tests the critical functionality of our NativeWind-converted signup form:
 * - Password validation component behavior
 * - Form field validation
 * - Visual styling verification
 * - Enhanced UX features (keyboard navigation)
 * - Error handling
 */
test.describe('NativeWind Signup Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await page.waitForSelector('[data-testid="signup-form"]');
  });

  test('password validation component should display and update correctly', async ({ page }) => {
    // Initially, password validation should not be visible
    await expect(page.locator('[data-testid="password-validation"]')).not.toBeVisible();

    // Type in password field to trigger validation
    await page.fill('[data-testid="password"]', 'a');
    
    // Password validation component should appear
    await expect(page.locator('[data-testid="password-validation"]')).toBeVisible();
    await expect(page.locator('text=Your password must contain:')).toBeVisible();

    // Check that all 5 password rules are visible
    await expect(page.locator('[data-testid="rule-minLength"]')).toContainText('At least 8 characters');
    await expect(page.locator('[data-testid="rule-hasUppercase"]')).toContainText('At least one uppercase letter');
    await expect(page.locator('[data-testid="rule-hasLowercase"]')).toContainText('At least one lowercase letter');
    await expect(page.locator('[data-testid="rule-hasNumber"]')).toContainText('At least one number');
    await expect(page.locator('[data-testid="rule-hasSpecialChar"]')).toContainText('At least one special character');

    // Check which rules are met/not met for password "a"
    await expect(page.locator('[data-testid="rule-minLength-x"]')).toBeVisible(); // "a" < 8 chars
    await expect(page.locator('[data-testid="rule-hasUppercase-x"]')).toBeVisible(); // "a" has no uppercase
    await expect(page.locator('[data-testid="rule-hasLowercase-check"]')).toBeVisible(); // "a" has lowercase ✓
    await expect(page.locator('[data-testid="rule-hasNumber-x"]')).toBeVisible(); // "a" has no numbers
    await expect(page.locator('[data-testid="rule-hasSpecialChar-x"]')).toBeVisible(); // "a" has no special chars

    // Test minimum length requirement
    await page.fill('[data-testid="password"]', 'abcdefgh'); // 8 characters
    await expect(page.locator('[data-testid="rule-minLength-check"]')).toBeVisible();
    await expect(page.locator('[data-testid="rule-hasLowercase-check"]')).toBeVisible(); // lowercase satisfied

    // Add uppercase
    await page.fill('[data-testid="password"]', 'abcdefgH');
    await expect(page.locator('[data-testid="rule-hasUppercase-check"]')).toBeVisible();

    // Add number
    await page.fill('[data-testid="password"]', 'abcdefgH1');
    await expect(page.locator('[data-testid="rule-hasNumber-check"]')).toBeVisible();

    // Add special character - should complete all requirements
    await page.fill('[data-testid="password"]', 'abcdefgH1!');
    await expect(page.locator('[data-testid="rule-hasSpecialChar-check"]')).toBeVisible();

    // When all requirements are met, validation component should hide
    await expect(page.locator('[data-testid="password-validation"]')).not.toBeVisible();
  });

  test('form field validation should work correctly', async ({ page }) => {
    // Test email validation
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.locator('[data-testid="email"]').blur();
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();

    // Fix email
    await page.fill('[data-testid="email"]', 'valid@email.com');
    await page.locator('[data-testid="email"]').blur();
    await expect(page.locator('text=Please enter a valid email address')).not.toBeVisible();

    // Test password confirmation
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'DifferentPass123!');
    await page.locator('[data-testid="confirm-password"]').blur();
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();

    // Fix password confirmation
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    await page.locator('[data-testid="confirm-password"]').blur();
    await expect(page.locator('text=Passwords do not match')).not.toBeVisible();
  });

  test('keyboard navigation should work between fields', async ({ page }) => {
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
  });

  test('password visibility toggles should work correctly', async ({ page }) => {
    // Fill password fields
    await page.fill('[data-testid="password"]', 'TestPassword123!');
    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');

    // Initially, password fields should be hidden
    await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'password');
    await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'password');

    // Click password toggle
    await page.click('[data-testid="password-toggle"]');
    await expect(page.locator('[data-testid="password-toggle"]:has-text("Hide")')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'text');

    // Click to hide again
    await page.click('[data-testid="password-toggle"]');
    await expect(page.locator('[data-testid="password-toggle"]:has-text("Show")')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'password');

    // Test confirm password toggle
    await page.click('[data-testid="confirm-password-toggle"]');
    await expect(page.locator('[data-testid="confirm-password-toggle"]:has-text("Hide")')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'text');
  });

  test('checkbox interactions should work correctly', async ({ page }) => {
    // These are custom TouchableOpacity checkboxes, not native checkboxes
    // Check for visual state instead
    
    // Click to check age verification
    await page.click('[data-testid="age-verification"]');
    // Should show checkmark
    await expect(page.locator('[data-testid="age-verification"] text=✓')).toBeVisible();
    
    // Click to check development consent
    await page.click('[data-testid="development-consent"]');
    // Should show checkmark
    await expect(page.locator('[data-testid="development-consent"] text=✓')).toBeVisible();

    // Click to uncheck age verification
    await page.click('[data-testid="age-verification"]');
    // Checkmark should disappear
    await expect(page.locator('[data-testid="age-verification"] text=✓')).not.toBeVisible();
  });

  test('navigation between forms should work', async ({ page }) => {
    // Click "Sign In" link to go to login
    await page.click('[data-testid="switch-to-login"]');
    await page.waitForSelector('[data-testid="login-form"]');
    await expect(page.url()).toContain('/login');
    
    // Click "Sign Up" link to go back to signup
    await page.click('[data-testid="switch-to-signup"]');
    await page.waitForSelector('[data-testid="signup-form"]');
    await expect(page.url()).toContain('/signup');
  });

  test('NativeWind styling should be properly applied', async ({ page }) => {
    // Check that key elements have NativeWind classes applied
    
    // Main form container should have proper styling
    const formContainer = page.locator('[data-testid="signup-form"]').locator('..');
    await expect(formContainer).toHaveClass(/bg-white/);
    await expect(formContainer).toHaveClass(/rounded-xl/);
    
    // Submit button should have NativeWind classes
    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toHaveClass(/bg-blue-500/);
    await expect(submitButton).toHaveClass(/rounded-xl/);
    
    // Trigger password validation to test its styling
    await page.fill('[data-testid="password"]', 'a');
    const passwordValidation = page.locator('[data-testid="password-validation"]');
    await expect(passwordValidation).toBeVisible();
    await expect(passwordValidation).toHaveClass(/bg-white/);
    await expect(passwordValidation).toHaveClass(/border/);
    await expect(passwordValidation).toHaveClass(/rounded-lg/);
    
    // Navigation link should have proper styling
    const signInLink = page.locator('[data-testid="switch-to-login"]');
    await expect(signInLink).toHaveClass(/text-blue-600/);
  });

  test('form validation errors should display correctly', async ({ page }) => {
    // Touch the form first to enable the submit button, then try to submit empty form
    await page.fill('[data-testid="full-name"]', ''); // Touch form to enable button
    await page.click('[data-testid="submit-button"]');
    
    // Should show required field errors
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    
    // Fill form but leave checkboxes unchecked
    await page.fill('[data-testid="full-name"]', 'John Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    
    // Try to submit without checkboxes
    await page.click('[data-testid="submit-button"]');
    
    // Should show checkbox validation errors
    await expect(page.locator('text=You must verify that you are 18 years of age or older')).toBeVisible();
    await expect(page.locator('text=You must consent to the use of your data for development purposes')).toBeVisible();
    
    // Check checkboxes
    await page.check('[data-testid="age-verification"]');
    await page.check('[data-testid="development-consent"]');
    
    // Errors should disappear
    await expect(page.locator('text=You must verify that you are 18 years of age or older')).not.toBeVisible();
    await expect(page.locator('text=You must consent to the use of your data for development purposes')).not.toBeVisible();
  });

  test('submit button states should update correctly', async ({ page }) => {
    // Initially disabled until form is touched (requireTouched: true)
    await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
    await expect(page.locator('[data-testid="submit-button"]')).toContainText('Create Account');
    
    // Fill valid form completely - button should only be enabled when form is both touched AND valid
    await page.fill('[data-testid="full-name"]', 'John Doe');
    // Button still disabled because form is touched but not fully valid yet
    await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
    
    await page.fill('[data-testid="email"]', 'john.doe.test@example.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
    await page.click('[data-testid="age-verification"]');
    await page.click('[data-testid="development-consent"]');
    
    // Now button should be enabled (form is both touched and valid)
    await expect(page.locator('[data-testid="submit-button"]')).toContainText('Create Account');
    await expect(page.locator('[data-testid="submit-button"]')).toBeEnabled();
    
    // Click submit and verify loading state (if implemented)
    await page.click('[data-testid="submit-button"]');
    
    // May show loading state or remain disabled during submission
    // This will depend on the actual implementation
  });
});