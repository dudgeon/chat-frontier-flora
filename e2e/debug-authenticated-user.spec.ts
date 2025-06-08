import { test, expect } from '@playwright/test';

test.describe('Authenticated User Debug', () => {
  test('debug authenticated user experience', async ({ page }) => {
    console.log('=== STARTING AUTHENTICATED USER DEBUG ===');

    // First, sign up a user to get authenticated state
    await page.goto('http://localhost:19006/');
    console.log('1. Navigated to homepage');

    await page.waitForLoadState('networkidle');
    console.log('2. Page loaded');

    // Fill out signup form
    await page.fill('[data-testid="full-name"]', 'Test User');
    await page.fill('[data-testid="email"]', `test${Date.now()}@example.com`);
    await page.fill('[data-testid="password"]', 'TestPassword123!');
    await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
    await page.click('[data-testid="age-verification-checkbox"]');
    await page.click('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="development-consent-checkbox"]');

    console.log('3. Filled signup form');

    // Submit signup
    await page.click('[data-testid="submit-button"]');
    console.log('4. Submitted signup');

    // Wait for redirect to chat
    await page.waitForURL('**/chat', { timeout: 10000 });
    console.log('5. Redirected to /chat');

    // Wait a bit for the page to settle
    await page.waitForTimeout(3000);
    console.log('6. Waited for page to settle');

    // Now check what's visible on the chat page
    const bodyText = await page.textContent('body');
    console.log('7. Body text on /chat:', bodyText?.substring(0, 200) + '...');

    // Check for loading indicators
    const loadingElements = await page.locator('text=Loading').count();
    console.log('8. Loading elements found:', loadingElements);

    // Check for chat page elements
    const chatElements = await page.locator('[data-testid="chat-page"]').count();
    console.log('9. Chat page elements found:', chatElements);

    // Check for profile menu button
    const menuButton = await page.locator('[data-testid="profile-menu-button"]').count();
    console.log('10. Profile menu button found:', menuButton);

    // Now simulate what happens when the user refreshes the page (like your browser)
    console.log('11. === SIMULATING PAGE REFRESH (like your browser) ===');
    await page.reload();
    console.log('12. Page reloaded');

    await page.waitForLoadState('networkidle');
    console.log('13. Page loaded after refresh');

    // Wait a bit for auth to initialize
    await page.waitForTimeout(5000);
    console.log('14. Waited for auth initialization');

    // Check what's visible after refresh
    const bodyTextAfterRefresh = await page.textContent('body');
    console.log('15. Body text after refresh:', bodyTextAfterRefresh?.substring(0, 200) + '...');

    // Check for loading indicators after refresh
    const loadingElementsAfterRefresh = await page.locator('text=Loading').count();
    console.log('16. Loading elements after refresh:', loadingElementsAfterRefresh);

    // Check for chat page elements after refresh
    const chatElementsAfterRefresh = await page.locator('[data-testid="chat-page"]').count();
    console.log('17. Chat page elements after refresh:', chatElementsAfterRefresh);

    // Check for profile menu button after refresh
    const menuButtonAfterRefresh = await page.locator('[data-testid="profile-menu-button"]').count();
    console.log('18. Profile menu button after refresh:', menuButtonAfterRefresh);

    // Take screenshots
    await page.screenshot({ path: 'debug-authenticated-before-refresh.png', fullPage: true });
    console.log('19. Screenshots taken');

    // Capture console logs
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));

    await page.waitForTimeout(2000);

    console.log('=== CONSOLE LOGS ===');
    logs.forEach(log => console.log('log:', log));

    console.log('=== AUTHENTICATED USER DEBUG COMPLETE ===');
  });
});
