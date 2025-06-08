# Test info

- Name: Password Validation Scenarios >> Edge Case Testing >> Scenario 3.2: Unicode and international characters
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/password-validation-scenarios.spec.ts:286:9

# Error details

```
StagehandDefaultError: 
Hey! We're sorry you ran into an error. 
If you need help, please open a Github issue or reach out to us on Slack: https://stagehand.dev/slack

Full error:
page.evaluate: Target page, context or browser has been closed
    at _StagehandPage.<anonymous> (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:3532:15)
    at rejected (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:73:29)
```

# Page snapshot

```yaml
- text: Create Account Full Name *
- textbox "Enter your first and last name"
- text: Email Address *
- textbox "Enter your email address"
- text: Password *
- textbox "Enter your password": 测试123!
- 'progressbar "Password strength indicator: Weak"':
  - text: Password Strength Weak
  - progressbar "Password strength progress bar"
  - text: 32% strength
- list "Password requirements list": ○ At least 8 characters ○ At least one uppercase letter ○ At least one lowercase letter ✓ At least one number ✓ At least one special character (!@#$%^&*)
- text: 2 of 5 requirements met Confirm Password *
- textbox "Confirm your password"
- checkbox "I verify that I am 18 years of age or older"
- checkbox "I consent to the use of my data for development and improvement purposes"
- button "Submit button disabled. Please fix all form errors" [disabled]: Complete Form to Continue
- text: "Please fix all form errors Form Valid: No Form Touched: No Form Completed: No Completion: 1/6 (17%) Submit Button: disabled - Disabled Disabled Reason: Please fix all form errors Already have an account? Sign In"
```

# Test source

