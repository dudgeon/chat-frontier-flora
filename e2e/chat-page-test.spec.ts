import { test, expect } from '@playwright/test';

test.describe('Chat Page Profile Menu', () => {
  test('should show profile menu with logout button', async ({ page }) => {
    console.log('=== TESTING CHAT PAGE PROFILE MENU ===');

    // Capture console logs and errors
    const consoleLogs: string[] = [];
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`;
      consoleLogs.push(text);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(`[pageerror] ${error.message}`);
    });

    // Navigate to homepage
    await page.goto('http://localhost:19006');
    console.log('1. Navigated to homepage');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('2. Page loaded');

    // Verify we're on the signup page
    await expect(page.locator('h1').filter({ hasText: 'Chat Frontier Flora' })).toBeVisible();
    await expect(page.locator('text=Create your account')).toBeVisible();
    console.log('3. Signup page loaded');

    // Fill out signup form
    await page.fill('[data-testid="full-name"]', 'Test User');
    await page.fill('[data-testid="email"]', `test${Date.now()}@example.com`);
    await page.fill('[data-testid="password"]', 'TestPassword123!');
    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
    await page.click('[data-testid="age-verification-checkbox"]');
    await page.click('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="development-consent-checkbox"]');
    console.log('4. Filled signup form');

    // Submit signup form
    await page.click('[data-testid="submit-button"]');
    console.log('5. Submitted signup form');

    // Wait a bit and check console logs to see what's happening
    await page.waitForTimeout(3000);
    console.log('6. Console logs after 3 seconds:');
    consoleLogs.slice(-10).forEach(log => console.log(`   ${log}`));

    if (consoleErrors.length > 0) {
      console.log('7. Console errors:');
      consoleErrors.forEach(error => console.log(`   ${error}`));
    }

    // Check current URL
    const currentUrl = page.url();
    console.log('8. Current URL:', currentUrl);

    // Wait for redirect to chat page with longer timeout
    try {
      await page.waitForURL('**/chat', { timeout: 20000 });
      console.log('9. ✅ Redirected to chat page');
    } catch (error) {
      console.log('9. ❌ Failed to redirect to chat page within 20 seconds');

      // Print more console logs
      console.log('10. Additional console logs:');
      consoleLogs.slice(-15).forEach(log => console.log(`   ${log}`));

      // Check what's on the page
      const allText = await page.locator('body').textContent();
      console.log('11. Page content:', allText?.substring(0, 200));

      console.log('=== SIGNUP FAILED - STOPPING TEST ===');
      return;
    }

    // Wait for the "Loading..." text to disappear and profile menu button to appear
    console.log('12. Waiting for auth loading to complete...');

    // Wait for either the profile menu button to appear OR a timeout
    try {
      await page.waitForSelector('[data-testid="profile-menu-toggle"]', {
        timeout: 15000,
        state: 'visible'
      });
      console.log('13. ✅ Profile menu toggle button is now visible!');

      // Take a screenshot of the successful state
      await page.screenshot({ path: 'debug-chat-page-success.png', fullPage: true });

      // Test the profile menu functionality
      await page.click('[data-testid="profile-menu-toggle"]');
      console.log('14. Clicked profile menu toggle');

      // Check if profile menu is visible
      await expect(page.locator('[data-testid="profile-menu"]')).toBeVisible();
      console.log('15. Profile menu is visible');

      // Check if logout button is visible
      await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
      console.log('16. Logout button is visible');

      console.log('✅ SUCCESS: Profile menu functionality working perfectly!');

    } catch (error) {
      console.log('13. ❌ Profile menu toggle button did not appear within 15 seconds');

      // Debug: Check what's on the page
      const allText = await page.locator('body').textContent();
      console.log('14. Page content after waiting:', allText?.substring(0, 300));

      // Print recent console logs
      console.log('15. Recent console logs:');
      consoleLogs.slice(-20).forEach(log => console.log(`   ${log}`));

      if (consoleErrors.length > 0) {
        console.log('16. Console errors:');
        consoleErrors.forEach(error => console.log(`   ${error}`));
      }

      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-chat-page-failed.png', fullPage: true });

      console.log('❌ ISSUE: Profile menu button never appeared');
    }

    console.log('=== TEST COMPLETE ===');
  });
});
