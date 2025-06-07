import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * ♿ ACCESSIBILITY TESTS
 *
 * Dedicated tests for accessibility compliance using axe-core
 * Run with: npm run test:a11y
 */

test.describe('Accessibility @accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage should be accessible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sign up form should be accessible', async ({ page }) => {
    // Navigate to sign up form
    const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

    if (await signUpButton.isVisible()) {
      await signUpButton.click();
    }

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('login form should be accessible', async ({ page }) => {
    // Navigate to login form
    const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

    if (await loginButton.isVisible()) {
      await loginButton.click();
    }

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forms should be keyboard navigable', async ({ page }) => {
    // Navigate to sign up form
    const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

    if (await signUpButton.isVisible()) {
      await signUpButton.click();
    }

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate through form elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('error messages should be announced to screen readers', async ({ page }) => {
    // Navigate to sign up form
    const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

    if (await signUpButton.isVisible()) {
      await signUpButton.click();
    }

    // Submit form with invalid data to trigger errors
    await page.fill('[data-testid="email"], input[type="email"]', 'invalid-email');

    const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first();
    await submitButton.click();

    // Check that error messages have proper ARIA attributes
    const errorMessage = page.locator('text=/invalid|error|required/i').first();

    if (await errorMessage.isVisible()) {
      const ariaLive = await errorMessage.getAttribute('aria-live');
      const role = await errorMessage.getAttribute('role');

      // Error messages should be announced (aria-live) or have alert role
      expect(ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert').toBeTruthy();
    }
  });
});
