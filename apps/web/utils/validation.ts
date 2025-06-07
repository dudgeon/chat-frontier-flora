/**
 * 🔍 VALIDATION UTILITIES - CRITICAL FORM SECURITY
 *
 * ⚠️ WARNING: These functions control form validation across the app.
 * DO NOT MODIFY without reading AUTHENTICATION_FLOW_DOCUMENTATION.md
 *
 * This module provides:
 * - Email format validation
 * - Password strength validation
 * - Form data validation
 * - Consistent error messaging
 *
 * CRITICAL DEPENDENCIES:
 * - Shared types from @chat-frontier-flora/shared
 * - SignUpForm component validation
 * - Backend password requirements
 *
 * REGRESSION RISKS:
 * - Relaxing validation allows weak passwords
 * - Changing regex breaks email validation
 * - Modifying error messages confuses users
 * - Breaking validation breaks form security
 */

import { ValidationError, ValidationResult, SignUpFormData, LoginFormData, ProfileUpdateData } from '@chat-frontier-flora/shared';

// ⚠️ CRITICAL CONSTANTS: These define validation rules
// DO NOT CHANGE without updating backend and documentation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/**
 * 📧 validateEmail - Email Format Validation
 *
 * Validates email address format using standard regex pattern.
 * This is used across all forms that collect email addresses.
 *
 * ⚠️ CRITICAL: Changing the regex can break email validation.
 * The current pattern matches standard email formats.
 *
 * @param email - Email address to validate
 * @returns ValidationError | null - Error object or null if valid
 */
export const validateEmail = (email: string): ValidationError | null => {
    // ⚠️ CRITICAL: Required field check
    if (!email) {
        return { field: 'email', message: 'Email is required' };
    }

    // ⚠️ CRITICAL: Format validation using standard regex
    if (!EMAIL_REGEX.test(email)) {
        return { field: 'email', message: 'Please enter a valid email address' };
    }

    return null;
};

/**
 * 🔐 validatePassword - Password Strength Validation
 *
 * Validates password meets security requirements.
 * These requirements MUST match backend validation.
 *
 * ⚠️ CRITICAL REQUIREMENTS (DO NOT CHANGE):
 * - Minimum 8 characters
 * - At least one number
 * - At least one letter
 *
 * SECURITY NOTE: These are minimum requirements for user safety.
 * Relaxing these requirements weakens account security.
 *
 * @param password - Password to validate
 * @returns ValidationError | null - Error object or null if valid
 */
export const validatePassword = (password: string): ValidationError | null => {
    // ⚠️ CRITICAL: Required field check
    if (!password) {
        return { field: 'password', message: 'Password is required' };
    }

    // ⚠️ CRITICAL: Minimum length requirement
    if (password.length < PASSWORD_MIN_LENGTH) {
        return { field: 'password', message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
    }

    // ⚠️ CRITICAL: Must contain at least one number
    if (!/\d/.test(password)) {
        return { field: 'password', message: 'Password must contain at least one number' };
    }

    // ⚠️ CRITICAL: Must contain at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        return { field: 'password', message: 'Password must contain at least one letter' };
    }

    return null;
};

/**
 * 📝 validateSignUpForm - Complete Sign-Up Form Validation
 *
 * Validates all fields in the sign-up form.
 * This is the comprehensive validation used before account creation.
 *
 * ⚠️ CRITICAL VALIDATION CHECKS:
 * - Email format and presence
 * - Password strength requirements
 * - Password confirmation match
 * - Terms agreement requirement
 *
 * BREAKING CHANGES RISK:
 * - Removing any validation allows invalid data
 * - Changing error messages confuses users
 * - Modifying logic breaks form security
 *
 * @param data - Sign-up form data to validate
 * @returns ValidationResult - Array of errors or null if valid
 */
export const validateSignUpForm = (data: SignUpFormData): ValidationResult => {
    const errors: ValidationError[] = [];

    // ⚠️ CRITICAL: Email validation
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);

    // ⚠️ CRITICAL: Password validation
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);

    // ⚠️ CRITICAL: Password confirmation validation
    if (data.password !== data.confirmPassword) {
        errors.push({
            field: 'confirmPassword',
            message: 'Passwords do not match'
        });
    }

    // ⚠️ CRITICAL: Full name validation (required by PRD)
    if (!data.fullName || data.fullName.trim().length === 0) {
        errors.push({
            field: 'fullName',
            message: 'Full name is required'
        });
    }

    // ⚠️ CRITICAL: Age verification validation (required by PRD)
    if (!data.ageVerification) {
        errors.push({
            field: 'ageVerification',
            message: 'You must verify that you are 18 years of age or older'
        });
    }

    // ⚠️ CRITICAL: Terms agreement validation
    // Users MUST agree to terms before account creation
    if (!data.agreeToTerms) {
        errors.push({
            field: 'agreeToTerms',
            message: 'You must agree to the terms and conditions'
        });
    }

    // Return errors array or null if no errors
    return errors.length > 0 ? errors : null;
};

/**
 * 🔑 validateLoginForm - Login Form Validation
 *
 * Validates login form data.
 * Simpler validation since we're checking existing credentials.
 *
 * @param data - Login form data to validate
 * @returns ValidationResult - Array of errors or null if valid
 */
export const validateLoginForm = (data: LoginFormData): ValidationResult => {
    const errors: ValidationError[] = [];

    // ⚠️ CRITICAL: Email validation for login
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);

    // ⚠️ CRITICAL: Password required for login
    if (!data.password) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }

    return errors.length > 0 ? errors : null;
};

/**
 * ✏️ validateProfileUpdate - Profile Update Validation
 *
 * Validates profile update data.
 * Handles optional fields and password changes.
 *
 * @param data - Profile update data to validate
 * @returns ValidationResult - Array of errors or null if valid
 */
export const validateProfileUpdate = (data: ProfileUpdateData): ValidationResult => {
    const errors: ValidationError[] = [];

    // Full name validation (optional but cannot be empty if provided)
    if (data.fullName !== undefined && data.fullName.trim().length === 0) {
        errors.push({
            field: 'fullName',
            message: 'Full name cannot be empty'
        });
    }

    // Display name validation (optional, kept for backward compatibility)
    if (data.displayName !== undefined && data.displayName.trim().length === 0) {
        errors.push({
            field: 'displayName',
            message: 'Display name cannot be empty'
        });
    }

    // Password change validation
    if (data.newPassword) {
        // ⚠️ CRITICAL: Current password required for password change
        if (!data.currentPassword) {
            errors.push({
                field: 'currentPassword',
                message: 'Current password is required to change password'
            });
        }

        // ⚠️ CRITICAL: New password must meet strength requirements
        const passwordError = validatePassword(data.newPassword);
        if (passwordError) {
            errors.push({
                field: 'newPassword',
                message: passwordError.message
            });
        }

        // ⚠️ CRITICAL: Password confirmation must match
        if (data.newPassword !== data.confirmNewPassword) {
            errors.push({
                field: 'confirmNewPassword',
                message: 'New passwords do not match'
            });
        }
    }

    return errors.length > 0 ? errors : null;
};