```ts
  186 |
  187 |       state = await stagehand.page.extract({
  188 |         instruction: 'Extract validation state for password with uppercase letters',
  189 |         schema: PasswordValidationStateSchema,
  190 |       });
  191 |
  192 |       expect(state.hasUppercaseRule).toBe(true);
  193 |     });
  194 |
  195 |     test('Scenario 2.3: Lowercase requirement testing', async () => {
  196 |       console.log('🔍 Testing lowercase requirement validation...');
  197 |
  198 |       // Test without lowercase
  199 |       await stagehand.page.act('clear the password field and type "UPPERCASE123!"');
  200 |
  201 |       let state = await stagehand.page.extract({
  202 |         instruction: 'Extract validation state for password without lowercase letters',
  203 |         schema: PasswordValidationStateSchema,
  204 |       });
  205 |
  206 |       expect(state.hasLowercaseRule).toBe(false);
  207 |
  208 |       // Test with lowercase
  209 |       await stagehand.page.act('clear the password field and type "UPPERCASElower123!"');
  210 |
  211 |       state = await stagehand.page.extract({
  212 |         instruction: 'Extract validation state for password with lowercase letters',
  213 |         schema: PasswordValidationStateSchema,
  214 |       });
  215 |
  216 |       expect(state.hasLowercaseRule).toBe(true);
  217 |     });
  218 |
  219 |     test('Scenario 2.4: Number requirement testing', async () => {
  220 |       console.log('🔍 Testing number requirement validation...');
  221 |
  222 |       // Test without numbers
  223 |       await stagehand.page.act('clear the password field and type "NoNumbers!"');
  224 |
  225 |       let state = await stagehand.page.extract({
  226 |         instruction: 'Extract validation state for password without numbers',
  227 |         schema: PasswordValidationStateSchema,
  228 |       });
  229 |
  230 |       expect(state.hasNumberRule).toBe(false);
  231 |
  232 |       // Test with numbers
  233 |       await stagehand.page.act('clear the password field and type "HasNumber1!"');
  234 |
  235 |       state = await stagehand.page.extract({
  236 |         instruction: 'Extract validation state for password with numbers',
  237 |         schema: PasswordValidationStateSchema,
  238 |       });
  239 |
  240 |       expect(state.hasNumberRule).toBe(true);
  241 |     });
  242 |
  243 |     test('Scenario 2.5: Special character requirement testing', async () => {
  244 |       console.log('🔍 Testing special character requirement validation...');
  245 |
  246 |       // Test without special characters
  247 |       await stagehand.page.act('clear the password field and type "NoSpecialChars123"');
  248 |
  249 |       let state = await stagehand.page.extract({
  250 |         instruction: 'Extract validation state for password without special characters',
  251 |         schema: PasswordValidationStateSchema,
  252 |       });
  253 |
  254 |       expect(state.hasSpecialCharRule).toBe(false);
  255 |
  256 |       // Test with special characters
  257 |       await stagehand.page.act('clear the password field and type "HasSpecial!"');
  258 |
  259 |       state = await stagehand.page.extract({
  260 |         instruction: 'Extract validation state for password with special characters',
  261 |         schema: PasswordValidationStateSchema,
  262 |       });
  263 |
  264 |       expect(state.hasSpecialCharRule).toBe(true);
  265 |     });
  266 |   });
  267 |
  268 |   test.describe('Edge Case Testing', () => {
  269 |     test('Scenario 3.1: Various special characters', async () => {
  270 |       console.log('🔍 Testing various special characters...');
  271 |
  272 |       const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
  273 |
  274 |       for (const char of specialChars) {
  275 |         await stagehand.page.act(`clear the password field and type "Test123${char}"`);
  276 |
  277 |         const state = await stagehand.page.extract({
  278 |           instruction: `Extract validation state for password with special character "${char}"`,
  279 |           schema: PasswordValidationStateSchema,
  280 |         });
  281 |
  282 |         expect(state.hasSpecialCharRule).toBe(true);
  283 |       }
  284 |     });
  285 |
> 286 |     test('Scenario 3.2: Unicode and international characters', async () => {
      |         ^ StagehandDefaultError: 
  287 |       console.log('🔍 Testing unicode and international characters...');
  288 |
  289 |       const unicodePasswords = [
  290 |         'Tëst123!',     // Accented characters
  291 |         'Test123!🔒',   // Emoji
  292 |         'Тест123!',     // Cyrillic
  293 |         '测试123!',      // Chinese
  294 |         'テスト123!',    // Japanese
  295 |       ];
  296 |
  297 |       for (const password of unicodePasswords) {
  298 |         await stagehand.page.act(`clear the password field and type "${password}"`);
  299 |
  300 |         const state = await stagehand.page.extract({
  301 |           instruction: `Extract validation state for unicode password "${password}"`,
  302 |           schema: PasswordValidationStateSchema,
  303 |         });
  304 |
  305 |         // Should handle unicode gracefully without crashing
  306 |         expect(state.isVisible).toBe(true);
  307 |         expect(state.strength).toBeDefined();
  308 |       }
  309 |     });
  310 |
  311 |     test('Scenario 3.3: Very long passwords', async () => {
  312 |       console.log('🔍 Testing very long passwords...');
  313 |
  314 |       // Test 50+ character password
  315 |       const longPassword = 'A'.repeat(25) + 'a'.repeat(25) + '123456789!' + 'ExtraLongPasswordContent';
  316 |       await stagehand.page.act(`clear the password field and type "${longPassword}"`);
  317 |
  318 |       const state = await stagehand.page.extract({
  319 |         instruction: 'Extract validation state for very long password',
  320 |         schema: PasswordValidationStateSchema,
  321 |       });
  322 |
  323 |       expect(state.isVisible).toBe(true);
  324 |       expect(state.hasLengthRule).toBe(true);
  325 |       expect(state.strength).toBe('Strong');
  326 |     });
  327 |   });
  328 |
  329 |   test.describe('Real-World Password Scenarios', () => {
  330 |     test('Scenario 4.1: Common password patterns', async () => {
  331 |       console.log('🔍 Testing common password patterns...');
  332 |
  333 |       const commonPatterns = [
  334 |         { password: 'Password123!', expectedStrength: 'Strong' },
  335 |         { password: 'MyPassword1!', expectedStrength: 'Strong' },
  336 |         { password: 'Company2024!', expectedStrength: 'Strong' },
  337 |         { password: 'SecurePass123!', expectedStrength: 'Strong' },
  338 |       ];
  339 |
  340 |       for (const pattern of commonPatterns) {
  341 |         await stagehand.page.act(`clear the password field and type "${pattern.password}"`);
  342 |
  343 |         const state = await stagehand.page.extract({
  344 |           instruction: `Extract validation state for common pattern "${pattern.password}"`,
  345 |           schema: PasswordValidationStateSchema,
  346 |         });
  347 |
  348 |         expect(state.strength).toBe(pattern.expectedStrength);
  349 |       }
  350 |     });
  351 |
  352 |     test('Scenario 4.2: Weak password attempts', async () => {
  353 |       console.log('🔍 Testing weak password attempts...');
  354 |
  355 |       const weakPasswords = [
  356 |         { password: 'password', expectedStrength: 'Weak' },
  357 |         { password: 'PASSWORD', expectedStrength: 'Weak' },
  358 |         { password: '12345678', expectedStrength: 'Weak' },
  359 |         { password: '!!!!!!!!!', expectedStrength: 'Weak' },
  360 |       ];
  361 |
  362 |       for (const weak of weakPasswords) {
  363 |         await stagehand.page.act(`clear the password field and type "${weak.password}"`);
  364 |
  365 |         const state = await stagehand.page.extract({
  366 |           instruction: `Extract validation state for weak password "${weak.password}"`,
  367 |           schema: PasswordValidationStateSchema,
  368 |         });
  369 |
  370 |         expect(state.strength).toBe(weak.expectedStrength);
  371 |         expect(state.progressBarColor).toBe('red');
  372 |       }
  373 |     });
  374 |
  375 |     test('Scenario 4.3: Progressive improvement', async () => {
  376 |       console.log('🔍 Testing progressive password improvement...');
  377 |
  378 |       const progression = [
  379 |         { password: 'pass', expectedStrength: 'Weak' },
  380 |         { password: 'password', expectedStrength: 'Weak' },
  381 |         { password: 'Password', expectedStrength: 'Weak' },
  382 |         { password: 'Password1', expectedStrength: 'Fair' },
  383 |         { password: 'Password1!', expectedStrength: 'Good' },
  384 |       ];
  385 |
  386 |       for (const step of progression) {
```