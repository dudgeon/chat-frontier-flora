# Test info

- Name: Authenticated User Debug >> debug authenticated user experience
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/debug-authenticated-user.spec.ts:4:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="age-verification-checkbox"]')

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/debug-authenticated-user.spec.ts:19:16
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name": Test User
- text: Email Address *
- textbox "Enter your email address": test1749409122560@example.com
- text: Password *
- textbox "Enter your password": TestPassword123!
- 'progressbar "Password strength indicator: Strong"':
  - text: Password Strength Strong
  - progressbar "Password strength progress bar"
  - text: 96% strength
- list "Password requirements list": ✓ At least 8 characters ✓ At least one uppercase letter ✓ At least one lowercase letter ✓ At least one number ✓ At least one special character (!@#$%^&*)
- text: ✓ All requirements met Confirm Password *
- textbox "Confirm your password": TestPassword123!
- checkbox "I verify that I am 18 years of age or older"
- checkbox "I consent to the use of my data for development and improvement purposes"
- button "Submit button disabled. Please fix all form errors" [disabled]: Complete Form to Continue
- text: "Please fix all form errors Form Valid: No Form Touched: Yes Form Completed: No Completion: 4/6 (67%) Submit Button: disabled - Disabled Disabled Reason: Please fix all form errors Already have an account? Sign In"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Authenticated User Debug', () => {
   4 |   test('debug authenticated user experience', async ({ page }) => {
   5 |     console.log('=== STARTING AUTHENTICATED USER DEBUG ===');
   6 |
   7 |     // First, sign up a user to get authenticated state
   8 |     await page.goto('http://localhost:19006/');
   9 |     console.log('1. Navigated to homepage');
  10 |
  11 |     await page.waitForLoadState('networkidle');
  12 |     console.log('2. Page loaded');
  13 |
  14 |     // Fill out signup form
  15 |     await page.fill('[data-testid="full-name"]', 'Test User');
  16 |     await page.fill('[data-testid="email"]', `test${Date.now()}@example.com`);
  17 |     await page.fill('[data-testid="password"]', 'TestPassword123!');
  18 |     await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
> 19 |     await page.click('[data-testid="age-verification-checkbox"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  20 |     await page.click('[data-testid="terms-checkbox"]');
  21 |     await page.click('[data-testid="development-consent-checkbox"]');
  22 |
  23 |     console.log('3. Filled signup form');
  24 |
  25 |     // Submit signup
  26 |     await page.click('[data-testid="submit-button"]');
  27 |     console.log('4. Submitted signup');
  28 |
  29 |     // Wait for redirect to chat
  30 |     await page.waitForURL('**/chat', { timeout: 10000 });
  31 |     console.log('5. Redirected to /chat');
  32 |
  33 |     // Wait a bit for the page to settle
  34 |     await page.waitForTimeout(3000);
  35 |     console.log('6. Waited for page to settle');
  36 |
  37 |     // Now check what's visible on the chat page
  38 |     const bodyText = await page.textContent('body');
  39 |     console.log('7. Body text on /chat:', bodyText?.substring(0, 200) + '...');
  40 |
  41 |     // Check for loading indicators
  42 |     const loadingElements = await page.locator('text=Loading').count();
  43 |     console.log('8. Loading elements found:', loadingElements);
  44 |
  45 |     // Check for chat page elements
  46 |     const chatElements = await page.locator('[data-testid="chat-page"]').count();
  47 |     console.log('9. Chat page elements found:', chatElements);
  48 |
  49 |     // Check for profile menu button
  50 |     const menuButton = await page.locator('[data-testid="profile-menu-button"]').count();
  51 |     console.log('10. Profile menu button found:', menuButton);
  52 |
  53 |     // Now simulate what happens when the user refreshes the page (like your browser)
  54 |     console.log('11. === SIMULATING PAGE REFRESH (like your browser) ===');
  55 |     await page.reload();
  56 |     console.log('12. Page reloaded');
  57 |
  58 |     await page.waitForLoadState('networkidle');
  59 |     console.log('13. Page loaded after refresh');
  60 |
  61 |     // Wait a bit for auth to initialize
  62 |     await page.waitForTimeout(5000);
  63 |     console.log('14. Waited for auth initialization');
  64 |
  65 |     // Check what's visible after refresh
  66 |     const bodyTextAfterRefresh = await page.textContent('body');
  67 |     console.log('15. Body text after refresh:', bodyTextAfterRefresh?.substring(0, 200) + '...');
  68 |
  69 |     // Check for loading indicators after refresh
  70 |     const loadingElementsAfterRefresh = await page.locator('text=Loading').count();
  71 |     console.log('16. Loading elements after refresh:', loadingElementsAfterRefresh);
  72 |
  73 |     // Check for chat page elements after refresh
  74 |     const chatElementsAfterRefresh = await page.locator('[data-testid="chat-page"]').count();
  75 |     console.log('17. Chat page elements after refresh:', chatElementsAfterRefresh);
  76 |
  77 |     // Check for profile menu button after refresh
  78 |     const menuButtonAfterRefresh = await page.locator('[data-testid="profile-menu-button"]').count();
  79 |     console.log('18. Profile menu button after refresh:', menuButtonAfterRefresh);
  80 |
  81 |     // Take screenshots
  82 |     await page.screenshot({ path: 'debug-authenticated-before-refresh.png', fullPage: true });
  83 |     console.log('19. Screenshots taken');
  84 |
  85 |     // Capture console logs
  86 |     const logs: string[] = [];
  87 |     page.on('console', msg => logs.push(msg.text()));
  88 |
  89 |     await page.waitForTimeout(2000);
  90 |
  91 |     console.log('=== CONSOLE LOGS ===');
  92 |     logs.forEach(log => console.log('log:', log));
  93 |
  94 |     console.log('=== AUTHENTICATED USER DEBUG COMPLETE ===');
  95 |   });
  96 | });
  97 |
```