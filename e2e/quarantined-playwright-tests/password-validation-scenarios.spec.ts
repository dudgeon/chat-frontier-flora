import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

/**
 * 🔐 PASSWORD VALIDATION SCENARIOS TEST SUITE
 *
 * Comprehensive testing of the PasswordValidation component using Stagehand's
 * natural language actions to test various input scenarios and edge cases.
 */

const PasswordValidationStateSchema = z.object({
  strength: z.string().describe('the password strength level (Weak, Fair, Good, Strong)'),
  percentage: z.number().min(0).max(100).describe('the password strength percentage'),
  hasLengthRule: z.boolean().describe('whether the length requirement is satisfied'),
  hasUppercaseRule: z.boolean().describe('whether the uppercase requirement is satisfied'),
  hasLowercaseRule: z.boolean().describe('whether the lowercase requirement is satisfied'),
  hasNumberRule: z.boolean().describe('whether the number requirement is satisfied'),
  hasSpecialCharRule: z.boolean().describe('whether the special character requirement is satisfied'),
  isVisible: z.boolean().describe('whether the password validation component is visible'),
  progressBarColor: z.string().describe('the color of the progress bar (red, orange, yellow, green)'),
});

type PasswordValidationState = z.infer<typeof PasswordValidationStateSchema>;

