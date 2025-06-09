import { test, expect } from '@playwright/test';

/**
 * 🌐 PRODUCTION AUTHENTICATION FLOW TEST
 *
 * Tests the optimized authentication flow on the live Netlify deployment.
 * Verifies that loading times are improved and the flow works end-to-end.
 */

const PRODUCTION_URL = 'https://frontier-family-flora.netlify.app';

test.describe('Production Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production site
    await page.goto(PRODUCTION_URL);
  });

  test('should load homepage quickly and show signup form', async ({ page }) => {
    console.log('🌐 Testing production homepage load...');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should show the signup form (unauthenticated state)
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible({ timeout: 10000 });

    // Check that we have the optimized form fields
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    console.log('✅ Homepage loaded successfully with signup form');
  });

  test('should complete signup flow with optimized loading times', async ({ page }) => {
    console.log('🔐 Testing optimized signup flow in production...');

    // Wait for signup form to be ready
    await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });

    // Generate unique test user
    const timestamp = Date.now();
    const testEmail = `test-prod-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = `Production Test User ${timestamp}`;

    console.log(`📝 Creating test user: ${testEmail}`);

    // Fill out the signup form
    await page.fill('input[name="fullName"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Check age verification and development consent
    await page.check('input[name="ageVerification"]');
    await page.check('input[name="developmentConsent"]');

    // Start timing the signup process
    const startTime = Date.now();

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for loading state with optimized message
    const loadingElement = page.locator('text=Setting up your account...');
    if (await loadingElement.isVisible()) {
      console.log('✅ Optimized loading message displayed');

      // Wait for loading to complete (should be much faster now)
      await loadingElement.waitFor({ state: 'hidden', timeout: 5000 });
    }

    // Wait for redirect to chat page
    await page.waitForURL('**/chat', { timeout: 10000 });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(`⏱️ Total signup time: ${totalTime}ms`);

    // Verify we're on the chat page
    await expect(page).toHaveURL(/.*\/chat/);

    // Wait for chat page to fully load
    await page.waitForSelector('[data-testid="chat-page"]', { timeout: 10000 });

    // Verify the profile menu is accessible (not stuck in loading)
    const profileMenuButton = page.locator('[data-testid="profile-menu-button"]');
    await expect(profileMenuButton).toBeVisible({ timeout: 5000 });

    console.log('✅ Chat page loaded successfully with profile menu visible');

    // Test logout functionality
    await profileMenuButton.click();

    // Wait for profile menu to open
    await page.waitForSelector('[data-testid="profile-menu"]', { timeout: 5000 });

    // Click logout
    await page.click('[data-testid="logout-button"]');

    // Should redirect back to homepage
    await page.waitForURL(PRODUCTION_URL, { timeout: 10000 });

    // Should show signup form again
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible({ timeout: 5000 });

    console.log('✅ Logout successful, redirected to homepage');

    // Verify the total time was within optimized range (should be under 5 seconds)
    expect(totalTime).toBeLessThan(5000);
    console.log(`🚀 SUCCESS: Signup completed in ${totalTime}ms (under 5s target)`);
  });

  test('should handle authentication state correctly after page reload', async ({ page }) => {
    console.log('🔄 Testing authentication state persistence after reload...');

    // First, create a user and get to chat page
    await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });

    const timestamp = Date.now();
    const testEmail = `test-reload-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = `Reload Test User ${timestamp}`;

    // Quick signup
    await page.fill('input[name="fullName"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.check('input[name="ageVerification"]');
    await page.check('input[name="developmentConsent"]');
    await page.click('button[type="submit"]');

    // Wait for chat page
    await page.waitForURL('**/chat', { timeout: 10000 });
    await page.waitForSelector('[data-testid="chat-page"]', { timeout: 10000 });

    console.log('✅ User created and on chat page');

    // Now reload the page to test auth state persistence
    const reloadStartTime = Date.now();
    await page.reload();

    // Should not get stuck in loading state
    const loadingElement = page.locator('text=Setting up your account...');
    if (await loadingElement.isVisible()) {
      // Should resolve quickly with optimized timeouts
      await loadingElement.waitFor({ state: 'hidden', timeout: 3000 });
    }

    const reloadEndTime = Date.now();
    const reloadTime = reloadEndTime - reloadStartTime;

    // Should still be on chat page and functional
    await expect(page).toHaveURL(/.*\/chat/);
    await expect(page.locator('[data-testid="chat-page"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="profile-menu-button"]')).toBeVisible({ timeout: 5000 });

    console.log(`⏱️ Page reload and auth restoration time: ${reloadTime}ms`);
    console.log('✅ Authentication state persisted correctly after reload');

    // Verify reload time is within optimized range
    expect(reloadTime).toBeLessThan(4000);
    console.log(`🚀 SUCCESS: Auth state restored in ${reloadTime}ms (under 4s target)`);
  });

  test('should show proper error handling for invalid credentials', async ({ page }) => {
    console.log('🔒 Testing error handling in production...');

    // Wait for signup form
    await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });

    // Try to signup with invalid email
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'weak');

    // Submit should be disabled or show validation errors
    const submitButton = page.locator('button[type="submit"]');

    // Check if submit button is disabled due to validation
    const isDisabled = await submitButton.isDisabled();
    if (isDisabled) {
      console.log('✅ Submit button properly disabled for invalid input');
    } else {
      // If not disabled, clicking should show validation errors
      await submitButton.click();

      // Should not redirect and should show errors
      await expect(page).toHaveURL(PRODUCTION_URL);
      console.log('✅ Form validation working correctly');
    }
  });
});
