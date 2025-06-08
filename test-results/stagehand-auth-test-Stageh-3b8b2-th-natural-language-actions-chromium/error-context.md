# Test info

- Name: Stagehand Authentication Flow >> should complete signup flow with natural language actions
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-auth-test.spec.ts:38:7

# Error details

```
StagehandDefaultError: 
Hey! We're sorry you ran into an error. 
If you need help, please open a Github issue or reach out to us on Slack: https://stagehand.dev/slack

Full error:
page.evaluate: Target page, context or browser has been closed
    at _StagehandPage.<anonymous> (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:3437:15)
    at rejected (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:73:29)
```

# Page snapshot

```yaml
- text: Chat Frontier Flora Create your account Create Account Full Name *
- textbox "Enter your first and last name": Stagehand Tester
- text: Email Address *
- textbox "Enter your email address": test-1749385342986@stagehand-demo.com
- text: Password *
- textbox "Enter your password": StagehandTest123!
- text: "Password StrengthStrong 98% strength Password Requirements:"
- img
- text: At least 8 characters
- img
- text: At least one uppercase letter
- img
- text: At least one lowercase letter
- img
- text: At least one number
- img
- text: At least one special character (!@#$%^&*)
- img
- text: Password meets all requirements Confirm Password *
- textbox "Confirm your password": StagehandTest123!
- text: "* I verify that I am 18 years of age or older * I agree to the Terms of Service and Privacy Policy * I consent to the use of my data for development and improvement purposes This includes anonymized usage analytics, feature testing, and service improvements. Your personal information will be protected according to our Privacy Policy. Create Account Already have an account? Sign In"
- iframe
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
   15 | const PREVIEW_URL = 'https://deploy-preview-2--frontier-family-flora.netlify.app';
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
>  38 |   test('should complete signup flow with natural language actions', async () => {
      |       ^ StagehandDefaultError: 
   39 |     console.log('🎭 Testing Stagehand-powered authentication flow...');
   40 |
   41 |     const page = stagehand.page;
   42 |
   43 |     // Navigate to the preview deployment
   44 |     await page.goto(PREVIEW_URL);
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
   99 |     expect(signupResult.isOnChatPage).toBe(true);
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
```