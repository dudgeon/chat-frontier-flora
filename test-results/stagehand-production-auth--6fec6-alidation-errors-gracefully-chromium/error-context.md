# Test info

- Name: Stagehand Production Authentication >> should handle form validation errors gracefully
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-production-auth.spec.ts:182:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-production-auth.spec.ts:218:49
```

# Page snapshot

```yaml
- text: Chat Frontier Flora Create your account Create Account Full Name *
- textbox "Enter your first and last name"
- text: Email Address *
- textbox "Enter your email address": invalid-email
- text: Please enter a valid email address Password *
- textbox "Enter your password"
- text: Confirm Password *
- textbox "Confirm your password": StrongPassword123!@#
- text: "* I verify that I am 18 years of age or older * I agree to the Terms of Service and Privacy Policy * I consent to the use of my data for development and improvement purposes This includes anonymized usage analytics, feature testing, and service improvements. Your personal information will be protected according to our Privacy Policy. Create Account Already have an account? Sign In"
- iframe
```

# Test source

```ts
  118 |     expect(signupResult.wasSuccessful).toBe(true);
  119 |     expect(signupResult.isOnChatPage || signupResult.isOnDashboard).toBe(true);
  120 |     expect(signupResult.isStillOnSignup).toBe(false);
  121 |     expect(signupResult.loadingComplete).toBe(true);
  122 |     expect(signupResult.errorMessages).toHaveLength(0);
  123 |
  124 |     // Test the authenticated user interface
  125 |     const authenticatedState = await page.extract({
  126 |       instruction: 'analyze the authenticated user interface',
  127 |       schema: z.object({
  128 |         userIsLoggedIn: z.boolean().describe('whether the user appears to be logged in'),
  129 |         userEmail: z.string().describe('the user email displayed if visible'),
  130 |         hasProfileMenu: z.boolean().describe('whether a profile menu or user menu is visible'),
  131 |         hasLogoutOption: z.boolean().describe('whether a logout option is available'),
  132 |         mainContent: z.string().describe('description of the main page content'),
  133 |       }),
  134 |     });
  135 |
  136 |     console.log('👤 Authenticated state:', authenticatedState);
  137 |     expect(authenticatedState.userIsLoggedIn).toBe(true);
  138 |     expect(authenticatedState.hasProfileMenu || authenticatedState.hasLogoutOption).toBe(true);
  139 |
  140 |     // Test profile menu functionality
  141 |     if (authenticatedState.hasProfileMenu) {
  142 |       console.log('🔍 Testing profile menu...');
  143 |       await page.act('click on the profile menu or user menu');
  144 |
  145 |       const profileMenuState = await page.extract({
  146 |         instruction: 'analyze the opened profile menu',
  147 |         schema: z.object({
  148 |           isMenuOpen: z.boolean().describe('whether the profile menu is now open'),
  149 |           displayedEmail: z.string().describe('the email address shown in the menu'),
  150 |           hasLogoutButton: z.boolean().describe('whether a logout button is visible'),
  151 |           menuOptions: z.array(z.string()).describe('list of menu options available'),
  152 |         }),
  153 |       });
  154 |
  155 |       console.log('📋 Profile menu state:', profileMenuState);
  156 |       expect(profileMenuState.isMenuOpen).toBe(true);
  157 |       expect(profileMenuState.hasLogoutButton).toBe(true);
  158 |
  159 |       // Test logout functionality
  160 |       console.log('🚪 Testing logout...');
  161 |       await page.act('click the logout button');
  162 |
  163 |       const logoutResult = await page.extract({
  164 |         instruction: 'verify the logout was successful',
  165 |         schema: z.object({
  166 |           isLoggedOut: z.boolean().describe('whether the user appears to be logged out'),
  167 |           isBackOnSignupPage: z.boolean().describe('whether back on the signup/login page'),
  168 |           signupFormVisible: z.boolean().describe('whether the signup form is visible again'),
  169 |           currentUrl: z.string().describe('the current page URL'),
  170 |         }),
  171 |       });
  172 |
  173 |       console.log('✅ Logout result:', logoutResult);
  174 |       expect(logoutResult.isLoggedOut).toBe(true);
  175 |       expect(logoutResult.isBackOnSignupPage).toBe(true);
  176 |       expect(logoutResult.signupFormVisible).toBe(true);
  177 |     }
  178 |
  179 |     console.log('🎉 Complete authentication flow test passed!');
  180 |   });
  181 |
  182 |   test('should handle form validation errors gracefully', async () => {
  183 |     console.log('🔍 Testing form validation with Stagehand...');
  184 |
  185 |     const page = stagehand.page;
  186 |     await page.goto(TEST_URLS.preview);
  187 |
  188 |     // Test with invalid email
  189 |     await page.act('fill in the email field with "invalid-email"');
  190 |     await page.act('fill in the password field with "weak"');
  191 |
  192 |     const validationState = await page.extract({
  193 |       instruction: 'check for validation errors',
  194 |       schema: z.object({
  195 |         emailError: z.string().describe('any email validation error message'),
  196 |         passwordError: z.string().describe('any password validation error message'),
  197 |         submitButtonEnabled: z.boolean().describe('whether submit button is enabled'),
  198 |         overallFormValid: z.boolean().describe('whether the form appears valid overall'),
  199 |       }),
  200 |     });
  201 |
  202 |     console.log('⚠️ Validation state:', validationState);
  203 |     expect(validationState.overallFormValid).toBe(false);
  204 |     expect(validationState.submitButtonEnabled).toBe(false);
  205 |
  206 |     // Test with strong password
  207 |     await page.act('clear the password field and enter "StrongPassword123!@#"');
  208 |
  209 |     const improvedValidation = await page.extract({
  210 |       instruction: 'check validation after password improvement',
  211 |       schema: z.object({
  212 |         passwordStrength: z.string().describe('password strength indicator'),
  213 |         passwordAccepted: z.boolean().describe('whether password is now acceptable'),
  214 |       }),
  215 |     });
  216 |
  217 |     console.log('💪 Improved validation:', improvedValidation);
> 218 |     expect(improvedValidation.passwordAccepted).toBe(true);
      |                                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  219 |   });
  220 |
  221 |   test('should work on production deployment', async () => {
  222 |     console.log('🌐 Testing production deployment with Stagehand...');
  223 |
  224 |     const page = stagehand.page;
  225 |     await page.goto(TEST_URLS.production);
  226 |
  227 |     // Verify production site loads correctly
  228 |     const productionState = await page.extract({
  229 |       instruction: 'verify the production site is working',
  230 |       schema: z.object({
  231 |         siteLoaded: z.boolean().describe('whether the site loaded successfully'),
  232 |         hasSignupForm: z.boolean().describe('whether signup form is available'),
  233 |         isResponsive: z.boolean().describe('whether the page appears responsive'),
  234 |         noErrors: z.boolean().describe('whether there are no visible errors'),
  235 |       }),
  236 |     });
  237 |
  238 |     console.log('🏭 Production state:', productionState);
  239 |     expect(productionState.siteLoaded).toBe(true);
  240 |     expect(productionState.hasSignupForm).toBe(true);
  241 |     expect(productionState.noErrors).toBe(true);
  242 |
  243 |     console.log('✅ Production site verification passed!');
  244 |   });
  245 | });
  246 |
```