test.describe('Password Validation Scenarios', () => {
  let stagehand: Stagehand;

  test.beforeEach(async () => {
    stagehand = new Stagehand({
      env: 'LOCAL',
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    await stagehand.init();
    await stagehand.page.goto('/');
    await stagehand.page.act('wait for the signup form to be visible');
  });

  test.afterEach(async () => {
    await stagehand.close();
  });

  test.describe('Basic Strength Progression Tests', () => {
    test('Scenario 1.1: Empty to Weak progression', async () => {
      console.log('🔍 Testing empty to weak password progression...');

      // Start with empty field - validation should not be visible
      await stagehand.page.act('clear the password field completely');

      let state = await stagehand.page.extract({
        instruction: 'Extract the current state of password validation component when field is empty',
        schema: PasswordValidationStateSchema,
      });

      expect(state.isVisible).toBe(false);

      // Type "a" - should show weak validation
      await stagehand.page.act('type "a" in the password field');

      state = await stagehand.page.extract({
        instruction: 'Extract password validation state after typing single character "a"',
        schema: PasswordValidationStateSchema,
      });

      expect(state.isVisible).toBe(true);
      expect(state.strength).toBe('Weak');
      expect(state.progressBarColor).toBe('red');
      expect(state.percentage).toBeLessThan(30);
      expect(state.hasLengthRule).toBe(false); // "a" is only 1 character
      expect(state.hasUppercaseRule).toBe(false);
      expect(state.hasLowercaseRule).toBe(true);
      expect(state.hasNumberRule).toBe(false);
      expect(state.hasSpecialCharRule).toBe(false);
    });

    test('Scenario 1.2: Weak to Fair progression', async () => {
      console.log('🔍 Testing weak to fair password progression...');

      const testInputs = ['a', 'Ab', 'Ab1'];
      const expectedStrengths = ['Weak', 'Weak', 'Fair'];

      for (let i = 0; i < testInputs.length; i++) {
        await stagehand.page.act(`clear the password field and type "${testInputs[i]}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract password validation state for input "${testInputs[i]}"`,
          schema: PasswordValidationStateSchema,
        });

        expect(state.strength).toBe(expectedStrengths[i]);

        if (i === 2) { // "Ab1" should be Fair
          expect(state.progressBarColor).toBe('orange');
          expect(state.hasUppercaseRule).toBe(true);
          expect(state.hasLowercaseRule).toBe(true);
          expect(state.hasNumberRule).toBe(true);
        }
      }
    });

    test('Scenario 1.3: Fair to Good progression', async () => {
      console.log('🔍 Testing fair to good password progression...');

      await stagehand.page.act('clear the password field and type "Ab1!cde"');

      const state = await stagehand.page.extract({
        instruction: 'Extract password validation state for "Ab1!cde"',
        schema: PasswordValidationStateSchema,
      });

      expect(state.strength).toBe('Good');
      expect(state.progressBarColor).toBe('yellow');
      expect(state.hasLengthRule).toBe(false); // Still only 7 characters
      expect(state.hasUppercaseRule).toBe(true);
      expect(state.hasLowercaseRule).toBe(true);
      expect(state.hasNumberRule).toBe(true);
      expect(state.hasSpecialCharRule).toBe(true);
    });

    test('Scenario 1.4: Good to Strong progression', async () => {
      console.log('🔍 Testing good to strong password progression...');

      await stagehand.page.act('clear the password field and type "StrongPass123!"');

      const state = await stagehand.page.extract({
        instruction: 'Extract password validation state for strong password "StrongPass123!"',
        schema: PasswordValidationStateSchema,
      });

      expect(state.strength).toBe('Strong');
      expect(state.progressBarColor).toBe('green');
      expect(state.percentage).toBeGreaterThan(80);
      expect(state.hasLengthRule).toBe(true);
      expect(state.hasUppercaseRule).toBe(true);
      expect(state.hasLowercaseRule).toBe(true);
      expect(state.hasNumberRule).toBe(true);
      expect(state.hasSpecialCharRule).toBe(true);
    });
  });

  test.describe('Individual Rule Testing', () => {
    test('Scenario 2.1: Length requirement testing', async () => {
      console.log('🔍 Testing length requirement validation...');

      // Test 7 characters (should fail length requirement)
      await stagehand.page.act('clear the password field and type "1234567"');

      let state = await stagehand.page.extract({
        instruction: 'Extract validation state for 7-character password',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasLengthRule).toBe(false);

      // Test 8 characters (should pass length requirement)
      await stagehand.page.act('clear the password field and type "12345678"');

      state = await stagehand.page.extract({
        instruction: 'Extract validation state for 8-character password',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasLengthRule).toBe(true);
    });

    test('Scenario 2.2: Uppercase requirement testing', async () => {
      console.log('🔍 Testing uppercase requirement validation...');

      // Test without uppercase
      await stagehand.page.act('clear the password field and type "lowercase123!"');

      let state = await stagehand.page.extract({
        instruction: 'Extract validation state for password without uppercase letters',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasUppercaseRule).toBe(false);

      // Test with uppercase
      await stagehand.page.act('clear the password field and type "Lowercase123!"');

      state = await stagehand.page.extract({
        instruction: 'Extract validation state for password with uppercase letters',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasUppercaseRule).toBe(true);
    });

    test('Scenario 2.3: Lowercase requirement testing', async () => {
      console.log('🔍 Testing lowercase requirement validation...');

      // Test without lowercase
      await stagehand.page.act('clear the password field and type "UPPERCASE123!"');

      let state = await stagehand.page.extract({
        instruction: 'Extract validation state for password without lowercase letters',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasLowercaseRule).toBe(false);

      // Test with lowercase
      await stagehand.page.act('clear the password field and type "UPPERCASElower123!"');

      state = await stagehand.page.extract({
        instruction: 'Extract validation state for password with lowercase letters',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasLowercaseRule).toBe(true);
    });

    test('Scenario 2.4: Number requirement testing', async () => {
      console.log('🔍 Testing number requirement validation...');

      // Test without numbers
      await stagehand.page.act('clear the password field and type "NoNumbers!"');

      let state = await stagehand.page.extract({
        instruction: 'Extract validation state for password without numbers',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasNumberRule).toBe(false);

      // Test with numbers
      await stagehand.page.act('clear the password field and type "HasNumber1!"');

      state = await stagehand.page.extract({
        instruction: 'Extract validation state for password with numbers',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasNumberRule).toBe(true);
    });

    test('Scenario 2.5: Special character requirement testing', async () => {
      console.log('🔍 Testing special character requirement validation...');

      // Test without special characters
      await stagehand.page.act('clear the password field and type "NoSpecialChars123"');

      let state = await stagehand.page.extract({
        instruction: 'Extract validation state for password without special characters',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasSpecialCharRule).toBe(false);

      // Test with special characters
      await stagehand.page.act('clear the password field and type "HasSpecial!"');

      state = await stagehand.page.extract({
        instruction: 'Extract validation state for password with special characters',
        schema: PasswordValidationStateSchema,
      });

      expect(state.hasSpecialCharRule).toBe(true);
    });
  });

  test.describe('Edge Case Testing', () => {
    test('Scenario 3.1: Various special characters', async () => {
      console.log('🔍 Testing various special characters...');

      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

      for (const char of specialChars) {
        await stagehand.page.act(`clear the password field and type "Test123${char}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract validation state for password with special character "${char}"`,
          schema: PasswordValidationStateSchema,
        });

        expect(state.hasSpecialCharRule).toBe(true);
      }
    });

    test('Scenario 3.2: Unicode and international characters', async () => {
      console.log('🔍 Testing unicode and international characters...');

      const unicodePasswords = [
        'Tëst123!',     // Accented characters
        'Test123!🔒',   // Emoji
        'Тест123!',     // Cyrillic
        '测试123!',      // Chinese
        'テスト123!',    // Japanese
      ];

      for (const password of unicodePasswords) {
        await stagehand.page.act(`clear the password field and type "${password}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract validation state for unicode password "${password}"`,
          schema: PasswordValidationStateSchema,
        });

        // Should handle unicode gracefully without crashing
        expect(state.isVisible).toBe(true);
        expect(state.strength).toBeDefined();
      }
    });

    test('Scenario 3.3: Very long passwords', async () => {
      console.log('🔍 Testing very long passwords...');

      // Test 50+ character password
      const longPassword = 'A'.repeat(25) + 'a'.repeat(25) + '123456789!' + 'ExtraLongPasswordContent';
      await stagehand.page.act(`clear the password field and type "${longPassword}"`);

      const state = await stagehand.page.extract({
        instruction: 'Extract validation state for very long password',
        schema: PasswordValidationStateSchema,
      });

      expect(state.isVisible).toBe(true);
      expect(state.hasLengthRule).toBe(true);
      expect(state.strength).toBe('Strong');
    });
  });

  test.describe('Real-World Password Scenarios', () => {
    test('Scenario 4.1: Common password patterns', async () => {
      console.log('🔍 Testing common password patterns...');

      const commonPatterns = [
        { password: 'Password123!', expectedStrength: 'Strong' },
        { password: 'MyPassword1!', expectedStrength: 'Strong' },
        { password: 'Company2024!', expectedStrength: 'Strong' },
        { password: 'SecurePass123!', expectedStrength: 'Strong' },
      ];

      for (const pattern of commonPatterns) {
        await stagehand.page.act(`clear the password field and type "${pattern.password}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract validation state for common pattern "${pattern.password}"`,
          schema: PasswordValidationStateSchema,
        });

        expect(state.strength).toBe(pattern.expectedStrength);
      }
    });

    test('Scenario 4.2: Weak password attempts', async () => {
      console.log('🔍 Testing weak password attempts...');

      const weakPasswords = [
        { password: 'password', expectedStrength: 'Weak' },
        { password: 'PASSWORD', expectedStrength: 'Weak' },
        { password: '12345678', expectedStrength: 'Weak' },
        { password: '!!!!!!!!!', expectedStrength: 'Weak' },
      ];

      for (const weak of weakPasswords) {
        await stagehand.page.act(`clear the password field and type "${weak.password}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract validation state for weak password "${weak.password}"`,
          schema: PasswordValidationStateSchema,
        });

        expect(state.strength).toBe(weak.expectedStrength);
        expect(state.progressBarColor).toBe('red');
      }
    });

    test('Scenario 4.3: Progressive improvement', async () => {
      console.log('🔍 Testing progressive password improvement...');

      const progression = [
        { password: 'pass', expectedStrength: 'Weak' },
        { password: 'password', expectedStrength: 'Weak' },
        { password: 'Password', expectedStrength: 'Weak' },
        { password: 'Password1', expectedStrength: 'Fair' },
        { password: 'Password1!', expectedStrength: 'Good' },
      ];

      for (const step of progression) {
        await stagehand.page.act(`clear the password field and type "${step.password}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract validation state for progressive password "${step.password}"`,
          schema: PasswordValidationStateSchema,
        });

        expect(state.strength).toBe(step.expectedStrength);
      }
    });
  });

  test.describe('User Experience Testing', () => {
    test('Scenario 5.1: Visual feedback verification', async () => {
      console.log('🔍 Testing visual feedback changes...');

      const testCases = [
        { password: 'weak', expectedColor: 'red' },
        { password: 'Fair123', expectedColor: 'orange' },
        { password: 'Good123!', expectedColor: 'yellow' },
        { password: 'StrongPass123!', expectedColor: 'green' },
      ];

      for (const testCase of testCases) {
        await stagehand.page.act(`clear the password field and type "${testCase.password}"`);

        const state = await stagehand.page.extract({
          instruction: `Extract visual feedback for password "${testCase.password}"`,
          schema: PasswordValidationStateSchema,
        });

        expect(state.progressBarColor).toBe(testCase.expectedColor);
      }
    });

    test('Scenario 6.1: Form integration verification', async () => {
      console.log('🔍 Testing form integration...');

      // Test that validation appears when typing
      await stagehand.page.act('clear the password field and type "TestPassword123!"');

      const state = await stagehand.page.extract({
        instruction: 'Extract validation state to verify form integration',
        schema: PasswordValidationStateSchema,
      });

      expect(state.isVisible).toBe(true);
      expect(state.strength).toBe('Strong');

      // Test that validation hides when field is empty
      await stagehand.page.act('clear the password field completely');

      const emptyState = await stagehand.page.extract({
        instruction: 'Extract validation state when field is empty',
        schema: PasswordValidationStateSchema,
      });

      expect(emptyState.isVisible).toBe(false);
    });
  });
});
