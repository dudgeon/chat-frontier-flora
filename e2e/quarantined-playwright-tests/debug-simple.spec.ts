import { test, expect } from '@playwright/test';

test.describe('Simple Debug', () => {
  test('see what is actually rendering', async ({ page }) => {
    console.log('=== STARTING SIMPLE DEBUG ===');

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

    // Navigate to homepage
    await page.goto('http://localhost:19006/');
    console.log('1. Navigated to homepage');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('2. Page loaded');

    // Wait a bit for React to render
    await page.waitForTimeout(5000);
    console.log('3. Waited for React rendering');

    // Check what's actually visible
    const bodyText = await page.textContent('body');
    console.log('4. Body text:', bodyText?.substring(0, 500));

    // Check for specific elements
    const hasSignupForm = await page.locator('[data-testid="signup-form"]').count();
    const hasLoginForm = await page.locator('[data-testid="login-form"]').count();
    const hasLoadingText = await page.locator('text=Loading').count();
    const hasChatPage = await page.locator('[data-testid="chat-page"]').count();

    console.log('5. Element counts:');
    console.log('   - Signup forms:', hasSignupForm);
    console.log('   - Login forms:', hasLoginForm);
    console.log('   - Loading text:', hasLoadingText);
    console.log('   - Chat pages:', hasChatPage);

    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('6. Screenshot saved');

    console.log('=== FINAL CONSOLE LOGS ===');
    logs.forEach((log, i) => console.log(`${i + 1}. ${log}`));
  });
});
