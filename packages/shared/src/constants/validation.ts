/**
 * 🔍 VALIDATION CONSTANTS AND PATTERNS
 *
 * This module provides standardized validation constants, patterns,
 * and error messages for consistent validation across the application.
 *
 * Features:
 * - Common regex patterns
 * - Standard error messages
 * - Validation rule presets
 * - Field length constraints
 * - Security requirements
 */

// ============================================================================
// REGEX PATTERNS
// ============================================================================

/**
 * 📧 Email validation pattern
 * Matches standard email format with proper domain validation
 */
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 🔐 Password validation patterns
 */
export const PASSWORD_PATTERNS = {
  // At least one uppercase letter
  UPPERCASE: /[A-Z]/,
  // At least one lowercase letter
  LOWERCASE: /[a-z]/,
  // At least one digit
  DIGIT: /\d/,
  // At least one special character
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  // No whitespace
  NO_WHITESPACE: /^\S*$/,
} as const;

/**
 * 📱 Phone number patterns
 */
export const PHONE_PATTERNS = {
  // US phone number (various formats)
  US: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
  // International format
  INTERNATIONAL: /^\+[1-9]\d{1,14}$/,
} as const;

/**
 * 🌐 URL validation pattern
 */
export const URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * 📝 Name validation patterns
 */
