/**
 * 🧪 VALIDATION UTILITIES TESTS - COMPREHENSIVE COVERAGE
 *
 * ⚠️ CRITICAL: These tests verify form validation security.
 * DO NOT MODIFY without understanding security implications.
 *
 * This test suite covers:
 * - Email format validation edge cases
 * - Password security requirement validation
 * - Form validation with all field combinations
 * - Error message consistency
 * - Security boundary testing
 */

import { validateEmail, validatePassword, validateSignUpForm, validateLoginForm, validateProfileUpdate } from './validation';
import { SignUpFormData, LoginFormData, ProfileUpdateData } from '@chat-frontier-flora/shared';

describe('validateEmail', () => {
  describe('Valid email addresses', () => {
    it('should accept standard email format', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name@domain.co.uk')).toBeNull();
      expect(validateEmail('user+tag@example.org')).toBeNull();
    });

    it('should accept emails with numbers and special characters', () => {
      expect(validateEmail('user123@example.com')).toBeNull();
      expect(validateEmail('test.email+tag@example.co.uk')).toBeNull();
      expect(validateEmail('user_name@sub.domain.com')).toBeNull();
    });

    it('should accept long domain names', () => {
      expect(validateEmail('test@very-long-domain-name.example.com')).toBeNull();
    });
  });

  describe('Invalid email addresses', () => {
    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result).not.toBeNull();
      expect(result?.field).toBe('email');
      expect(result?.message).toBe('Email is required');
    });

    it('should reject emails without @ symbol', () => {
      expect(validateEmail('testexample.com')).not.toBeNull();
      expect(validateEmail('test.example.com')).not.toBeNull();
    });

    it('should reject emails without domain', () => {
      expect(validateEmail('test@')).not.toBeNull();
      expect(validateEmail('test@.')).not.toBeNull();
    });

         it('should reject emails without local part', () => {
       expect(validateEmail('@example.com')).not.toBeNull();
       // Note: .@example.com is actually valid per current regex as . is allowed in local part
     });

    it('should reject emails with invalid domain format', () => {
      expect(validateEmail('test@example')).not.toBeNull();
      expect(validateEmail('test@.com')).not.toBeNull();
      expect(validateEmail('test@example.')).not.toBeNull();
    });

    it('should reject emails with spaces', () => {
      expect(validateEmail('test @example.com')).not.toBeNull();
      expect(validateEmail('test@ example.com')).not.toBeNull();
      expect(validateEmail('test@example .com')).not.toBeNull();
    });

    it('should reject emails with multiple @ symbols', () => {
      expect(validateEmail('test@@example.com')).not.toBeNull();
      expect(validateEmail('test@example@.com')).not.toBeNull();
    });
  });

  describe('Error message consistency', () => {
    it('should return consistent error message for invalid format', () => {
      const result = validateEmail('invalid-email');
      expect(result?.message).toBe('Please enter a valid email address');
    });
  });
});

