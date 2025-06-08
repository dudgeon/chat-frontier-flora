# Test info

- Name: Authentication Flow >> Visual Regression >> should match login form visual snapshot
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/auth-flow.spec.ts:273:9

# Error details

```
Error: expect(page).toHaveScreenshot(expected)

  1979 pixels (ratio 0.01 of all image pixels) are different.

Expected: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/auth-flow.spec.ts-snapshots/login-form-webkit-darwin.png
Received: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/test-results/archived-auth-flow-Authent-12113--login-form-visual-snapshot-webkit/login-form-actual.png
    Diff: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/test-results/archived-auth-flow-Authent-12113--login-form-visual-snapshot-webkit/login-form-diff.png

Call log:
  - expect.toHaveScreenshot(login-form.png) with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 1979 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 1979 pixels (ratio 0.01 of all image pixels) are different.

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/auth-flow.spec.ts:281:26
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
  181 |
  182 |         // Wait for authentication to complete
  183 |         await page.waitForURL(/chat/, { timeout: 10000 });
  184 |       }
  185 |
  186 |       // Now try to access protected route
  187 |       await page.goto('/chat');
  188 |
  189 |       // Should be able to access the chat page
  190 |       await expect(page).toHaveURL(/chat/);
  191 |     });
  192 |   });
  193 |
  194 |   test.describe('Logout Flow', () => {
  195 |     test('should successfully log out user', async ({ page }) => {
  196 |       // First log in
  197 |       await page.goto('/');
  198 |
  199 |       const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();
  200 |
  201 |       if (await loginButton.isVisible()) {
  202 |         await loginButton.click();
  203 |         await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
  204 |         await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');
  205 |
  206 |         const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  207 |         await submitButton.click();
  208 |
  209 |         await page.waitForURL(/chat/, { timeout: 10000 });
  210 |       }
  211 |
  212 |       // Now log out - first open the profile menu
  213 |       const profileMenuToggle = page.locator('[data-testid="profile-menu-toggle"]');
  214 |       await profileMenuToggle.click();
  215 |
  216 |       // Wait for profile menu to open and then click logout
  217 |       const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign Out")').first();
  218 |       await logoutButton.click();
  219 |
  220 |       // Should redirect to login or home page
  221 |       await expect(page).toHaveURL(/login|signin|auth|^\/$/, { timeout: 5000 });
  222 |
  223 |       // Should not be able to access protected routes
  224 |       await page.goto('/chat');
  225 |       await expect(page).toHaveURL(/login|signin|auth/, { timeout: 5000 });
  226 |     });
  227 |   });
  228 |
  229 |   test.describe('Mobile Responsiveness', () => {
  230 |     test('should work correctly on mobile devices', async ({ page, isMobile }) => {
  231 |       if (!isMobile) {
  232 |         test.skip();
  233 |         return;
  234 |       }
  235 |
  236 |       await page.goto('/');
  237 |
  238 |       // Check that the UI is responsive
  239 |       const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
  240 |
  241 |       if (await signUpButton.isVisible()) {
  242 |         await signUpButton.click();
  243 |
  244 |         // Form should be usable on mobile
  245 |         await page.fill('[data-testid="email"], input[type="email"]', 'mobile@example.com');
  246 |         await page.fill('[data-testid="password"], input[type="password"]', 'Mobile123!@#');
  247 |
  248 |         // Elements should be properly sized and accessible
  249 |         const emailInput = page.locator('[data-testid="email"], input[type="email"]');
  250 |         const boundingBox = await emailInput.boundingBox();
  251 |
  252 |         // Input should be large enough for mobile interaction (at least 44px height)
  253 |         expect(boundingBox?.height).toBeGreaterThan(40);
  254 |       }
  255 |     });
  256 |   });
  257 |
  258 |   test.describe('Visual Regression', () => {
  259 |     test('should match sign up form visual snapshot', async ({ page }) => {
  260 |       const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
  261 |
  262 |       if (await signUpButton.isVisible()) {
  263 |         await signUpButton.click();
  264 |       }
  265 |
  266 |       // Wait for form to be fully loaded
  267 |       await page.waitForLoadState('networkidle');
  268 |
  269 |       // Take screenshot for visual comparison
  270 |       await expect(page).toHaveScreenshot('sign-up-form.png');
  271 |     });
  272 |
  273 |     test('should match login form visual snapshot', async ({ page }) => {
  274 |       const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();
  275 |
  276 |       if (await loginButton.isVisible()) {
  277 |         await loginButton.click();
  278 |       }
  279 |
  280 |       await page.waitForLoadState('networkidle');
> 281 |       await expect(page).toHaveScreenshot('login-form.png');
      |                          ^ Error: expect(page).toHaveScreenshot(expected)
  282 |     });
  283 |   });
  284 | });
  285 |
```