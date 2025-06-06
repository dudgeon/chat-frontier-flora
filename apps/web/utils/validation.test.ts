import { validateEmail, validatePassword, validateSignUpForm, validateLoginForm, validateProfileUpdate } from './validation';
import { SignUpFormData, LoginFormData, ProfileUpdateData } from '@chat-frontier-flora/shared';

describe('validateEmail', () => {
    it('should return null for valid email', () => {
        expect(validateEmail('test@example.com')).toBeNull();
    });

    it('should return error for empty email', () => {
        expect(validateEmail('')?.message).toBe('Email is required');
    });

    it('should return error for invalid email format', () => {
        expect(validateEmail('invalid-email')).not.toBeNull();
        expect(validateEmail('test@')).not.toBeNull();
        expect(validateEmail('@example.com')).not.toBeNull();
    });
});

describe('validatePassword', () => {
    it('should return null for valid password', () => {
        expect(validatePassword('Test123!')).toBeNull();
    });

    it('should return error for empty password', () => {
        expect(validatePassword('')?.message).toBe('Password is required');
    });

    it('should return error for short password', () => {
        expect(validatePassword('Test1!')).not.toBeNull();
    });

    it('should require uppercase letter', () => {
        expect(validatePassword('test123!')).not.toBeNull();
    });

    it('should require lowercase letter', () => {
        expect(validatePassword('TEST123!')).not.toBeNull();
    });

    it('should require number', () => {
        expect(validatePassword('TestTest!')).not.toBeNull();
    });

    it('should require special character', () => {
        expect(validatePassword('Test1234')).not.toBeNull();
    });
});

describe('validateSignUpForm', () => {
    const validData: SignUpFormData = {
        email: 'test@example.com',
        password: 'Test123!',
        confirmPassword: 'Test123!',
        displayName: 'Test User',
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

    it('should return error when terms not agreed', () => {
        const data = { ...validData, agreeToTerms: false };
        const errors = validateSignUpForm(data);
        expect(errors?.find(e => e.field === 'agreeToTerms')).toBeTruthy();
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
        displayName: 'New Name',
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmNewPassword: 'NewPass123!'
    };

    it('should return null for valid data', () => {
        expect(validateProfileUpdate(validData)).toBeNull();
    });

    it('should return error for short display name', () => {
        const data = { ...validData, displayName: 'A' };
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
