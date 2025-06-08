# Test info

- Name: Stagehand Authentication Flow >> should complete signup flow with natural language actions
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-auth-test.spec.ts:38:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-auth-test.spec.ts:99:39
```

# Page snapshot

```yaml
- text: Frontier.Family ☰ Chat Feature Coming Soon! We're working hard to bring you an amazing chat experience. Welcome, test-1749408898927@stagehand-demo.com!
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { Stagehand } from '@browserbasehq/stagehand';
   3 | import { z } from 'zod';
   4 |
   5 | /**
   6 |  * 🎭 STAGEHAND AUTHENTICATION PROOF-OF-CONCEPT
   7 |  *
   8 |  * This test demonstrates how Stagehand would solve our authentication testing issues:
   9 |  * - No more brittle selectors that break when UI changes
   10 |  * - Natural language actions that adapt to page changes
   11 |  * - Structured data extraction with validation
   12 |  * - Self-healing tests that work even when elements move
   13 |  */
   14 |
   15 | // Use Playwright's baseURL which handles environment detection automatically
   16 |
   17 | test.describe('Stagehand Authentication Flow', () => {
   18 |   let stagehand: Stagehand;
   19 |
   20 |   test.beforeEach(async () => {
   21 |     // Initialize Stagehand with our OpenAI API key
   22 |     stagehand = new Stagehand({
   23 |       env: 'LOCAL',
   24 |       apiKey: process.env.OPENAI_API_KEY,
   25 |       modelName: 'gpt-4o-mini', // Cost-effective model for testing
   26 |       modelClientOptions: {
   27 |         apiKey: process.env.OPENAI_API_KEY,
   28 |       },
   29 |     });
   30 |
   31 |     await stagehand.init();
   32 |   });
   33 |
   34 |   test.afterEach(async () => {
   35 |     await stagehand.close();
   36 |   });
   37 |
   38 |   test('should complete signup flow with natural language actions', async () => {
   39 |     console.log('🎭 Testing Stagehand-powered authentication flow...');
   40 |
   41 |     const page = stagehand.page;
   42 |
   43 |     // Navigate to the base URL (automatically determined by Playwright config)
   44 |     await page.goto('/');
   45 |
   46 |     // Instead of brittle selectors, use natural language!
   47 |     await page.act('wait for the signup form to be visible');
   48 |
   49 |     // Generate test user data
   50 |     const testEmail = `test-${Date.now()}@stagehand-demo.com`;
   51 |     const testPassword = 'StagehandTest123!';
   52 |     const testName = 'Stagehand Tester';
   53 |
   54 |     console.log(`📝 Creating account for: ${testEmail}`);
   55 |
   56 |     // Fill out the form using natural language
   57 |     await page.act(`fill in the full name field with "${testName}"`);
   58 |     await page.act(`fill in the email field with "${testEmail}"`);
   59 |     await page.act(`fill in the password field with "${testPassword}"`);
   60 |     await page.act(`fill in the confirm password field with "${testPassword}"`);
   61 |
   62 |     // Handle checkboxes with natural language
   63 |     await page.act('check the age verification checkbox');
   64 |     await page.act('check the development consent checkbox');
   65 |
   66 |     // Extract form state to verify everything is filled correctly
   67 |     const formState = await page.extract({
   68 |       instruction: 'extract the current state of the signup form',
   69 |       schema: z.object({
   70 |         isFormValid: z.boolean().describe('whether the form appears to be completely filled and valid'),
   71 |         submitButtonEnabled: z.boolean().describe('whether the submit button is enabled'),
   72 |         passwordStrength: z.string().describe('the password strength indicator text if visible'),
   73 |       }),
   74 |     });
   75 |
   76 |     console.log('📊 Form state:', formState);
   77 |
   78 |     // Verify form is ready for submission
   79 |     expect(formState.isFormValid).toBe(true);
   80 |     expect(formState.submitButtonEnabled).toBe(true);
   81 |
   82 |     // Submit the form
   83 |     await page.act('click the create account button');
   84 |
   85 |     // Wait for and verify successful signup with natural language
   86 |     const signupResult = await page.extract({
   87 |       instruction: 'check if the user was successfully signed up and redirected',
   88 |       schema: z.object({
   89 |         isOnChatPage: z.boolean().describe('whether the user is now on the chat page'),
   90 |         currentUrl: z.string().describe('the current page URL'),
   91 |         userIsAuthenticated: z.boolean().describe('whether the user appears to be logged in'),
   92 |         loadingComplete: z.boolean().describe('whether any loading indicators have finished'),
   93 |       }),
   94 |     });
   95 |
   96 |     console.log('✅ Signup result:', signupResult);
   97 |
   98 |     // Verify successful authentication
>  99 |     expect(signupResult.isOnChatPage).toBe(true);
      |                                       ^ Error: expect(received).toBe(expected) // Object.is equality
  100 |     expect(signupResult.currentUrl).toContain('/chat');
  101 |     expect(signupResult.userIsAuthenticated).toBe(true);
  102 |     expect(signupResult.loadingComplete).toBe(true);
  103 |
  104 |     // Test the profile menu functionality
  105 |     await page.act('click the profile menu button in the top right');
  106 |
  107 |     const profileMenuState = await page.extract({
  108 |       instruction: 'extract information about the opened profile menu',
  109 |       schema: z.object({
  110 |         isMenuOpen: z.boolean().describe('whether the profile menu is open'),
  111 |         userEmail: z.string().describe('the user email displayed in the menu'),
  112 |         hasLogoutButton: z.boolean().describe('whether a logout button is visible'),
  113 |       }),
  114 |     });
  115 |
  116 |     console.log('👤 Profile menu state:', profileMenuState);
  117 |
  118 |     // Verify profile menu works
  119 |     expect(profileMenuState.isMenuOpen).toBe(true);
  120 |     expect(profileMenuState.userEmail).toBe(testEmail);
  121 |     expect(profileMenuState.hasLogoutButton).toBe(true);
  122 |
  123 |     // Test logout functionality
  124 |     await page.act('click the logout button');
  125 |
  126 |     const logoutResult = await page.extract({
  127 |       instruction: 'verify the user was logged out successfully',
  128 |       schema: z.object({
  129 |         isBackToSignup: z.boolean().describe('whether the user is back on the signup page'),
  130 |         isLoggedOut: z.boolean().describe('whether the user appears to be logged out'),
  131 |         signupFormVisible: z.boolean().describe('whether the signup form is visible again'),
  132 |       }),
  133 |     });
  134 |
  135 |     console.log('🚪 Logout result:', logoutResult);
  136 |
  137 |     // Verify successful logout
  138 |     expect(logoutResult.isBackToSignup).toBe(true);
  139 |     expect(logoutResult.isLoggedOut).toBe(true);
  140 |     expect(logoutResult.signupFormVisible).toBe(true);
  141 |
  142 |     console.log('🎉 Stagehand authentication flow test completed successfully!');
  143 |   });
  144 |
  145 |   test('should handle form validation with natural language', async () => {
  146 |     console.log('🔍 Testing form validation with Stagehand...');
  147 |
  148 |     const page = stagehand.page;
  149 |     await page.goto('/');
  150 |
  151 |     // Test password validation in real-time
  152 |     await page.act('fill in the password field with "weak"');
  153 |
  154 |     const passwordValidation = await page.extract({
  155 |       instruction: 'extract password validation feedback',
  156 |       schema: z.object({
  157 |         passwordStrength: z.string().describe('the password strength level shown'),
  158 |         validationMessages: z.array(z.string()).describe('any validation messages displayed'),
  159 |         isPasswordAcceptable: z.boolean().describe('whether the password meets requirements'),
  160 |       }),
  161 |     });
  162 |
  163 |     console.log('🔐 Password validation:', passwordValidation);
  164 |
  165 |     // Verify weak password is caught
  166 |     expect(passwordValidation.isPasswordAcceptable).toBe(false);
  167 |
  168 |     // Test with strong password
  169 |     await page.act('clear the password field and enter "StrongPassword123!"');
  170 |
  171 |     const strongPasswordValidation = await page.extract({
  172 |       instruction: 'extract updated password validation feedback',
  173 |       schema: z.object({
  174 |         passwordStrength: z.string().describe('the password strength level shown'),
  175 |         isPasswordAcceptable: z.boolean().describe('whether the password meets requirements'),
  176 |       }),
  177 |     });
  178 |
  179 |     console.log('💪 Strong password validation:', strongPasswordValidation);
  180 |
  181 |     // Verify strong password is accepted
  182 |     expect(strongPasswordValidation.isPasswordAcceptable).toBe(true);
  183 |   });
  184 | });
  185 |
```