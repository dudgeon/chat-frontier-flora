# Test info

- Name: Stagehand Production Authentication >> should complete full authentication flow on preview deployment
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-production-auth.spec.ts:39:7

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
- textbox "Enter your first and last name": Stagehand Test User 1749383485416
- text: Email Address *
- textbox "Enter your email address": stagehand-test-1749383485416@example.com
- text: Password *
- textbox "Enter your password": StagehandTest123!@#
- text: "Password StrengthStrong 100% strength Password Requirements:"
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
- textbox "Confirm your password": StagehandTest123!@#
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
   6 |  * 🎭 STAGEHAND PRODUCTION AUTHENTICATION TESTS
   7 |  *
   8 |  * This replaces our brittle Playwright tests with AI-powered, self-healing tests.
   9 |  * These tests use natural language and adapt to UI changes automatically.
   10 |  */
   11 |
   12 | // Test against both preview and production
   13 | const TEST_URLS = {
   14 |   preview: 'https://deploy-preview-2--frontier-family-flora.netlify.app',
   15 |   production: 'https://frontier-family-flora.netlify.app'
   16 | };
   17 |
   18 | test.describe('Stagehand Production Authentication', () => {
   19 |   let stagehand: Stagehand;
   20 |
   21 |   test.beforeEach(async () => {
   22 |     stagehand = new Stagehand({
   23 |       env: 'LOCAL',
   24 |       apiKey: process.env.OPENAI_API_KEY,
   25 |       modelName: 'gpt-4o-mini',
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
   38 |   // Test the preview deployment first
>  39 |   test('should complete full authentication flow on preview deployment', async () => {
      |       ^ StagehandDefaultError: 
   40 |     console.log('🎭 Testing complete authentication flow with Stagehand on preview...');
   41 |
   42 |     const page = stagehand.page;
   43 |     await page.goto(TEST_URLS.preview);
   44 |
   45 |     // Wait for page to load and verify we're on the signup page
   46 |     const pageState = await page.extract({
   47 |       instruction: 'analyze the current page state',
   48 |       schema: z.object({
   49 |         isSignupPage: z.boolean().describe('whether this appears to be a signup/login page'),
   50 |         hasSignupForm: z.boolean().describe('whether a signup form is visible'),
   51 |         pageTitle: z.string().describe('the page title or main heading'),
   52 |         isLoading: z.boolean().describe('whether the page is still loading'),
   53 |       }),
   54 |     });
   55 |
   56 |     console.log('📄 Initial page state:', pageState);
   57 |     expect(pageState.isSignupPage).toBe(true);
   58 |     expect(pageState.hasSignupForm).toBe(true);
   59 |     expect(pageState.isLoading).toBe(false);
   60 |
   61 |     // Generate unique test user
   62 |     const timestamp = Date.now();
   63 |     const testUser = {
   64 |       fullName: `Stagehand Test User ${timestamp}`,
   65 |       email: `stagehand-test-${timestamp}@example.com`,
   66 |       password: 'StagehandTest123!@#'
   67 |     };
   68 |
   69 |     console.log(`👤 Creating test user: ${testUser.email}`);
   70 |
   71 |     // Fill out the signup form using natural language
   72 |     await page.act(`fill in the full name field with "${testUser.fullName}"`);
   73 |     await page.act(`fill in the email field with "${testUser.email}"`);
   74 |     await page.act(`fill in the password field with "${testUser.password}"`);
   75 |     await page.act(`fill in the confirm password field with "${testUser.password}"`);
   76 |
   77 |     // Handle consent checkboxes
   78 |     await page.act('check the age verification checkbox if it exists');
   79 |     await page.act('check the development consent checkbox if it exists');
   80 |
   81 |     // Verify form is properly filled
   82 |     const formValidation = await page.extract({
   83 |       instruction: 'check if the signup form is completely filled and valid',
   84 |       schema: z.object({
   85 |         allFieldsFilled: z.boolean().describe('whether all required fields appear to be filled'),
   86 |         passwordStrength: z.string().describe('the password strength indicator if visible'),
   87 |         submitButtonEnabled: z.boolean().describe('whether the submit/create account button is enabled'),
   88 |         validationErrors: z.array(z.string()).describe('any validation error messages visible'),
   89 |       }),
   90 |     });
   91 |
   92 |     console.log('✅ Form validation state:', formValidation);
   93 |     expect(formValidation.allFieldsFilled).toBe(true);
   94 |     expect(formValidation.submitButtonEnabled).toBe(true);
   95 |     expect(formValidation.validationErrors).toHaveLength(0);
   96 |
   97 |     // Submit the form
   98 |     console.log('🚀 Submitting signup form...');
   99 |     await page.act('click the create account or sign up button');
  100 |
  101 |     // Wait for signup to complete and check result
  102 |     const signupResult = await page.extract({
  103 |       instruction: 'check the result of the signup attempt',
  104 |       schema: z.object({
  105 |         wasSuccessful: z.boolean().describe('whether the signup appears to have been successful'),
  106 |         currentUrl: z.string().describe('the current page URL'),
  107 |         isOnChatPage: z.boolean().describe('whether the user is now on a chat page'),
  108 |         isOnDashboard: z.boolean().describe('whether the user is on a dashboard page'),
  109 |         isStillOnSignup: z.boolean().describe('whether still on the signup page'),
  110 |         loadingComplete: z.boolean().describe('whether any loading indicators have finished'),
  111 |         errorMessages: z.array(z.string()).describe('any error messages displayed'),
  112 |       }),
  113 |     });
  114 |
  115 |     console.log('📊 Signup result:', signupResult);
  116 |
  117 |     // Verify successful signup and redirect
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
```