export const NAME_PATTERNS = {
  // Basic name (letters, spaces, hyphens, apostrophes)
  BASIC: /^[a-zA-Z\s\-']+$/,
  // Full name (first and last name required)
  FULL_NAME: /^[a-zA-Z]+\s+[a-zA-Z\s\-']+$/,
} as const;

/**
 * 🔢 Numeric patterns
 */
export const NUMERIC_PATTERNS = {
  // Positive integers only
  POSITIVE_INTEGER: /^\d+$/,
  // Decimal numbers
  DECIMAL: /^\d+(\.\d+)?$/,
  // Currency (dollars and cents)
  CURRENCY: /^\d+(\.\d{2})?$/,
} as const;

// ============================================================================
// FIELD LENGTH CONSTRAINTS
// ============================================================================

/**
 * 📏 Standard field length limits
 */
export const FIELD_LENGTHS = {
  // Text fields
  SHORT_TEXT: { min: 1, max: 50 },
  MEDIUM_TEXT: { min: 1, max: 255 },
  LONG_TEXT: { min: 1, max: 1000 },

  // Specific fields
  EMAIL: { min: 5, max: 254 }, // RFC 5321 limit
  PASSWORD: { min: 8, max: 128 },
  FULL_NAME: { min: 2, max: 100 },
  DISPLAY_NAME: { min: 1, max: 50 },
  PHONE: { min: 10, max: 15 },

  // Content fields
  TITLE: { min: 1, max: 200 },
  DESCRIPTION: { min: 1, max: 500 },
  COMMENT: { min: 1, max: 1000 },
} as const;

// ============================================================================
// PASSWORD REQUIREMENTS
// ============================================================================

/**
 * 🔐 Password security requirements
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_DIGIT: true,
  REQUIRE_SPECIAL_CHAR: true,
  DISALLOW_WHITESPACE: true,

  // Common weak passwords to reject
  FORBIDDEN_PASSWORDS: [
    'password',
    '12345678',
    'qwerty123',
    'admin123',
    'letmein',
    'welcome123',
  ],
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * 🚨 Standard error messages for consistent UX
 */
export const ERROR_MESSAGES = {
  // Required field errors
  REQUIRED: 'This field is required',
  REQUIRED_EMAIL: 'Email address is required',
  REQUIRED_PASSWORD: 'Password is required',
  REQUIRED_NAME: 'Name is required',

  // Format errors
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_NAME: 'Name can only contain letters, spaces, hyphens, and apostrophes',

  // Length errors
  TOO_SHORT: (min: number) => `Must be at least ${min} characters`,
  TOO_LONG: (max: number) => `Must be no more than ${max} characters`,
  EXACT_LENGTH: (length: number) => `Must be exactly ${length} characters`,

  // Password specific errors
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must be no more than ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`,
  PASSWORD_MISSING_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_MISSING_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_MISSING_DIGIT: 'Password must contain at least one number',
  PASSWORD_MISSING_SPECIAL: 'Password must contain at least one special character',
  PASSWORD_HAS_WHITESPACE: 'Password cannot contain spaces',
  PASSWORD_TOO_WEAK: 'Password is too common or weak',
  PASSWORD_MISMATCH: 'Passwords do not match',

  // Numeric errors
  NOT_A_NUMBER: 'Must be a valid number',
  NOT_POSITIVE: 'Must be a positive number',
  OUT_OF_RANGE: (min: number, max: number) => `Must be between ${min} and ${max}`,

  // Date errors
  INVALID_DATE: 'Please enter a valid date',
  DATE_TOO_EARLY: (minDate: string) => `Date must be after ${minDate}`,
  DATE_TOO_LATE: (maxDate: string) => `Date must be before ${maxDate}`,

  // Age verification
  AGE_VERIFICATION_REQUIRED: 'You must verify that you are 18 years of age or older',

  // Terms and consent
  TERMS_REQUIRED: 'You must agree to the terms and conditions',
  CONSENT_REQUIRED: 'You must provide consent to continue',
  DEVELOPMENT_CONSENT_REQUIRED: 'You must consent to data usage for development purposes',

  // Form submission
  FORM_INVALID: 'Please fix all form errors before submitting',
  FORM_INCOMPLETE: 'Please complete all required fields',
  SUBMISSION_FAILED: 'Failed to submit form. Please try again.',
} as const;

// ============================================================================
// WARNING MESSAGES
// ============================================================================

/**
 * ⚠️ Standard warning messages for user guidance
 */
export const WARNING_MESSAGES = {
  PASSWORD_WEAK: 'Consider using a stronger password',
  EMAIL_UNUSUAL: 'This email format is unusual but valid',
  FORM_UNSAVED: 'You have unsaved changes',
  SLOW_CONNECTION: 'Validation may be slower due to connection',
} as const;

// ============================================================================
// VALIDATION RULE PRESETS
// ============================================================================

/**
 * 🎯 Common validation rule presets for quick setup
 */
export const VALIDATION_PRESETS = {
  EMAIL: {
    type: 'email' as const,
    required: true,
    pattern: EMAIL_PATTERN,
    minLength: FIELD_LENGTHS.EMAIL.min,
    maxLength: FIELD_LENGTHS.EMAIL.max,
    message: ERROR_MESSAGES.INVALID_EMAIL,
  },

  PASSWORD: {
    type: 'password' as const,
    required: true,
    minLength: PASSWORD_REQUIREMENTS.MIN_LENGTH,
    maxLength: PASSWORD_REQUIREMENTS.MAX_LENGTH,
    message: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
  },

  FULL_NAME: {
    type: 'custom' as const,
    required: true,
    pattern: NAME_PATTERNS.FULL_NAME,
    minLength: FIELD_LENGTHS.FULL_NAME.min,
    maxLength: FIELD_LENGTHS.FULL_NAME.max,
    message: 'Please enter your first and last name',
  },

  PHONE: {
    type: 'pattern' as const,
    required: false,
    pattern: PHONE_PATTERNS.US,
    message: ERROR_MESSAGES.INVALID_PHONE,
  },

  URL: {
    type: 'url' as const,
    required: false,
    pattern: URL_PATTERN,
    message: ERROR_MESSAGES.INVALID_URL,
  },
} as const;

// ============================================================================
// VALIDATION TIMING CONSTANTS
// ============================================================================

/**
 * ⏱️ Timing constants for validation behavior
 */
export const VALIDATION_TIMING = {
  // Debounce delays (ms)
  DEBOUNCE_SHORT: 150,
  DEBOUNCE_MEDIUM: 300,
  DEBOUNCE_LONG: 500,

  // Async validation timeout
  ASYNC_TIMEOUT: 5000,

  // Error display delays
  ERROR_DISPLAY_DELAY: 100,
  WARNING_DISPLAY_DELAY: 500,

  // Submit button cooldown
  SUBMIT_COOLDOWN: 1000,
} as const;

// ============================================================================
// ACCESSIBILITY CONSTANTS
// ============================================================================

/**
 * ♿ Accessibility constants for validation
 */
export const A11Y_CONSTANTS = {
  // ARIA live region politeness levels
  ERROR_POLITENESS: 'assertive' as const,
  WARNING_POLITENESS: 'polite' as const,

  // Error announcement delays
  ERROR_ANNOUNCEMENT_DELAY: 100,
  WARNING_ANNOUNCEMENT_DELAY: 500,

  // Screen reader messages
  FIELD_INVALID: 'Invalid',
  FIELD_VALID: 'Valid',
  FIELD_REQUIRED: 'Required',
  FORM_ERRORS: (count: number) => `Form has ${count} error${count === 1 ? '' : 's'}`,
} as const;
