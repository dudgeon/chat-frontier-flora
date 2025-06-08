import { test, expect } from '@playwright/test';

/**
 * 🏠 LOCAL AUTHENTICATION FLOW TEST
 *
 * Tests the authentication flow on localhost development server.
 * Verifies that our testID changes work correctly.
 */

const LOCAL_URL = 'http://localhost:19006';

test.describe('Local Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local site
    await page.goto(LOCAL_URL);
  });

  test('should load homepage quickly and show signup form', async ({ page }) => {
    console.log('🌐 Testing local homepage load...');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should show the signup form (unauthenticated state)
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible({ timeout: 10000 });

    // Check that we have the optimized form fields
    await expect(page.locator('[data-testid="full-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="email"]')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toBeVisible();

    console.log('✅ Homepage loaded successfully with signup form');
  });

  test('should complete signup flow with testID selectors', async ({ page }) => {
    console.log('🔐 Testing signup flow with testID selectors...');

    // Wait for signup form to be ready
    await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });

    // Generate unique test user
    const timestamp = Date.now();
    const testEmail = `test-local-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = `Local Test User ${timestamp}`;

    console.log(`📝 Creating test user: ${testEmail}`);

    // Fill out the signup form using testID selectors
    await page.fill('[data-testid="full-name"]', testName);
    await page.fill('[data-testid="email"]', testEmail);
    await page.fill('[data-testid="password"]', testPassword);

    // Check age verification and development consent using testID
    await page.check('[data-testid="age-verification"]');
    await page.check('[data-testid="development-consent"]');

    // Submit the form
    await page.click('[data-testid="submit-button"]');

    // Wait for redirect to chat page
    await page.waitForURL('**/chat', { timeout: 15000 });

    console.log('✅ Signup successful, redirected to chat page');

    // Verify we're on the chat page
    await expect(page).toHaveURL(/.*\/chat/);

    // Wait for chat page to fully load
    await page.waitForSelector('[data-testid="chat-page"]', { timeout: 10000 });

    // Verify the profile menu is accessible
    const profileMenuButton = page.locator('[data-testid="profile-menu-button"]');
    await expect(profileMenuButton).toBeVisible({ timeout: 5000 });

    console.log('✅ Chat page loaded successfully with profile menu visible');
  });
});
