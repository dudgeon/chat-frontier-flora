# Test info

- Name: Authentication Flow >> Role-Based Access Control >> should restrict access to protected routes when not authenticated
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/auth-flow.spec.ts:159:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected pattern: /login|signin|auth/
Received string:  "http://localhost:19006/"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en">…</html>
      - unexpected value "http://localhost:19006/"

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/archived/auth-flow.spec.ts:164:26
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
   93 |     test('should validate password requirements in real-time', async ({ page }) => {
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
> 164 |       await expect(page).toHaveURL(/login|signin|auth/, { timeout: 5000 });
      |                          ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
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
```