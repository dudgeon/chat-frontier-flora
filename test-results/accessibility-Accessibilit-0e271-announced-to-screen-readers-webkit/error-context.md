# Test info

- Name: Accessibility @accessibility >> error messages should be announced to screen readers
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/accessibility.spec.ts:72:7

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first()
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
    57 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/accessibility.spec.ts:84:24
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name"
- text: Email Address *
- textbox "Enter your email address": invalid-email
- text: Password *
- textbox "Enter your password"
- text: Confirm Password *
- textbox "Confirm your password"
- checkbox "I verify that I am 18 years of age or older"
- checkbox "I consent to the use of my data for development and improvement purposes"
- button "Submit button disabled. Please fix all form errors" [disabled]: Complete Form to Continue
- text: "Please fix all form errors Form Valid: No Form Touched: No Form Completed: No Completion: 1/6 (17%) Submit Button: disabled - Disabled Disabled Reason: Please fix all form errors Already have an account? Sign In"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import AxeBuilder from '@axe-core/playwright';
   3 |
   4 | /**
   5 |  * ♿ ACCESSIBILITY TESTS
   6 |  *
   7 |  * Dedicated tests for accessibility compliance using axe-core
   8 |  * Run with: npm run test:a11y
   9 |  */
  10 |
  11 | test.describe('Accessibility @accessibility', () => {
  12 |   test.beforeEach(async ({ page }) => {
  13 |     await page.goto('/');
  14 |   });
  15 |
  16 |   test('homepage should be accessible', async ({ page }) => {
  17 |     const accessibilityScanResults = await new AxeBuilder({ page })
  18 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  19 |       .analyze();
  20 |
  21 |     expect(accessibilityScanResults.violations).toEqual([]);
  22 |   });
  23 |
  24 |   test('sign up form should be accessible', async ({ page }) => {
  25 |     // Navigate to sign up form
  26 |     const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
  27 |
  28 |     if (await signUpButton.isVisible()) {
  29 |       await signUpButton.click();
  30 |     }
  31 |
  32 |     const accessibilityScanResults = await new AxeBuilder({ page })
  33 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  34 |       .analyze();
  35 |
  36 |     expect(accessibilityScanResults.violations).toEqual([]);
  37 |   });
  38 |
  39 |   test('login form should be accessible', async ({ page }) => {
  40 |     // Navigate to login form
  41 |     const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();
  42 |
  43 |     if (await loginButton.isVisible()) {
  44 |       await loginButton.click();
  45 |     }
  46 |
  47 |     const accessibilityScanResults = await new AxeBuilder({ page })
  48 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  49 |       .analyze();
  50 |
  51 |     expect(accessibilityScanResults.violations).toEqual([]);
  52 |   });
  53 |
  54 |   test('forms should be keyboard navigable', async ({ page }) => {
  55 |     // Navigate to sign up form
  56 |     const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
  57 |
  58 |     if (await signUpButton.isVisible()) {
  59 |       await signUpButton.click();
  60 |     }
  61 |
  62 |     // Test keyboard navigation
  63 |     await page.keyboard.press('Tab');
  64 |     await page.keyboard.press('Tab');
  65 |     await page.keyboard.press('Tab');
  66 |
  67 |     // Should be able to navigate through form elements
  68 |     const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  69 |     expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  70 |   });
  71 |
  72 |   test('error messages should be announced to screen readers', async ({ page }) => {
  73 |     // Navigate to sign up form
  74 |     const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
  75 |
  76 |     if (await signUpButton.isVisible()) {
  77 |       await signUpButton.click();
  78 |     }
  79 |
  80 |     // Submit form with invalid data to trigger errors
  81 |     await page.fill('[data-testid="email"], input[type="email"]', 'invalid-email');
  82 |
  83 |     const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first();
> 84 |     await submitButton.click();
     |                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  85 |
  86 |     // Check that error messages have proper ARIA attributes
  87 |     const errorMessage = page.locator('text=/invalid|error|required/i').first();
  88 |
  89 |     if (await errorMessage.isVisible()) {
  90 |       const ariaLive = await errorMessage.getAttribute('aria-live');
  91 |       const role = await errorMessage.getAttribute('role');
  92 |
  93 |       // Error messages should be announced (aria-live) or have alert role
  94 |       expect(ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert').toBeTruthy();
  95 |     }
  96 |   });
  97 | });
  98 |
```