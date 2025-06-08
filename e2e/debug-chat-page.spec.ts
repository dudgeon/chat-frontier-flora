import { test, expect } from '@playwright/test';

test.describe('Chat Page Debug', () => {
  test('debug what is visible on chat page', async ({ page }) => {
    console.log('=== STARTING CHAT PAGE DEBUG ===');

    // Navigate to chat page directly
    await page.goto('http://localhost:19006/chat');
    console.log('1. Navigated to /chat');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('2. Page loaded');

    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    console.log('3. Waited for React rendering');

    // Check what's actually visible
    const bodyText = await page.textContent('body');
    console.log('4. Body text:', bodyText);

    // Check for loading indicators
    const loadingElements = await page.locator('text=Loading').count();
    console.log('5. Loading elements found:', loadingElements);

    // Check for chat page elements
    const chatElements = await page.locator('[data-testid="chat-page"]').count();
    console.log('6. Chat page elements found:', chatElements);

    // Check for profile menu button
    const menuButton = await page.locator('[data-testid="profile-menu-button"]').count();
    console.log('7. Profile menu button found:', menuButton);

    // Check for auth form
    const authForm = await page.locator('[data-testid="signup-form"]').count();
    console.log('8. Auth form found:', authForm);

    // Take a screenshot
    await page.screenshot({ path: 'debug-chat-page-direct.png', fullPage: true });
    console.log('9. Screenshot taken');

        // Check console logs
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));

    // Wait a bit more and capture final state
    await page.waitForTimeout(2000);

    console.log('=== CONSOLE LOGS ===');
    logs.forEach(log => console.log('log:', log));

    console.log('=== CHAT PAGE DEBUG COMPLETE ===');
  });
});
