import { test, expect } from '@playwright/test';

test.describe('Existing Auth Debug', () => {
  test('debug what happens with existing auth session', async ({ page }) => {
    console.log('=== STARTING EXISTING AUTH DEBUG ===');

    // Capture console logs
    const logs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      console.log('BROWSER LOG:', text);
    });

    // Capture errors
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    // First, create an authenticated user by signing up
    await page.goto('http://localhost:19006/');
    await page.waitForLoadState('networkidle');

    // Fill signup form
    const email = `test${Date.now()}@example.com`;
    await page.fill('[data-testid="full-name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'TestPassword123!');
    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');

    // Check consent boxes
    await page.click('[data-testid="age-verification-checkbox"]');
    await page.click('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="development-consent-checkbox"]');

    // Submit signup
    await page.click('[data-testid="submit-button"]');
    console.log('1. Submitted signup form');

    // Wait for redirect to /chat
    await page.waitForURL('**/chat', { timeout: 15000 });
    console.log('2. Redirected to /chat');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('3. Page loaded after redirect');

    // Check what's visible
    const bodyText = await page.textContent('body');
    console.log('4. Body text after auth:', bodyText?.substring(0, 200) + '...');

    // Check for loading indicators
    const loadingElements = await page.locator('text=Loading').count();
    console.log('5. Loading elements found:', loadingElements);

    // Check for chat page elements
    const chatElements = await page.locator('[data-testid*="chat"]').count();
    console.log('6. Chat elements found:', chatElements);

    // Now simulate what happens when you refresh the page (like your situation)
    console.log('=== SIMULATING PAGE REFRESH ===');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait longer to see if loading resolves

    const bodyTextAfterRefresh = await page.textContent('body');
    console.log('7. Body text after refresh:', bodyTextAfterRefresh?.substring(0, 200) + '...');

    const loadingAfterRefresh = await page.locator('text=Loading').count();
    console.log('8. Loading elements after refresh:', loadingAfterRefresh);

    // Check if we're stuck in loading state
    if (loadingAfterRefresh > 0) {
      console.log('❌ CONFIRMED: Stuck in loading state after refresh');
    } else {
      console.log('✅ Loading resolved after refresh');
    }

    console.log('=== FINAL CONSOLE LOGS ===');
    logs.forEach((log, i) => console.log(`${i + 1}. ${log}`));
  });
});
