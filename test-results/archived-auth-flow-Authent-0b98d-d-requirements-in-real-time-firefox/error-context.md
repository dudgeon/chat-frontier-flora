# Test info

- Name: Authentication Flow >> User Registration Flow >> should validate password requirements in real-time
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/auth-flow.spec.ts:93:9

# Error details

```
Error: browserContext._wrapApiCall: Test ended.
Browser logs:

<launching> /Users/geoffreydudgeon/Library/Caches/ms-playwright/firefox-1482/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/6k/vvnfwvqs19l7cs45l8m3tx7c0000gn/T/playwright_firefoxdev_profile-lXDZrP -juggler-pipe -silent
<launched> pid=62943
[pid=62943][err] *** You are running in headless mode.
[pid=62943][err] JavaScript warning: resource://services-settings/Utils.sys.mjs, line 116: unreachable code after return statement
[pid=62943][out] console.warn: services.settings: Ignoring preference override of remote settings server
[pid=62943][out] console.warn: services.settings: Allow by setting MOZ_REMOTE_SETTINGS_DEVTOOLS=1 in the environment
[pid=62943][out] 
[pid=62943][out] Juggler listening to the pipe
[pid=62943] <gracefully close start>
[pid=62943][out] Crash Annotation GraphicsCriticalError: |[0][GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt (t=2.125) [GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import AxeBuilder from '@axe-core/playwright';
   3 | import { AuthHelpers, TEST_USERS } from './helpers/auth-helpers';
   4 |
   5 | /**
   6 |  * 🎭 AUTHENTICATION FLOW E2E TESTS
   7 |  *
   8 |  * Comprehensive end-to-end testing of authentication flows including:
   9 |  * - User registration with validation
   10 |  * - Login/logout functionality
   11 |  * - Role-based access control
   12 |  * - Form validation and error handling
   13 |  * - Accessibility compliance
   14 |  * - Mobile responsiveness
   15 |  */
   16 |
   17 | test.describe('Authentication Flow', () => {
   18 |   test.beforeEach(async ({ page }) => {
   19 |     // Navigate to the app
   20 |     await page.goto('/');
   21 |   });
   22 |
   23 |   test.describe('Initial App State', () => {
   24 |     test('should load the app and show authentication UI', async ({ page }) => {
   25 |       // Wait for the app to load
   26 |       await expect(page).toHaveTitle(/Chat Frontier Flora/);
   27 |
   28 |       // Should show some form of authentication UI
   29 |       // This will depend on your app's initial state
   30 |       await expect(page.locator('body')).toBeVisible();
   31 |     });
   32 |
   33 |     test('should be accessible', async ({ page }) => {
   34 |       const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
   35 |       expect(accessibilityScanResults.violations).toEqual([]);
   36 |     });
   37 |   });
   38 |
   39 |   test.describe('User Registration Flow', () => {
   40 |     test('should successfully register a new user', async ({ page }) => {
   41 |       // Look for sign up form or navigation to it
   42 |       const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
   43 |
   44 |       if (await signUpButton.isVisible()) {
   45 |         await signUpButton.click();
   46 |       }
   47 |
   48 |       // Fill out registration form
   49 |       await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
   50 |       await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');
   51 |       await page.fill('[data-testid="confirm-password"], input[name="confirmPassword"]', 'Test123!@#');
   52 |       await page.fill('[data-testid="full-name"], input[name="fullName"]', 'Test User');
   53 |
   54 |       // Check required checkboxes
   55 |       const ageVerification = page.locator('[data-testid="age-verification"], input[name="ageVerification"]');
   56 |       if (await ageVerification.isVisible()) {
   57 |         await ageVerification.check();
   58 |       }
   59 |
   60 |       const termsAgreement = page.locator('[data-testid="terms-agreement"], input[name="termsAgreed"]');
   61 |       if (await termsAgreement.isVisible()) {
   62 |         await termsAgreement.check();
   63 |       }
   64 |
   65 |       // Submit the form
   66 |       const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first();
   67 |       await submitButton.click();
   68 |
   69 |       // Should redirect or show success state
   70 |       // This will depend on your app's post-registration flow
   71 |       await expect(page).toHaveURL(/chat/, { timeout: 10000 });
   72 |     });
   73 |
   74 |     test('should show validation errors for invalid input', async ({ page }) => {
   75 |       // Navigate to sign up if needed
   76 |       const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
   77 |
   78 |       if (await signUpButton.isVisible()) {
   79 |         await signUpButton.click();
   80 |       }
   81 |
   82 |       // Try to submit with invalid data
   83 |       await page.fill('[data-testid="email"], input[type="email"]', 'invalid-email');
   84 |       await page.fill('[data-testid="password"], input[type="password"]', 'weak');
   85 |
   86 |       const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up")').first();
   87 |       await submitButton.click();
   88 |
   89 |       // Should show validation errors
   90 |       await expect(page.locator('text=/invalid|error|required/i')).toBeVisible({ timeout: 5000 });
   91 |     });
   92 |
>  93 |     test('should validate password requirements in real-time', async ({ page }) => {
      |         ^ Error: browserContext._wrapApiCall: Test ended.
   94 |       // Navigate to sign up if needed
   95 |       const signUpButton = page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();
   96 |
   97 |       if (await signUpButton.isVisible()) {
   98 |         await signUpButton.click();
   99 |       }
  100 |
  101 |       const passwordInput = page.locator('[data-testid="password"], input[type="password"]');
  102 |
  103 |       // Type a weak password
  104 |       await passwordInput.fill('weak');
  105 |
  106 |       // Should show password requirements
  107 |       await expect(page.locator('text=/uppercase|lowercase|number|special/i')).toBeVisible({ timeout: 3000 });
  108 |
  109 |       // Type a strong password
  110 |       await passwordInput.fill('Strong123!@#');
  111 |
  112 |       // Requirements should be satisfied (this depends on your UI implementation)
  113 |       // You might check for green checkmarks or hidden error messages
  114 |     });
  115 |   });
  116 |
  117 |   test.describe('User Login Flow', () => {
  118 |     test('should successfully log in existing user', async ({ page }) => {
  119 |       // Navigate to login if needed
  120 |       const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();
  121 |
  122 |       if (await loginButton.isVisible()) {
  123 |         await loginButton.click();
  124 |       }
  125 |
  126 |       // Fill login form
  127 |       await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
  128 |       await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');
  129 |
  130 |       // Submit login
  131 |       const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  132 |       await submitButton.click();
  133 |
  134 |       // Should redirect to authenticated area
  135 |       await expect(page).toHaveURL(/chat/, { timeout: 10000 });
  136 |     });
  137 |
  138 |     test('should show error for invalid credentials', async ({ page }) => {
  139 |       // Navigate to login if needed
  140 |       const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();
  141 |
  142 |       if (await loginButton.isVisible()) {
  143 |         await loginButton.click();
  144 |       }
  145 |
  146 |       // Fill with invalid credentials
  147 |       await page.fill('[data-testid="email"], input[type="email"]', 'wrong@example.com');
  148 |       await page.fill('[data-testid="password"], input[type="password"]', 'wrongpassword');
  149 |
  150 |       const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  151 |       await submitButton.click();
  152 |
  153 |       // Should show error message
  154 |       await expect(page.locator('text=/invalid|error|incorrect|failed/i')).toBeVisible({ timeout: 5000 });
  155 |     });
  156 |   });
  157 |
  158 |   test.describe('Role-Based Access Control', () => {
  159 |     test('should restrict access to protected routes when not authenticated', async ({ page }) => {
  160 |       // Try to access a protected route directly
  161 |       await page.goto('/chat');
  162 |
  163 |       // Should redirect to login or show access denied
  164 |       await expect(page).toHaveURL(/login|signin|auth/, { timeout: 5000 });
  165 |     });
  166 |
  167 |     test('should allow access to protected routes when authenticated', async ({ page }) => {
  168 |       // First, log in (this is a simplified version - you might want to use a helper function)
  169 |       await page.goto('/');
  170 |
  171 |       // Perform login flow
  172 |       const loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();
  173 |
  174 |       if (await loginButton.isVisible()) {
  175 |         await loginButton.click();
  176 |         await page.fill('[data-testid="email"], input[type="email"]', 'test@example.com');
  177 |         await page.fill('[data-testid="password"], input[type="password"]', 'Test123!@#');
  178 |
  179 |         const submitButton = page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  180 |         await submitButton.click();
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
```