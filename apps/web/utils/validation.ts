import { ValidationError, ValidationResult, SignUpFormData, LoginFormData, ProfileUpdateData } from '@chat-frontier-flora/shared';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export const validateEmail = (email: string): ValidationError | null => {
    if (!email) {
        return { field: 'email', message: 'Email is required' };
    }
    if (!EMAIL_REGEX.test(email)) {
        return { field: 'email', message: 'Please enter a valid email address' };
    }
    return null;
};

export const validatePassword = (password: string): ValidationError | null => {
    if (!password) {
        return { field: 'password', message: 'Password is required' };
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
        return { field: 'password', message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
    }
    if (!/[A-Z]/.test(password)) {
        return { field: 'password', message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { field: 'password', message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { field: 'password', message: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*]/.test(password)) {
        return { field: 'password', message: 'Password must contain at least one special character (!@#$%^&*)' };
    }
    return null;
};

export const validateSignUpForm = (data: SignUpFormData): ValidationResult => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);

    if (data.password !== data.confirmPassword) {
        errors.push({
            field: 'confirmPassword',
            message: 'Passwords do not match'
        });
    }

    if (!data.agreeToTerms) {
        errors.push({
            field: 'agreeToTerms',
            message: 'You must agree to the terms and conditions'
        });
    }

    return errors.length > 0 ? errors : null;
};

export const validateLoginForm = (data: LoginFormData): ValidationResult => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);

    if (!data.password) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }

    return errors.length > 0 ? errors : null;
};

export const validateProfileUpdate = (data: ProfileUpdateData): ValidationResult => {
    const errors: ValidationError[] = [];

    if (data.displayName && data.displayName.length < 2) {
        errors.push({
            field: 'displayName',
            message: 'Display name must be at least 2 characters'
        });
    }

    if (data.newPassword) {
        if (!data.currentPassword) {
            errors.push({
                field: 'currentPassword',
                message: 'Current password is required to set a new password'
            });
        }

        const passwordError = validatePassword(data.newPassword);
        if (passwordError) errors.push(passwordError);

        if (data.newPassword !== data.confirmNewPassword) {
            errors.push({
                field: 'confirmNewPassword',
                message: 'New passwords do not match'
            });
        }
    }

    return errors.length > 0 ? errors : null;
};
