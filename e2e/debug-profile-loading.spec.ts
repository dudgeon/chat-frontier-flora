import { test, expect } from '@playwright/test';

test.describe('Profile Loading Debug', () => {
  test('debug profile loading after signup', async ({ page }) => {
    console.log('=== STARTING PROFILE LOADING DEBUG ===');

    // Capture all console logs with timestamps
    const logs: { time: number, text: string }[] = [];
    page.on('console', msg => {
      const text = msg.text();
      const time = Date.now();
      logs.push({ time, text });
      console.log(`[${new Date(time).toISOString()}] BROWSER:`, text);
    });

    // Capture errors
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    // Navigate and sign up
    await page.goto('http://localhost:19006/');
    await page.waitForLoadState('networkidle');

    // Fill signup form
    const email = `test${Date.now()}@example.com`;
    await page.fill('[data-testid="full-name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'TestPassword123!');
    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
    await page.click('[data-testid="age-verification-checkbox"]');
    await page.click('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="development-consent-checkbox"]');

    console.log('=== SUBMITTING SIGNUP ===');
    await page.click('[data-testid="submit-button"]');

    // Wait for redirect
    await page.waitForURL('**/chat', { timeout: 10000 });
    console.log('=== REDIRECTED TO /chat ===');

    // Wait and capture what happens during profile loading
    console.log('=== WAITING FOR PROFILE LOADING ===');
    await page.waitForTimeout(10000); // Wait 10 seconds to see profile loading

    // Check final state
    const bodyText = await page.textContent('body');
    const isStillLoading = bodyText?.includes('Loading');
    const hasChat = await page.locator('[data-testid="chat-page"]').count();
    const hasProfileMenu = await page.locator('[data-testid="profile-menu-button"]').count();

    console.log('=== FINAL STATE ===');
    console.log('Still loading:', isStillLoading);
    console.log('Chat elements:', hasChat);
    console.log('Profile menu:', hasProfileMenu);
    console.log('Body text preview:', bodyText?.substring(0, 200));

    // Filter and show profile-related logs
    console.log('=== PROFILE-RELATED LOGS ===');
    const profileLogs = logs.filter(log =>
      log.text.includes('profile') ||
      log.text.includes('Profile') ||
      log.text.includes('PGRST') ||
      log.text.includes('Error') ||
      log.text.includes('loading') ||
      log.text.includes('Loading')
    );

    profileLogs.forEach((log, i) => {
      console.log(`${i + 1}. [${new Date(log.time).toISOString()}] ${log.text}`);
    });
  });
});
