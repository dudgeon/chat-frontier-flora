# Test info

- Name: Production Authentication Flow >> should show proper error handling for invalid credentials
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/production-test.spec.ts:167:7

# Error details

```
Error: locator.isDisabled: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button[type="submit"]')

    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/production-test.spec.ts:182:43
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name": Test User
- text: Email Address *
- textbox "Enter your email address": invalid-email
- text: Please enter a valid email address Password *
- textbox "Enter your password": weak
- text: Password StrengthWeak 16% strength ○At least 8 characters ○At least one uppercase letter ✓At least one lowercase letter ○At least one number ○At least one special character (!@#$%^&*) 1 of 5 requirements met Confirm Password *
- textbox "Confirm your password"
- checkbox "I verify that I am 18 years of age or older"
- checkbox "I consent to the use of my data for development and improvement purposes"
- text: Create Account Already have an account? Sign In
```

# Test source

```ts
   82 |     await expect(page).toHaveURL(/.*\/chat/);
   83 |
   84 |     // Wait for chat page to fully load
   85 |     await page.waitForSelector('[data-testid="chat-page"]', { timeout: 10000 });
   86 |
   87 |     // Verify the profile menu is accessible (not stuck in loading)
   88 |     const profileMenuButton = page.locator('[data-testid="profile-menu-button"]');
   89 |     await expect(profileMenuButton).toBeVisible({ timeout: 5000 });
   90 |
   91 |     console.log('✅ Chat page loaded successfully with profile menu visible');
   92 |
   93 |     // Test logout functionality
   94 |     await profileMenuButton.click();
   95 |
   96 |     // Wait for profile menu to open
   97 |     await page.waitForSelector('[data-testid="profile-menu"]', { timeout: 5000 });
   98 |
   99 |     // Click logout
  100 |     await page.click('[data-testid="logout-button"]');
  101 |
  102 |     // Should redirect back to homepage
  103 |     await page.waitForURL(PRODUCTION_URL, { timeout: 10000 });
  104 |
  105 |     // Should show signup form again
  106 |     await expect(page.locator('[data-testid="signup-form"]')).toBeVisible({ timeout: 5000 });
  107 |
  108 |     console.log('✅ Logout successful, redirected to homepage');
  109 |
  110 |     // Verify the total time was within optimized range (should be under 5 seconds)
  111 |     expect(totalTime).toBeLessThan(5000);
  112 |     console.log(`🚀 SUCCESS: Signup completed in ${totalTime}ms (under 5s target)`);
  113 |   });
  114 |
  115 |   test('should handle authentication state correctly after page reload', async ({ page }) => {
  116 |     console.log('🔄 Testing authentication state persistence after reload...');
  117 |
  118 |     // First, create a user and get to chat page
  119 |     await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });
  120 |
  121 |     const timestamp = Date.now();
  122 |     const testEmail = `test-reload-${timestamp}@example.com`;
  123 |     const testPassword = 'TestPassword123!';
  124 |     const testName = `Reload Test User ${timestamp}`;
  125 |
  126 |     // Quick signup
  127 |     await page.fill('[data-testid="full-name"]', testName);
  128 |     await page.fill('[data-testid="email"]', testEmail);
  129 |     await page.fill('[data-testid="password"]', testPassword);
  130 |     await page.check('[data-testid="age-verification"]');
  131 |     await page.check('[data-testid="development-consent"]');
  132 |     await page.click('button[type="submit"]');
  133 |
  134 |     // Wait for chat page
  135 |     await page.waitForURL('**/chat', { timeout: 10000 });
  136 |     await page.waitForSelector('[data-testid="chat-page"]', { timeout: 10000 });
  137 |
  138 |     console.log('✅ User created and on chat page');
  139 |
  140 |     // Now reload the page to test auth state persistence
  141 |     const reloadStartTime = Date.now();
  142 |     await page.reload();
  143 |
  144 |     // Should not get stuck in loading state
  145 |     const loadingElement = page.locator('text=Setting up your account...');
  146 |     if (await loadingElement.isVisible()) {
  147 |       // Should resolve quickly with optimized timeouts
  148 |       await loadingElement.waitFor({ state: 'hidden', timeout: 3000 });
  149 |     }
  150 |
  151 |     const reloadEndTime = Date.now();
  152 |     const reloadTime = reloadEndTime - reloadStartTime;
  153 |
  154 |     // Should still be on chat page and functional
  155 |     await expect(page).toHaveURL(/.*\/chat/);
  156 |     await expect(page.locator('[data-testid="chat-page"]')).toBeVisible({ timeout: 5000 });
  157 |     await expect(page.locator('[data-testid="profile-menu-button"]')).toBeVisible({ timeout: 5000 });
  158 |
  159 |     console.log(`⏱️ Page reload and auth restoration time: ${reloadTime}ms`);
  160 |     console.log('✅ Authentication state persisted correctly after reload');
  161 |
  162 |     // Verify reload time is within optimized range
  163 |     expect(reloadTime).toBeLessThan(4000);
  164 |     console.log(`🚀 SUCCESS: Auth state restored in ${reloadTime}ms (under 4s target)`);
  165 |   });
  166 |
  167 |   test('should show proper error handling for invalid credentials', async ({ page }) => {
  168 |     console.log('🔒 Testing error handling in production...');
  169 |
  170 |     // Wait for signup form
  171 |     await page.waitForSelector('[data-testid="signup-form"]', { timeout: 10000 });
  172 |
  173 |     // Try to signup with invalid email
  174 |     await page.fill('[data-testid="full-name"]', 'Test User');
  175 |     await page.fill('[data-testid="email"]', 'invalid-email');
  176 |     await page.fill('[data-testid="password"]', 'weak');
  177 |
  178 |     // Submit should be disabled or show validation errors
  179 |     const submitButton = page.locator('button[type="submit"]');
  180 |
  181 |     // Check if submit button is disabled due to validation
> 182 |     const isDisabled = await submitButton.isDisabled();
      |                                           ^ Error: locator.isDisabled: Test timeout of 30000ms exceeded.
  183 |     if (isDisabled) {
  184 |       console.log('✅ Submit button properly disabled for invalid input');
  185 |     } else {
  186 |       // If not disabled, clicking should show validation errors
  187 |       await submitButton.click();
  188 |
  189 |       // Should not redirect and should show errors
  190 |       await expect(page).toHaveURL(PRODUCTION_URL);
  191 |       console.log('✅ Form validation working correctly');
  192 |     }
  193 |   });
  194 | });
  195 |
```