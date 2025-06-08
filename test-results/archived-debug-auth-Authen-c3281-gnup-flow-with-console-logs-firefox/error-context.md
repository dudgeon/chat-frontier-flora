# Test info

- Name: Authentication Debug >> debug signup flow with console logs
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/debug-auth.spec.ts:4:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="age-verification-checkbox"]')

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/debug-auth.spec.ts:54:16
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name": Test User
- text: Email Address *
- textbox "Enter your email address": test1749408782170@example.com
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
   3 | test.describe('Authentication Debug', () => {
   4 |   test('debug signup flow with console logs', async ({ page }) => {
   5 |     // Capture console logs
   6 |     const consoleLogs: string[] = [];
   7 |     page.on('console', msg => {
   8 |       consoleLogs.push(`${msg.type()}: ${msg.text()}`);
   9 |     });
   10 |
   11 |     // Capture network requests
   12 |     const networkRequests: string[] = [];
   13 |     page.on('request', request => {
   14 |       networkRequests.push(`${request.method()} ${request.url()}`);
   15 |     });
   16 |
   17 |     // Capture network responses
   18 |     const networkResponses: string[] = [];
   19 |     page.on('response', response => {
   20 |       networkResponses.push(`${response.status()} ${response.url()}`);
   21 |     });
   22 |
   23 |     console.log('=== STARTING DEBUG TEST ===');
   24 |
   25 |     // Navigate to the app
   26 |     await page.goto('/');
   27 |     console.log('1. Navigated to homepage');
   28 |
   29 |     // Wait for the page to load
   30 |     await page.waitForLoadState('networkidle');
   31 |     console.log('2. Page loaded');
   32 |
   33 |     // Check if signup form is visible
   34 |     const signupForm = page.locator('[data-testid="submit-button"]');
   35 |     await expect(signupForm).toBeVisible();
   36 |     console.log('3. Signup form is visible');
   37 |
   38 |     // Fill out the form
   39 |     await page.fill('[data-testid="full-name"]', 'Test User');
   40 |     console.log('4. Filled full name');
   41 |
   42 |     // Use a unique email to avoid "user already registered" error
   43 |     const uniqueEmail = `test${Date.now()}@example.com`;
   44 |     await page.fill('[data-testid="email"]', uniqueEmail);
   45 |     console.log(`5. Filled email: ${uniqueEmail}`);
   46 |
   47 |     await page.fill('[data-testid="password"]', 'TestPassword123!');
   48 |     console.log('6. Filled password');
   49 |
   50 |     await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
   51 |     console.log('7. Filled confirm password');
   52 |
   53 |     // Check the checkboxes
>  54 |     await page.click('[data-testid="age-verification-checkbox"]');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
   55 |     console.log('8. Clicked age verification');
   56 |
   57 |     await page.click('[data-testid="terms-checkbox"]');
   58 |     console.log('9. Clicked terms');
   59 |
   60 |     await page.click('[data-testid="development-consent-checkbox"]');
   61 |     console.log('10. Clicked development consent');
   62 |
   63 |     // Check if submit button is enabled
   64 |     const submitButton = page.locator('[data-testid="submit-button"]');
   65 |     const isDisabled = await submitButton.getAttribute('disabled');
   66 |     console.log(`11. Submit button disabled: ${isDisabled !== null}`);
   67 |
   68 |     // Click submit
   69 |     console.log('12. About to click submit button');
   70 |     await submitButton.click();
   71 |     console.log('13. Clicked submit button');
   72 |
   73 |     // Wait a bit to see what happens
   74 |     await page.waitForTimeout(5000);
   75 |     console.log('14. Waited 5 seconds');
   76 |
   77 |     // Check current URL
   78 |     const currentUrl = page.url();
   79 |     console.log(`15. Current URL: ${currentUrl}`);
   80 |
   81 |     // Print all console logs
   82 |     console.log('\n=== CONSOLE LOGS ===');
   83 |     consoleLogs.forEach(log => console.log(log));
   84 |
   85 |     // Print network requests
   86 |     console.log('\n=== NETWORK REQUESTS ===');
   87 |     networkRequests.forEach(req => console.log(req));
   88 |
   89 |     // Print network responses
   90 |     console.log('\n=== NETWORK RESPONSES ===');
   91 |     networkResponses.forEach(res => console.log(res));
   92 |
   93 |     // Check if there are any error messages on the page
   94 |     const errorMessages = await page.locator('[data-testid*="error"], .error, [class*="error"]').allTextContents();
   95 |     console.log('\n=== ERROR MESSAGES ON PAGE ===');
   96 |     errorMessages.forEach(error => console.log(error));
   97 |
   98 |     console.log('\n=== DEBUG TEST COMPLETE ===');
   99 |
  100 |     // Check if user was redirected to chat (success case)
  101 |     if (currentUrl.includes('/chat')) {
  102 |       console.log('✅ SUCCESS: User was redirected to /chat');
  103 |     } else {
  104 |       console.log('❌ ISSUE: User was not redirected to /chat');
  105 |     }
  106 |   });
  107 | });
  108 |
```