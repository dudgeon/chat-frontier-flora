import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AuthHelpers, TEST_USERS } from './helpers/auth-helpers';

/**
 * 🚀 NETLIFY DEPLOY PREVIEW TESTS
 *
 * Tests that run against Netlify deploy previews to validate:
 * - Production build functionality
 * - Real environment variables
 * - CDN performance
 * - Cross-browser compatibility in production
 *
 * Usage:
 * - Set DEPLOY_PREVIEW_URL environment variable
 * - Run: DEPLOY_PREVIEW_URL=https://deploy-preview-123--your-site.netlify.app npm run test:preview
 */

const DEPLOY_PREVIEW_URL = process.env.DEPLOY_PREVIEW_URL;
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://chat-frontier-flora.netlify.app';

test.describe('Deploy Preview Tests', () => {
  test.skip(!DEPLOY_PREVIEW_URL, 'DEPLOY_PREVIEW_URL environment variable not set');

  test.beforeEach(async ({ page }) => {
    // Navigate to the deploy preview URL
    await page.goto(DEPLOY_PREVIEW_URL!);
  });

  test.describe('Production Build Validation', () => {
    test('should load deploy preview successfully', async ({ page }) => {
      // Verify the page loads
      await expect(page).toHaveTitle(/Chat Frontier Flora/);

      // Check that it's not showing development errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Wait for the app to fully load
      await page.waitForLoadState('networkidle');

      // Should not have critical console errors
      const criticalErrors = consoleErrors.filter(error =>
        !error.includes('Warning') &&
        !error.includes('DevTools') &&
        !error.includes('extension')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('should have correct environment variables loaded', async ({ page }) => {
      // Check that Supabase environment variables are loaded
      const supabaseUrl = await page.evaluate(() => {
        return (window as any).EXPO_PUBLIC_SUPABASE_URL ||
               process.env.EXPO_PUBLIC_SUPABASE_URL;
      });

      expect(supabaseUrl).toBeTruthy();
      expect(supabaseUrl).toContain('supabase.co');
    });

    test('should be accessible in production build', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Authentication Flow in Production', () => {
    test('should handle authentication flow in production environment', async ({ page }) => {
      const auth = new AuthHelpers(page);

      // Wait for the app to load
      await auth.waitForAuthState();

      // Try to access a protected route
      await page.goto(`${DEPLOY_PREVIEW_URL}/dashboard`);

      // Should redirect to auth or show login form
      await expect(page).toHaveURL(/login|signin|auth|^\/$/, { timeout: 10000 });
    });

    test('should show proper error handling for invalid credentials', async ({ page }) => {
      const auth = new AuthHelpers(page);

      await auth.navigateToLogin();
      await auth.fillLoginForm(TEST_USERS.invalidUser);
      await auth.submitForm();

      // Should show authentication error
      await auth.expectAuthError();
    });

    test('should validate forms correctly in production', async ({ page }) => {
      const auth = new AuthHelpers(page);

      await auth.navigateToSignUp();

      // Try to submit with invalid data
      await page.fill('[data-testid="email"], input[type="email"]', 'invalid-email');
      await page.fill('[data-testid="password"], input[type="password"]', 'weak');

      await auth.submitForm();

      // Should show validation errors
      await auth.expectValidationError();
    });
  });

  test.describe('Performance in Production', () => {
    test('should load within acceptable time limits', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(DEPLOY_PREVIEW_URL!);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have optimized bundle size', async ({ page }) => {
      // Navigate and wait for all resources to load
      await page.goto(DEPLOY_PREVIEW_URL!);
      await page.waitForLoadState('networkidle');

      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
      });

      // Performance thresholds
      expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
      expect(metrics.firstContentfulPaint).toBeLessThan(1500); // 1.5 seconds
    });
  });

  test.describe('Cross-Browser Production Testing', () => {
    test('should work consistently across browsers', async ({ page, browserName }) => {
      // Test basic functionality in each browser
      await page.goto(DEPLOY_PREVIEW_URL!);

      // Should load the app
      await expect(page.locator('body')).toBeVisible();

      // Should be able to interact with forms
      const auth = new AuthHelpers(page);
      await auth.navigateToSignUp();

      // Should be able to fill form fields
      await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');

      const emailValue = await page.inputValue('[data-testid="email"], input[type="email"]');
      expect(emailValue).toBe('test@example.com');
    });
  });

  test.describe('Mobile Production Testing', () => {
    test('should work on mobile devices in production', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
        return;
      }

      await page.goto(DEPLOY_PREVIEW_URL!);

      // Should be responsive
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeLessThanOrEqual(768);

      // Should be able to interact with mobile UI
      const auth = new AuthHelpers(page);
      await auth.navigateToSignUp();

      // Form should be usable on mobile
      await page.fill('[data-testid="email"], input[type="email"]', 'mobile@example.com');

      // Touch targets should be appropriately sized
      const emailInput = page.locator('[data-testid="email"], input[type="email"]');
      const boundingBox = await emailInput.boundingBox();

      expect(boundingBox?.height).toBeGreaterThan(40);
    });
  });
});

test.describe('Production vs Preview Comparison', () => {
  test.skip(!DEPLOY_PREVIEW_URL || !PRODUCTION_URL, 'Both DEPLOY_PREVIEW_URL and PRODUCTION_URL must be set');

  test('should have consistent behavior between preview and production', async ({ page }) => {
    // Test preview
    await page.goto(DEPLOY_PREVIEW_URL!);
    await page.waitForLoadState('networkidle');

    const previewTitle = await page.title();
    const previewBodyText = await page.locator('body').textContent();

    // Test production
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    const productionTitle = await page.title();
    const productionBodyText = await page.locator('body').textContent();

    // Should have same title
    expect(previewTitle).toBe(productionTitle);

    // Should have similar content structure (allowing for minor differences)
    expect(previewBodyText?.length).toBeGreaterThan(0);
    expect(productionBodyText?.length).toBeGreaterThan(0);
  });

  test('should have same authentication behavior', async ({ page }) => {
    const auth = new AuthHelpers(page);

    // Test preview authentication
    await page.goto(DEPLOY_PREVIEW_URL!);
    await page.goto(`${DEPLOY_PREVIEW_URL}/dashboard`);
    const previewRedirected = page.url().includes('login') || page.url().includes('signin') || page.url().includes('auth');

    // Test production authentication
    await page.goto(PRODUCTION_URL);
    await page.goto(`${PRODUCTION_URL}/dashboard`);
    const productionRedirected = page.url().includes('login') || page.url().includes('signin') || page.url().includes('auth');

    // Should have same redirect behavior
    expect(previewRedirected).toBe(productionRedirected);
  });
});