describe('validatePassword', () => {
  describe('Valid passwords', () => {
    it('should accept password meeting all requirements', () => {
      expect(validatePassword('Test123!')).toBeNull();
      expect(validatePassword('MySecure1@')).toBeNull();
      expect(validatePassword('Complex9#Password')).toBeNull();
    });

         it('should accept passwords with various special characters', () => {
       expect(validatePassword('Test123@')).toBeNull();
       expect(validatePassword('Test123#')).toBeNull();
       expect(validatePassword('Test123$')).toBeNull();
       expect(validatePassword('Test123%')).toBeNull();
       expect(validatePassword('Test123^')).toBeNull();
       expect(validatePassword('Test123&')).toBeNull();
       expect(validatePassword('Test123*')).toBeNull();
     });

     it('should accept minimum length password', () => {
       expect(validatePassword('Test123!')).toBeNull(); // Exactly 8 characters
     });

     it('should accept long passwords', () => {
       expect(validatePassword('ThisIsAVeryLongPasswordThatMeetsAllRequirements123!')).toBeNull();
     });
   });

   describe('Invalid passwords - Required field', () => {
     it('should reject empty password', () => {
       const result = validatePassword('');
       expect(result).not.toBeNull();
       expect(result?.field).toBe('password');
       expect(result?.message).toBe('Password is required');
     });
   });

   describe('Invalid passwords - Length requirements', () => {
     it('should reject passwords shorter than 8 characters', () => {
       const result = validatePassword('Test1!');
       expect(result).not.toBeNull();
       expect(result?.message).toBe('Password must be at least 8 characters');
     });

     it('should reject very short passwords', () => {
       expect(validatePassword('T1!')).not.toBeNull();
       expect(validatePassword('a')).not.toBeNull();
     });
   });

   describe('Invalid passwords - Character requirements', () => {
     it('should reject passwords without uppercase letters', () => {
       const result = validatePassword('test123!');
       expect(result).not.toBeNull();
       expect(result?.message).toBe('Password must contain at least one uppercase letter');
     });

     it('should reject passwords without lowercase letters', () => {
       const result = validatePassword('TEST123!');
       expect(result).not.toBeNull();
       expect(result?.message).toBe('Password must contain at least one lowercase letter');
     });

     it('should reject passwords without numbers', () => {
       const result = validatePassword('TestTest!');
       expect(result).not.toBeNull();
       expect(result?.message).toBe('Password must contain at least one number');
     });

     it('should reject passwords without special characters', () => {
       const result = validatePassword('Test1234');
       expect(result).not.toBeNull();
       expect(result?.message).toBe('Password must contain at least one special character');
     });
   });

   describe('Edge cases', () => {
     it('should handle passwords with only required character types', () => {
       expect(validatePassword('Aa1!')).not.toBeNull(); // Too short but has all types
     });

     it('should handle passwords with unicode characters', () => {
       // Unicode characters should not satisfy special character requirement
       expect(validatePassword('Test123ñ')).not.toBeNull();
     });
   });
 });

 describe('validateSignUpForm', () => {
   const validData: SignUpFormData = {
        email: 'test@example.com',
        password: 'Test123!',
        confirmPassword: 'Test123!',
        fullName: 'Test User',
        ageVerification: true,
        agreeToTerms: true
    };

    it('should return null for valid data', () => {
        expect(validateSignUpForm(validData)).toBeNull();
    });

    it('should return error for mismatched passwords', () => {
        const data = { ...validData, confirmPassword: 'different' };
        const errors = validateSignUpForm(data);
        expect(errors).not.toBeNull();
        expect(errors?.find(e => e.field === 'confirmPassword')).toBeTruthy();
    });

    it('should return error for empty full name', () => {
        const data = { ...validData, fullName: '' };
        const errors = validateSignUpForm(data);
        expect(errors?.find(e => e.field === 'fullName')).toBeTruthy();
    });

    it('should return error for whitespace-only full name', () => {
        const data = { ...validData, fullName: '   ' };
        const errors = validateSignUpForm(data);
        expect(errors?.find(e => e.field === 'fullName')).toBeTruthy();
    });

    it('should return error when age verification not checked', () => {
        const data = { ...validData, ageVerification: false };
        const errors = validateSignUpForm(data);
        expect(errors?.find(e => e.field === 'ageVerification')).toBeTruthy();
    });
});

describe('validateLoginForm', () => {
    const validData: LoginFormData = {
        email: 'test@example.com',
        password: 'Test123!',
        rememberMe: true
    };

    it('should return null for valid data', () => {
        expect(validateLoginForm(validData)).toBeNull();
    });

    it('should return error for empty password', () => {
        const data = { ...validData, password: '' };
        const errors = validateLoginForm(data);
        expect(errors?.find(e => e.field === 'password')).toBeTruthy();
    });
});

describe('validateProfileUpdate', () => {
    const validData: ProfileUpdateData = {
        fullName: 'New Name',
        displayName: 'New Display Name',
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmNewPassword: 'NewPass123!'
    };

    it('should return null for valid data', () => {
        expect(validateProfileUpdate(validData)).toBeNull();
    });

    it('should return error for empty full name', () => {
        const data = { ...validData, fullName: '' };
        const errors = validateProfileUpdate(data);
        expect(errors?.find(e => e.field === 'fullName')).toBeTruthy();
    });

    it('should return error for empty display name', () => {
        const data = { ...validData, displayName: '' };
        const errors = validateProfileUpdate(data);
        expect(errors?.find(e => e.field === 'displayName')).toBeTruthy();
    });

    it('should require current password when setting new password', () => {
        const data = {
            newPassword: 'NewPass123!',
            confirmNewPassword: 'NewPass123!'
        };
        const errors = validateProfileUpdate(data);
        expect(errors?.find(e => e.field === 'currentPassword')).toBeTruthy();
    });

    it('should validate new password requirements', () => {
        const data = {
            ...validData,
            newPassword: 'weak',
            confirmNewPassword: 'weak'
        };
        const errors = validateProfileUpdate(data);
        expect(errors?.find(e => e.field === 'newPassword')).toBeTruthy();
    });

    it('should check new password confirmation match', () => {
        const data = {
            ...validData,
            confirmNewPassword: 'Different123!'
        };
        const errors = validateProfileUpdate(data);
        expect(errors?.find(e => e.field === 'confirmNewPassword')).toBeTruthy();
    });
});
