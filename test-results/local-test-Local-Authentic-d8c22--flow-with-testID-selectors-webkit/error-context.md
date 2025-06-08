# Test info

- Name: Local Authentication Flow >> should complete signup flow with testID selectors
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/local-test.spec.ts:35:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="submit-button"]')
    - locator resolved to <button disabled role="button" tabindex="-1" type="button" aria-disabled="true" data-testid="submit-button" aria-label="Submit button disabled. Please fix all form errors" class="css-view-175oi2r r-transitionProperty-1i6wzkk r-userSelect-lrvibr r-alignItems-1awozwy r-borderRadius-1xfd6ze r-marginTop-knv0ih r-padding-nsbfu8 r-backgroundColor-7klgxt r-pointerEvents-12vffkv">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    56 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/local-test.spec.ts:59:16
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name": Local Test User 1749408985626
- text: Email Address *
- textbox "Enter your email address": test-local-1749408985626@example.com
- text: Password *
- textbox "Enter your password": TestPassword123!
- 'progressbar "Password strength indicator: Strong"':
  - text: Password Strength Strong
  - progressbar "Password strength progress bar"
  - text: 96% strength
- list "Password requirements list": ✓ At least 8 characters ✓ At least one uppercase letter ✓ At least one lowercase letter ✓ At least one number ✓ At least one special character (!@#$%^&*)
- text: ✓ All requirements met Confirm Password *
- textbox "Confirm your password"
- checkbox "I verify that I am 18 years of age or older" [checked]
- checkbox "I consent to the use of my data for development and improvement purposes" [checked]
- button "Submit button disabled. Please fix all form errors" [disabled]: Complete Form to Continue
- text: "Please fix all form errors Form Valid: No Form Touched: Yes Form Completed: No Completion: 5/6 (83%) Submit Button: disabled - Disabled Disabled Reason: Please fix all form errors Already have an account? Sign In"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | /**
   4 |  * 🏠 LOCAL AUTHENTICATION FLOW TEST
   5 |  *
   6 |  * Tests the authentication flow on localhost development server.
   7 |  * Verifies that our testID changes work correctly.
   8 |  */
   9 |
  10 | const LOCAL_URL = 'http://localhost:19006';
  11 |
  12 | test.describe('Local Authentication Flow', () => {
  13 |   test.beforeEach(async ({ page }) => {
  14 |     // Navigate to local site
  15 |     await page.goto(LOCAL_URL);
  16 |   });
  17 |
  18 |   test('should load homepage quickly and show signup form', async ({ page }) => {
  19 |     console.log('🌐 Testing local homepage load...');
  20 |
  21 |     // Wait for page to load
  22 |     await page.waitForLoadState('networkidle');
  23 |
  24 |     // Should show the signup form (unauthenticated state)
  25 |     await expect(page.locator('[data-testid="signup-form"]')).toBeVisible({ timeout: 10000 });
  26 |
  27 |     // Check that we have the optimized form fields
  28 |     await expect(page.locator('[data-testid="full-name"]')).toBeVisible();
  29 |     await expect(page.locator('[data-testid="email"]')).toBeVisible();
  30 |     await expect(page.locator('[data-testid="password"]')).toBeVisible();
  31 |
  32 |     console.log('✅ Homepage loaded successfully with signup form');
  33 |   });
  34 |
  35 |   test('should complete signup flow with testID selectors', async ({ page }) => {
  36 |     console.log('🔐 Testing signup flow with testID selectors...');
  37 |
  38 |     // Wait for signup form to be ready
  39 |     await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });
  40 |
  41 |     // Generate unique test user
  42 |     const timestamp = Date.now();
  43 |     const testEmail = `test-local-${timestamp}@example.com`;
  44 |     const testPassword = 'TestPassword123!';
  45 |     const testName = `Local Test User ${timestamp}`;
  46 |
  47 |     console.log(`📝 Creating test user: ${testEmail}`);
  48 |
  49 |     // Fill out the signup form using testID selectors
  50 |     await page.fill('[data-testid="full-name"]', testName);
  51 |     await page.fill('[data-testid="email"]', testEmail);
  52 |     await page.fill('[data-testid="password"]', testPassword);
  53 |
  54 |     // Check age verification and development consent using testID
  55 |     await page.check('[data-testid="age-verification"]');
  56 |     await page.check('[data-testid="development-consent"]');
  57 |
  58 |     // Submit the form
> 59 |     await page.click('[data-testid="submit-button"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  60 |
  61 |     // Wait for redirect to chat page
  62 |     await page.waitForURL('**/chat', { timeout: 15000 });
  63 |
  64 |     console.log('✅ Signup successful, redirected to chat page');
  65 |
  66 |     // Verify we're on the chat page
  67 |     await expect(page).toHaveURL(/.*\/chat/);
  68 |
  69 |     // Wait for chat page to fully load
  70 |     await page.waitForSelector('[data-testid="chat-page"]', { timeout: 10000 });
  71 |
  72 |     // Verify the profile menu is accessible
  73 |     const profileMenuButton = page.locator('[data-testid="profile-menu-button"]');
  74 |     await expect(profileMenuButton).toBeVisible({ timeout: 5000 });
  75 |
  76 |     console.log('✅ Chat page loaded successfully with profile menu visible');
  77 |   });
  78 | });
  79 |
```