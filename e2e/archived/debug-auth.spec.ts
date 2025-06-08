import { test, expect } from '@playwright/test';

test.describe('Authentication Debug', () => {
  test('debug signup flow with console logs', async ({ page }) => {
    // Capture console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    });

    // Capture network requests
    const networkRequests: string[] = [];
    page.on('request', request => {
      networkRequests.push(`${request.method()} ${request.url()}`);
    });

    // Capture network responses
    const networkResponses: string[] = [];
    page.on('response', response => {
      networkResponses.push(`${response.status()} ${response.url()}`);
    });

    console.log('=== STARTING DEBUG TEST ===');

    // Navigate to the app
    await page.goto('/');
    console.log('1. Navigated to homepage');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    console.log('2. Page loaded');

    // Check if signup form is visible
    const signupForm = page.locator('[data-testid="submit-button"]');
    await expect(signupForm).toBeVisible();
    console.log('3. Signup form is visible');

    // Fill out the form
    await page.fill('[data-testid="full-name"]', 'Test User');
    console.log('4. Filled full name');

    // Use a unique email to avoid "user already registered" error
    const uniqueEmail = `test${Date.now()}@example.com`;
    await page.fill('[data-testid="email"]', uniqueEmail);
    console.log(`5. Filled email: ${uniqueEmail}`);

    await page.fill('[data-testid="password"]', 'TestPassword123!');
    console.log('6. Filled password');

    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
    console.log('7. Filled confirm password');

    // Check the checkboxes
    await page.click('[data-testid="age-verification-checkbox"]');
    console.log('8. Clicked age verification');

    await page.click('[data-testid="terms-checkbox"]');
    console.log('9. Clicked terms');

    await page.click('[data-testid="development-consent-checkbox"]');
    console.log('10. Clicked development consent');

    // Check if submit button is enabled
    const submitButton = page.locator('[data-testid="submit-button"]');
    const isDisabled = await submitButton.getAttribute('disabled');
    console.log(`11. Submit button disabled: ${isDisabled !== null}`);

    // Click submit
    console.log('12. About to click submit button');
    await submitButton.click();
    console.log('13. Clicked submit button');

    // Wait a bit to see what happens
    await page.waitForTimeout(5000);
    console.log('14. Waited 5 seconds');

    // Check current URL
    const currentUrl = page.url();
    console.log(`15. Current URL: ${currentUrl}`);

    // Print all console logs
    console.log('\n=== CONSOLE LOGS ===');
    consoleLogs.forEach(log => console.log(log));

    // Print network requests
    console.log('\n=== NETWORK REQUESTS ===');
    networkRequests.forEach(req => console.log(req));

    // Print network responses
    console.log('\n=== NETWORK RESPONSES ===');
    networkResponses.forEach(res => console.log(res));

    // Check if there are any error messages on the page
    const errorMessages = await page.locator('[data-testid*="error"], .error, [class*="error"]').allTextContents();
    console.log('\n=== ERROR MESSAGES ON PAGE ===');
    errorMessages.forEach(error => console.log(error));

    console.log('\n=== DEBUG TEST COMPLETE ===');

    // Check if user was redirected to chat (success case)
    if (currentUrl.includes('/chat')) {
      console.log('✅ SUCCESS: User was redirected to /chat');
    } else {
      console.log('❌ ISSUE: User was not redirected to /chat');
    }
  });
});
