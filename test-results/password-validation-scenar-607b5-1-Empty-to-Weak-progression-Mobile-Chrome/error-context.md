# Test info

- Name: Password Validation Scenarios >> Basic Strength Progression Tests >> Scenario 1.1: Empty to Weak progression
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/password-validation-scenarios.spec.ts:49:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/password-validation-scenarios.spec.ts:60:31
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
   1 | import { test, expect } from '@playwright/test';
   2 | import { Stagehand } from '@browserbasehq/stagehand';
   3 | import { z } from 'zod';
   4 |
   5 | /**
   6 |  * 🔐 PASSWORD VALIDATION SCENARIOS TEST SUITE
   7 |  *
   8 |  * Comprehensive testing of the PasswordValidation component using Stagehand's
   9 |  * natural language actions to test various input scenarios and edge cases.
   10 |  */
   11 |
   12 | const PasswordValidationStateSchema = z.object({
   13 |   strength: z.string().describe('the password strength level (Weak, Fair, Good, Strong)'),
   14 |   percentage: z.number().min(0).max(100).describe('the password strength percentage'),
   15 |   hasLengthRule: z.boolean().describe('whether the length requirement is satisfied'),
   16 |   hasUppercaseRule: z.boolean().describe('whether the uppercase requirement is satisfied'),
   17 |   hasLowercaseRule: z.boolean().describe('whether the lowercase requirement is satisfied'),
   18 |   hasNumberRule: z.boolean().describe('whether the number requirement is satisfied'),
   19 |   hasSpecialCharRule: z.boolean().describe('whether the special character requirement is satisfied'),
   20 |   isVisible: z.boolean().describe('whether the password validation component is visible'),
   21 |   progressBarColor: z.string().describe('the color of the progress bar (red, orange, yellow, green)'),
   22 | });
   23 |
   24 | type PasswordValidationState = z.infer<typeof PasswordValidationStateSchema>;
   25 |
   26 | test.describe('Password Validation Scenarios', () => {
   27 |   let stagehand: Stagehand;
   28 |
   29 |   test.beforeEach(async () => {
   30 |     stagehand = new Stagehand({
   31 |       env: 'LOCAL',
   32 |       apiKey: process.env.OPENAI_API_KEY,
   33 |       modelName: 'gpt-4o-mini',
   34 |       modelClientOptions: {
   35 |         apiKey: process.env.OPENAI_API_KEY,
   36 |       },
   37 |     });
   38 |
   39 |     await stagehand.init();
   40 |     await stagehand.page.goto('/');
   41 |     await stagehand.page.act('wait for the signup form to be visible');
   42 |   });
   43 |
   44 |   test.afterEach(async () => {
   45 |     await stagehand.close();
   46 |   });
   47 |
   48 |   test.describe('Basic Strength Progression Tests', () => {
   49 |     test('Scenario 1.1: Empty to Weak progression', async () => {
   50 |       console.log('🔍 Testing empty to weak password progression...');
   51 |
   52 |       // Start with empty field - validation should not be visible
   53 |       await stagehand.page.act('clear the password field completely');
   54 |
   55 |       let state = await stagehand.page.extract({
   56 |         instruction: 'Extract the current state of password validation component when field is empty',
   57 |         schema: PasswordValidationStateSchema,
   58 |       });
   59 |
>  60 |       expect(state.isVisible).toBe(false);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
   61 |
   62 |       // Type "a" - should show weak validation
   63 |       await stagehand.page.act('type "a" in the password field');
   64 |
   65 |       state = await stagehand.page.extract({
   66 |         instruction: 'Extract password validation state after typing single character "a"',
   67 |         schema: PasswordValidationStateSchema,
   68 |       });
   69 |
   70 |       expect(state.isVisible).toBe(true);
   71 |       expect(state.strength).toBe('Weak');
   72 |       expect(state.progressBarColor).toBe('red');
   73 |       expect(state.percentage).toBeLessThan(30);
   74 |       expect(state.hasLengthRule).toBe(false); // "a" is only 1 character
   75 |       expect(state.hasUppercaseRule).toBe(false);
   76 |       expect(state.hasLowercaseRule).toBe(true);
   77 |       expect(state.hasNumberRule).toBe(false);
   78 |       expect(state.hasSpecialCharRule).toBe(false);
   79 |     });
   80 |
   81 |     test('Scenario 1.2: Weak to Fair progression', async () => {
   82 |       console.log('🔍 Testing weak to fair password progression...');
   83 |
   84 |       const testInputs = ['a', 'Ab', 'Ab1'];
   85 |       const expectedStrengths = ['Weak', 'Weak', 'Fair'];
   86 |
   87 |       for (let i = 0; i < testInputs.length; i++) {
   88 |         await stagehand.page.act(`clear the password field and type "${testInputs[i]}"`);
   89 |
   90 |         const state = await stagehand.page.extract({
   91 |           instruction: `Extract password validation state for input "${testInputs[i]}"`,
   92 |           schema: PasswordValidationStateSchema,
   93 |         });
   94 |
   95 |         expect(state.strength).toBe(expectedStrengths[i]);
   96 |
   97 |         if (i === 2) { // "Ab1" should be Fair
   98 |           expect(state.progressBarColor).toBe('orange');
   99 |           expect(state.hasUppercaseRule).toBe(true);
  100 |           expect(state.hasLowercaseRule).toBe(true);
  101 |           expect(state.hasNumberRule).toBe(true);
  102 |         }
  103 |       }
  104 |     });
  105 |
  106 |     test('Scenario 1.3: Fair to Good progression', async () => {
  107 |       console.log('🔍 Testing fair to good password progression...');
  108 |
  109 |       await stagehand.page.act('clear the password field and type "Ab1!cde"');
  110 |
  111 |       const state = await stagehand.page.extract({
  112 |         instruction: 'Extract password validation state for "Ab1!cde"',
  113 |         schema: PasswordValidationStateSchema,
  114 |       });
  115 |
  116 |       expect(state.strength).toBe('Good');
  117 |       expect(state.progressBarColor).toBe('yellow');
  118 |       expect(state.hasLengthRule).toBe(false); // Still only 7 characters
  119 |       expect(state.hasUppercaseRule).toBe(true);
  120 |       expect(state.hasLowercaseRule).toBe(true);
  121 |       expect(state.hasNumberRule).toBe(true);
  122 |       expect(state.hasSpecialCharRule).toBe(true);
  123 |     });
  124 |
  125 |     test('Scenario 1.4: Good to Strong progression', async () => {
  126 |       console.log('🔍 Testing good to strong password progression...');
  127 |
  128 |       await stagehand.page.act('clear the password field and type "StrongPass123!"');
  129 |
  130 |       const state = await stagehand.page.extract({
  131 |         instruction: 'Extract password validation state for strong password "StrongPass123!"',
  132 |         schema: PasswordValidationStateSchema,
  133 |       });
  134 |
  135 |       expect(state.strength).toBe('Strong');
  136 |       expect(state.progressBarColor).toBe('green');
  137 |       expect(state.percentage).toBeGreaterThan(80);
  138 |       expect(state.hasLengthRule).toBe(true);
  139 |       expect(state.hasUppercaseRule).toBe(true);
  140 |       expect(state.hasLowercaseRule).toBe(true);
  141 |       expect(state.hasNumberRule).toBe(true);
  142 |       expect(state.hasSpecialCharRule).toBe(true);
  143 |     });
  144 |   });
  145 |
  146 |   test.describe('Individual Rule Testing', () => {
  147 |     test('Scenario 2.1: Length requirement testing', async () => {
  148 |       console.log('🔍 Testing length requirement validation...');
  149 |
  150 |       // Test 7 characters (should fail length requirement)
  151 |       await stagehand.page.act('clear the password field and type "1234567"');
  152 |
  153 |       let state = await stagehand.page.extract({
  154 |         instruction: 'Extract validation state for 7-character password',
  155 |         schema: PasswordValidationStateSchema,
  156 |       });
  157 |
  158 |       expect(state.hasLengthRule).toBe(false);
  159 |
  160 |       // Test 8 characters (should pass length requirement)
```