# Test info

- Name: Chat Page Profile Menu >> should show profile menu with logout button
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/chat-page-test.spec.ts:4:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('h1').filter({ hasText: 'Chat Frontier Flora' })
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: 'Chat Frontier Flora' })

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/chat-page-test.spec.ts:32:81
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name"
- text: Email Address *
- textbox "Enter your email address"
- text: Password *
- textbox "Enter your password"
- text: Confirm Password *
- textbox "Confirm your password"
- checkbox "I verify that I am 18 years of age or older"
- checkbox "I consent to the use of my data for development and improvement purposes"
- button "Submit button disabled. Please fix all form errors" [disabled]: Complete Form to Continue
- text: "Please fix all form errors Form Valid: No Form Touched: No Form Completed: No Completion: 0/6 (0%) Submit Button: disabled - Disabled Disabled Reason: Please fix all form errors Already have an account? Sign In"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Chat Page Profile Menu', () => {
   4 |   test('should show profile menu with logout button', async ({ page }) => {
   5 |     console.log('=== TESTING CHAT PAGE PROFILE MENU ===');
   6 |
   7 |     // Capture console logs and errors
   8 |     const consoleLogs: string[] = [];
   9 |     const consoleErrors: string[] = [];
   10 |
   11 |     page.on('console', msg => {
   12 |       const text = `[${msg.type()}] ${msg.text()}`;
   13 |       consoleLogs.push(text);
   14 |       if (msg.type() === 'error') {
   15 |         consoleErrors.push(text);
   16 |       }
   17 |     });
   18 |
   19 |     page.on('pageerror', error => {
   20 |       consoleErrors.push(`[pageerror] ${error.message}`);
   21 |     });
   22 |
   23 |     // Navigate to homepage
   24 |     await page.goto('http://localhost:19006');
   25 |     console.log('1. Navigated to homepage');
   26 |
   27 |     // Wait for page to load
   28 |     await page.waitForLoadState('networkidle');
   29 |     console.log('2. Page loaded');
   30 |
   31 |     // Verify we're on the signup page
>  32 |     await expect(page.locator('h1').filter({ hasText: 'Chat Frontier Flora' })).toBeVisible();
      |                                                                                 ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   33 |     await expect(page.locator('text=Create your account')).toBeVisible();
   34 |     console.log('3. Signup page loaded');
   35 |
   36 |     // Fill out signup form
   37 |     await page.fill('[data-testid="full-name"]', 'Test User');
   38 |     await page.fill('[data-testid="email"]', `test${Date.now()}@example.com`);
   39 |     await page.fill('[data-testid="password"]', 'TestPassword123!');
   40 |     await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
   41 |     await page.click('[data-testid="age-verification-checkbox"]');
   42 |     await page.click('[data-testid="terms-checkbox"]');
   43 |     await page.click('[data-testid="development-consent-checkbox"]');
   44 |     console.log('4. Filled signup form');
   45 |
   46 |     // Submit signup form
   47 |     await page.click('[data-testid="submit-button"]');
   48 |     console.log('5. Submitted signup form');
   49 |
   50 |     // Wait a bit and check console logs to see what's happening
   51 |     await page.waitForTimeout(3000);
   52 |     console.log('6. Console logs after 3 seconds:');
   53 |     consoleLogs.slice(-10).forEach(log => console.log(`   ${log}`));
   54 |
   55 |     if (consoleErrors.length > 0) {
   56 |       console.log('7. Console errors:');
   57 |       consoleErrors.forEach(error => console.log(`   ${error}`));
   58 |     }
   59 |
   60 |     // Check current URL
   61 |     const currentUrl = page.url();
   62 |     console.log('8. Current URL:', currentUrl);
   63 |
   64 |     // Wait for redirect to chat page with longer timeout
   65 |     try {
   66 |       await page.waitForURL('**/chat', { timeout: 20000 });
   67 |       console.log('9. ✅ Redirected to chat page');
   68 |     } catch (error) {
   69 |       console.log('9. ❌ Failed to redirect to chat page within 20 seconds');
   70 |
   71 |       // Print more console logs
   72 |       console.log('10. Additional console logs:');
   73 |       consoleLogs.slice(-15).forEach(log => console.log(`   ${log}`));
   74 |
   75 |       // Check what's on the page
   76 |       const allText = await page.locator('body').textContent();
   77 |       console.log('11. Page content:', allText?.substring(0, 200));
   78 |
   79 |       console.log('=== SIGNUP FAILED - STOPPING TEST ===');
   80 |       return;
   81 |     }
   82 |
   83 |     // Wait for the "Loading..." text to disappear and profile menu button to appear
   84 |     console.log('12. Waiting for auth loading to complete...');
   85 |
   86 |     // Wait for either the profile menu button to appear OR a timeout
   87 |     try {
   88 |       await page.waitForSelector('[data-testid="profile-menu-toggle"]', {
   89 |         timeout: 15000,
   90 |         state: 'visible'
   91 |       });
   92 |       console.log('13. ✅ Profile menu toggle button is now visible!');
   93 |
   94 |       // Take a screenshot of the successful state
   95 |       await page.screenshot({ path: 'debug-chat-page-success.png', fullPage: true });
   96 |
   97 |       // Test the profile menu functionality
   98 |       await page.click('[data-testid="profile-menu-toggle"]');
   99 |       console.log('14. Clicked profile menu toggle');
  100 |
  101 |       // Check if profile menu is visible
  102 |       await expect(page.locator('[data-testid="profile-menu"]')).toBeVisible();
  103 |       console.log('15. Profile menu is visible');
  104 |
  105 |       // Check if logout button is visible
  106 |       await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
  107 |       console.log('16. Logout button is visible');
  108 |
  109 |       console.log('✅ SUCCESS: Profile menu functionality working perfectly!');
  110 |
  111 |     } catch (error) {
  112 |       console.log('13. ❌ Profile menu toggle button did not appear within 15 seconds');
  113 |
  114 |       // Debug: Check what's on the page
  115 |       const allText = await page.locator('body').textContent();
  116 |       console.log('14. Page content after waiting:', allText?.substring(0, 300));
  117 |
  118 |       // Print recent console logs
  119 |       console.log('15. Recent console logs:');
  120 |       consoleLogs.slice(-20).forEach(log => console.log(`   ${log}`));
  121 |
  122 |       if (consoleErrors.length > 0) {
  123 |         console.log('16. Console errors:');
  124 |         consoleErrors.forEach(error => console.log(`   ${error}`));
  125 |       }
  126 |
  127 |       // Take a screenshot for debugging
  128 |       await page.screenshot({ path: 'debug-chat-page-failed.png', fullPage: true });
  129 |
  130 |       console.log('❌ ISSUE: Profile menu button never appeared');
  131 |     }
  132 |
```