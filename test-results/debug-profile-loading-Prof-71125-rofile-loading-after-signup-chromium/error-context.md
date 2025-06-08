# Test info

- Name: Profile Loading Debug >> debug profile loading after signup
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/debug-profile-loading.spec.ts:4:7

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="full-name"]')

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/debug-profile-loading.spec.ts:27:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Profile Loading Debug', () => {
   4 |   test('debug profile loading after signup', async ({ page }) => {
   5 |     console.log('=== STARTING PROFILE LOADING DEBUG ===');
   6 |
   7 |     // Capture all console logs with timestamps
   8 |     const logs: { time: number, text: string }[] = [];
   9 |     page.on('console', msg => {
  10 |       const text = msg.text();
  11 |       const time = Date.now();
  12 |       logs.push({ time, text });
  13 |       console.log(`[${new Date(time).toISOString()}] BROWSER:`, text);
  14 |     });
  15 |
  16 |     // Capture errors
  17 |     page.on('pageerror', error => {
  18 |       console.log('PAGE ERROR:', error.message);
  19 |     });
  20 |
  21 |     // Navigate and sign up
  22 |     await page.goto('http://localhost:19006/');
  23 |     await page.waitForLoadState('networkidle');
  24 |
  25 |     // Fill signup form
  26 |     const email = `test${Date.now()}@example.com`;
> 27 |     await page.fill('[data-testid="full-name"]', 'Test User');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  28 |     await page.fill('[data-testid="email"]', email);
  29 |     await page.fill('[data-testid="password"]', 'TestPassword123!');
  30 |     await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
  31 |     await page.click('[data-testid="age-verification-checkbox"]');
  32 |     await page.click('[data-testid="terms-checkbox"]');
  33 |     await page.click('[data-testid="development-consent-checkbox"]');
  34 |
  35 |     console.log('=== SUBMITTING SIGNUP ===');
  36 |     await page.click('[data-testid="submit-button"]');
  37 |
  38 |     // Wait for redirect
  39 |     await page.waitForURL('**/chat', { timeout: 10000 });
  40 |     console.log('=== REDIRECTED TO /chat ===');
  41 |
  42 |     // Wait and capture what happens during profile loading
  43 |     console.log('=== WAITING FOR PROFILE LOADING ===');
  44 |     await page.waitForTimeout(10000); // Wait 10 seconds to see profile loading
  45 |
  46 |     // Check final state
  47 |     const bodyText = await page.textContent('body');
  48 |     const isStillLoading = bodyText?.includes('Loading');
  49 |     const hasChat = await page.locator('[data-testid="chat-page"]').count();
  50 |     const hasProfileMenu = await page.locator('[data-testid="profile-menu-button"]').count();
  51 |
  52 |     console.log('=== FINAL STATE ===');
  53 |     console.log('Still loading:', isStillLoading);
  54 |     console.log('Chat elements:', hasChat);
  55 |     console.log('Profile menu:', hasProfileMenu);
  56 |     console.log('Body text preview:', bodyText?.substring(0, 200));
  57 |
  58 |     // Filter and show profile-related logs
  59 |     console.log('=== PROFILE-RELATED LOGS ===');
  60 |     const profileLogs = logs.filter(log =>
  61 |       log.text.includes('profile') ||
  62 |       log.text.includes('Profile') ||
  63 |       log.text.includes('PGRST') ||
  64 |       log.text.includes('Error') ||
  65 |       log.text.includes('loading') ||
  66 |       log.text.includes('Loading')
  67 |     );
  68 |
  69 |     profileLogs.forEach((log, i) => {
  70 |       console.log(`${i + 1}. [${new Date(log.time).toISOString()}] ${log.text}`);
  71 |     });
  72 |   });
  73 | });
  74 |
```