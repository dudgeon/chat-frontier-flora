# Test info

- Name: NativeWind Signup Form Validation >> navigation between forms should work
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/signup-nativewind-validation.spec.ts:158:7

# Error details

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="login-form"]') to be visible

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/signup-nativewind-validation.spec.ts:161:16
```

# Page snapshot

```yaml
- text: Welcome Back Email Address
- textbox "Enter your email address"
- text: Password
- textbox "Enter your password"
- text: Show Remember me Forgot password? Sign In Don't have an account? Sign Up
```

# Test source

```ts
   61 |     // When all requirements are met, validation component should hide
   62 |     await expect(page.locator('[data-testid="password-validation"]')).not.toBeVisible();
   63 |   });
   64 |
   65 |   test('form field validation should work correctly', async ({ page }) => {
   66 |     // Test email validation
   67 |     await page.fill('[data-testid="email"]', 'invalid-email');
   68 |     await page.locator('[data-testid="email"]').blur();
   69 |     
   70 |     // Should show email validation error
   71 |     await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
   72 |
   73 |     // Fix email
   74 |     await page.fill('[data-testid="email"]', 'valid@email.com');
   75 |     await page.locator('[data-testid="email"]').blur();
   76 |     await expect(page.locator('text=Please enter a valid email address')).not.toBeVisible();
   77 |
   78 |     // Test password confirmation
   79 |     await page.fill('[data-testid="password"]', 'ValidPass123!');
   80 |     await page.fill('[data-testid="confirm-password"]', 'DifferentPass123!');
   81 |     await page.locator('[data-testid="confirm-password"]').blur();
   82 |     
   83 |     await expect(page.locator('text=Passwords do not match')).toBeVisible();
   84 |
   85 |     // Fix password confirmation
   86 |     await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
   87 |     await page.locator('[data-testid="confirm-password"]').blur();
   88 |     await expect(page.locator('text=Passwords do not match')).not.toBeVisible();
   89 |   });
   90 |
   91 |   test('keyboard navigation should work between fields', async ({ page }) => {
   92 |     // Start at full name field
   93 |     await page.focus('[data-testid="full-name"]');
   94 |     await page.fill('[data-testid="full-name"]', 'John Doe');
   95 |     
   96 |     // Press Enter to move to email field
   97 |     await page.press('[data-testid="full-name"]', 'Enter');
   98 |     await expect(page.locator('[data-testid="email"]')).toBeFocused();
   99 |     
  100 |     await page.fill('[data-testid="email"]', 'john.doe@example.com');
  101 |     
  102 |     // Press Enter to move to password field
  103 |     await page.press('[data-testid="email"]', 'Enter');
  104 |     await expect(page.locator('[data-testid="password"]')).toBeFocused();
  105 |     
  106 |     await page.fill('[data-testid="password"]', 'ValidPass123!');
  107 |     
  108 |     // Press Enter to move to confirm password field
  109 |     await page.press('[data-testid="password"]', 'Enter');
  110 |     await expect(page.locator('[data-testid="confirm-password"]')).toBeFocused();
  111 |   });
  112 |
  113 |   test('password visibility toggles should work correctly', async ({ page }) => {
  114 |     // Fill password fields
  115 |     await page.fill('[data-testid="password"]', 'TestPassword123!');
  116 |     await page.fill('[data-testid="confirm-password"]', 'TestPassword123!');
  117 |
  118 |     // Initially, password fields should be hidden
  119 |     await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'password');
  120 |     await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'password');
  121 |
  122 |     // Click password toggle
  123 |     await page.click('[data-testid="password-toggle"]');
  124 |     await expect(page.locator('[data-testid="password-toggle"]:has-text("Hide")')).toBeVisible();
  125 |     await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'text');
  126 |
  127 |     // Click to hide again
  128 |     await page.click('[data-testid="password-toggle"]');
  129 |     await expect(page.locator('[data-testid="password-toggle"]:has-text("Show")')).toBeVisible();
  130 |     await expect(page.locator('[data-testid="password"]')).toHaveAttribute('type', 'password');
  131 |
  132 |     // Test confirm password toggle
  133 |     await page.click('[data-testid="confirm-password-toggle"]');
  134 |     await expect(page.locator('[data-testid="confirm-password-toggle"]:has-text("Hide")')).toBeVisible();
  135 |     await expect(page.locator('[data-testid="confirm-password"]')).toHaveAttribute('type', 'text');
  136 |   });
  137 |
  138 |   test('checkbox interactions should work correctly', async ({ page }) => {
  139 |     // These are custom TouchableOpacity checkboxes, not native checkboxes
  140 |     // Check for visual state instead
  141 |     
  142 |     // Click to check age verification
  143 |     await page.click('[data-testid="age-verification"]');
  144 |     // Should show checkmark
  145 |     await expect(page.locator('[data-testid="age-verification"] text=✓')).toBeVisible();
  146 |     
  147 |     // Click to check development consent
  148 |     await page.click('[data-testid="development-consent"]');
  149 |     // Should show checkmark
  150 |     await expect(page.locator('[data-testid="development-consent"] text=✓')).toBeVisible();
  151 |
  152 |     // Click to uncheck age verification
  153 |     await page.click('[data-testid="age-verification"]');
  154 |     // Checkmark should disappear
  155 |     await expect(page.locator('[data-testid="age-verification"] text=✓')).not.toBeVisible();
  156 |   });
  157 |
  158 |   test('navigation between forms should work', async ({ page }) => {
  159 |     // Click "Sign In" link to go to login
  160 |     await page.click('[data-testid="switch-to-login"]');
> 161 |     await page.waitForSelector('[data-testid="login-form"]');
      |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  162 |     await expect(page.url()).toContain('/login');
  163 |     
  164 |     // Click "Sign Up" link to go back to signup
  165 |     await page.click('[data-testid="switch-to-signup"]');
  166 |     await page.waitForSelector('[data-testid="signup-form"]');
  167 |     await expect(page.url()).toContain('/signup');
  168 |   });
  169 |
  170 |   test('NativeWind styling should be properly applied', async ({ page }) => {
  171 |     // Check that key elements have NativeWind classes applied
  172 |     
  173 |     // Main form container should have proper styling
  174 |     const formContainer = page.locator('[data-testid="signup-form"]').locator('..');
  175 |     await expect(formContainer).toHaveClass(/bg-white/);
  176 |     await expect(formContainer).toHaveClass(/rounded-xl/);
  177 |     
  178 |     // Submit button should have NativeWind classes
  179 |     const submitButton = page.locator('[data-testid="submit-button"]');
  180 |     await expect(submitButton).toHaveClass(/bg-blue-500/);
  181 |     await expect(submitButton).toHaveClass(/rounded-xl/);
  182 |     
  183 |     // Trigger password validation to test its styling
  184 |     await page.fill('[data-testid="password"]', 'a');
  185 |     const passwordValidation = page.locator('[data-testid="password-validation"]');
  186 |     await expect(passwordValidation).toBeVisible();
  187 |     await expect(passwordValidation).toHaveClass(/bg-white/);
  188 |     await expect(passwordValidation).toHaveClass(/border/);
  189 |     await expect(passwordValidation).toHaveClass(/rounded-lg/);
  190 |     
  191 |     // Navigation link should have proper styling
  192 |     const signInLink = page.locator('[data-testid="switch-to-login"]');
  193 |     await expect(signInLink).toHaveClass(/text-blue-600/);
  194 |   });
  195 |
  196 |   test('form validation errors should display correctly', async ({ page }) => {
  197 |     // Touch the form first to enable the submit button, then try to submit empty form
  198 |     await page.fill('[data-testid="full-name"]', ''); // Touch form to enable button
  199 |     await page.click('[data-testid="submit-button"]');
  200 |     
  201 |     // Should show required field errors
  202 |     await expect(page.locator('text=Full name is required')).toBeVisible();
  203 |     await expect(page.locator('text=Email is required')).toBeVisible();
  204 |     await expect(page.locator('text=Password is required')).toBeVisible();
  205 |     
  206 |     // Fill form but leave checkboxes unchecked
  207 |     await page.fill('[data-testid="full-name"]', 'John Doe');
  208 |     await page.fill('[data-testid="email"]', 'john.doe@example.com');
  209 |     await page.fill('[data-testid="password"]', 'ValidPass123!');
  210 |     await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
  211 |     
  212 |     // Try to submit without checkboxes
  213 |     await page.click('[data-testid="submit-button"]');
  214 |     
  215 |     // Should show checkbox validation errors
  216 |     await expect(page.locator('text=You must verify that you are 18 years of age or older')).toBeVisible();
  217 |     await expect(page.locator('text=You must consent to the use of your data for development purposes')).toBeVisible();
  218 |     
  219 |     // Check checkboxes
  220 |     await page.check('[data-testid="age-verification"]');
  221 |     await page.check('[data-testid="development-consent"]');
  222 |     
  223 |     // Errors should disappear
  224 |     await expect(page.locator('text=You must verify that you are 18 years of age or older')).not.toBeVisible();
  225 |     await expect(page.locator('text=You must consent to the use of your data for development purposes')).not.toBeVisible();
  226 |   });
  227 |
  228 |   test('submit button states should update correctly', async ({ page }) => {
  229 |     // Initially disabled until form is touched (requireTouched: true)
  230 |     await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
  231 |     await expect(page.locator('[data-testid="submit-button"]')).toContainText('Create Account');
  232 |     
  233 |     // Fill valid form completely - button should only be enabled when form is both touched AND valid
  234 |     await page.fill('[data-testid="full-name"]', 'John Doe');
  235 |     // Button still disabled because form is touched but not fully valid yet
  236 |     await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
  237 |     
  238 |     await page.fill('[data-testid="email"]', 'john.doe.test@example.com');
  239 |     await page.fill('[data-testid="password"]', 'ValidPass123!');
  240 |     await page.fill('[data-testid="confirm-password"]', 'ValidPass123!');
  241 |     await page.click('[data-testid="age-verification"]');
  242 |     await page.click('[data-testid="development-consent"]');
  243 |     
  244 |     // Now button should be enabled (form is both touched and valid)
  245 |     await expect(page.locator('[data-testid="submit-button"]')).toContainText('Create Account');
  246 |     await expect(page.locator('[data-testid="submit-button"]')).toBeEnabled();
  247 |     
  248 |     // Click submit and verify loading state (if implemented)
  249 |     await page.click('[data-testid="submit-button"]');
  250 |     
  251 |     // May show loading state or remain disabled during submission
  252 |     // This will depend on the actual implementation
  253 |   });
  254 | });
```