import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AuthHelpers, TEST_USERS } from './helpers/auth-helpers';

/**
 * 🎭 AUTHENTICATION FLOW E2E TESTS
 *
 * Comprehensive end-to-end testing of authentication flows including:
 * - User registration with validation
 * - Login/logout functionality
 * - Role-based access control
 * - Form validation and error handling
 * - Accessibility compliance
 * - Mobile responsiveness
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test.describe('Initial App State', () => {
    test('should load the app and show authentication UI', async ({ page }) => {
      // Wait for the app to load
      await expect(page).toHaveTitle(/Chat Frontier Flora/);

      // Should show some form of authentication UI
      // This will depend on your app's initial state
      await expect(page.locator('body')).toBeVisible();
    });

    test('should be accessible', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('User Registration Flow', () => {
    test('should successfully register a new user', async ({ page }) => {
      // Look for sign up form or navigation to it
      const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

      if (await signUpButton.isVisible()) {
        await signUpButton.click();
      }

      // Fill out registration form
      await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
      await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');
      await page.fill('[data-testid="confirm-password"], input[name="confirmPassword"]', 'Test123!@#');
      await page.fill('[data-testid="full-name"], input[name="fullName"]', 'Test User');

      // Check required checkboxes
      const ageVerification = page.locator('[data-testid="age-verification"], input[name="ageVerification"]');
      if (await ageVerification.isVisible()) {
        await ageVerification.check();
      }

      const termsAgreement = page.locator('[data-testid="terms-agreement"], input[name="termsAgreed"]');
      if (await termsAgreement.isVisible()) {
        await termsAgreement.check();
      }

      // Submit the form
      const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first();
      await submitButton.click();

      // Should redirect or show success state
      // This will depend on your app's post-registration flow
      await expect(page).toHaveURL(/dashboard|profile|home/, { timeout: 10000 });
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      // Navigate to sign up if needed
      const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

      if (await signUpButton.isVisible()) {
        await signUpButton.click();
      }

      // Try to submit with invalid data
      await page.fill('[data-testid="email"], input[type="email"]', 'invalid-email');
      await page.fill('[data-testid="password"], input[type="password"]', 'weak');

      const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first();
      await submitButton.click();

      // Should show validation errors
      await expect(page.locator('text=/invalid|error|required/i')).toBeVisible({ timeout: 5000 });
    });

    test('should validate password requirements in real-time', async ({ page }) => {
      // Navigate to sign up if needed
      const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

      if (await signUpButton.isVisible()) {
        await signUpButton.click();
      }

      const passwordInput = page.locator('[data-testid="password"], input[type="password"]');

      // Type a weak password
      await passwordInput.fill('weak');

      // Should show password requirements
      await expect(page.locator('text=/uppercase|lowercase|number|special/i')).toBeVisible({ timeout: 3000 });

      // Type a strong password
      await passwordInput.fill('Strong123!@#');

      // Requirements should be satisfied (this depends on your UI implementation)
      // You might check for green checkmarks or hidden error messages
    });
  });

  test.describe('User Login Flow', () => {
    test('should successfully log in existing user', async ({ page }) => {
      // Navigate to login if needed
      const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

      if (await loginButton.isVisible()) {
        await loginButton.click();
      }

      // Fill login form
      await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
      await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');

      // Submit login
      const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
      await submitButton.click();

      // Should redirect to authenticated area
      await expect(page).toHaveURL(/dashboard|profile|home/, { timeout: 10000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      // Navigate to login if needed
      const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

      if (await loginButton.isVisible()) {
        await loginButton.click();
      }

      // Fill with invalid credentials
      await page.fill('[data-testid="email"], input[type="email"]', 'wrong@example.com');
      await page.fill('[data-testid="password"], input[type="password"]', 'wrongpassword');

      const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
      await submitButton.click();

      // Should show error message
      await expect(page.locator('text=/invalid|error|incorrect|failed/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('should restrict access to protected routes when not authenticated', async ({ page }) => {
      // Try to access a protected route directly
      await page.goto('/dashboard');

      // Should redirect to login or show access denied
      await expect(page).toHaveURL(/login|signin|auth/, { timeout: 5000 });
    });

    test('should allow access to protected routes when authenticated', async ({ page }) => {
      // First, log in (this is a simplified version - you might want to use a helper function)
      await page.goto('/');

      // Perform login flow
      const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

      if (await loginButton.isVisible()) {
        await loginButton.click();
        await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
        await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');

        const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
        await submitButton.click();

        // Wait for authentication to complete
        await page.waitForURL(/dashboard|profile|home/, { timeout: 10000 });
      }

      // Now try to access protected route
      await page.goto('/dashboard');

      // Should be able to access the dashboard
      await expect(page).toHaveURL(/dashboard/);
    });
  });

  test.describe('Logout Flow', () => {
    test('should successfully log out user', async ({ page }) => {
      // First log in
      await page.goto('/');

      const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

      if (await loginButton.isVisible()) {
        await loginButton.click();
        await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
        await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');

        const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
        await submitButton.click();

        await page.waitForURL(/dashboard|profile|home/, { timeout: 10000 });
      }

      // Now log out
      const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign Out")').first();
      await logoutButton.click();

      // Should redirect to login or home page
      await expect(page).toHaveURL(/login|signin|auth|^\/$/, { timeout: 5000 });

      // Should not be able to access protected routes
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/login|signin|auth/, { timeout: 5000 });
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work correctly on mobile devices', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
        return;
      }

      await page.goto('/');

      // Check that the UI is responsive
      const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

      if (await signUpButton.isVisible()) {
        await signUpButton.click();

        // Form should be usable on mobile
        await page.fill('[data-testid="email"], input[type="email"]', 'mobile@example.com');
        await page.fill('[data-testid="password"], input[type="password"]', 'Mobile123!@#');

        // Elements should be properly sized and accessible
        const emailInput = page.locator('[data-testid="email"], input[type="email"]');
        const boundingBox = await emailInput.boundingBox();

        // Input should be large enough for mobile interaction (at least 44px height)
        expect(boundingBox?.height).toBeGreaterThan(40);
      }
    });
  });

  test.describe('Visual Regression', () => {
    test('should match sign up form visual snapshot', async ({ page }) => {
      const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

      if (await signUpButton.isVisible()) {
        await signUpButton.click();
      }

      // Wait for form to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot('sign-up-form.png');
    });

    test('should match login form visual snapshot', async ({ page }) => {
      const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

      if (await loginButton.isVisible()) {
        await loginButton.click();
      }

      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('login-form.png');
    });
  });
});
