/**
 * 🔍 VALIDATION STATE TYPES AND INTERFACES
 *
 * This module provides comprehensive type definitions for validation
 * state management across the application. These types ensure
 * consistent validation behavior and type safety.
 *
 * Features:
 * - Field-level validation state
 * - Form-level validation state
 * - Validation rule definitions
 * - Error handling types
 * - Completion tracking types
 * - Submit button state types
 */

// ============================================================================
// CORE VALIDATION TYPES
// ============================================================================

/**
 * 📝 ValidationSeverity - Error severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * 🚨 ValidationError - Individual field validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  severity?: ValidationSeverity;
  code?: string; // Error code for programmatic handling
}

/**
 * 📋 ValidationResult - Result of validation operation
 */
export type ValidationResult = ValidationError[] | null;

/**
 * ✅ ValidationStatus - Overall validation status
 */
export type ValidationStatus = 'valid' | 'invalid' | 'pending' | 'untouched';

// ============================================================================
// VALIDATION RULE TYPES
// ============================================================================

/**
 * 📏 ValidationRuleType - Types of validation rules
 */
export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'password'
  | 'custom'
  | 'confirmation'
  | 'numeric'
  | 'url'
  | 'date';

/**
 * 🔧 ValidationRule - Individual validation rule configuration
 */
export interface ValidationRule {
  type: ValidationRuleType;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
  custom?: (value: string, formData?: Record<string, any>) => string | null;
  // For confirmation fields (e.g., confirm password)
  confirmationField?: string;
  // For numeric validation
  min?: number;
  max?: number;
  // For date validation
  minDate?: Date;
  maxDate?: Date;
}

/**
 * 📝 FieldValidationConfig - Complete field validation configuration
 */
export interface FieldValidationConfig {
  rules: ValidationRule[];
  initialValue?: string;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number; // Debounce validation for performance
}

// ============================================================================
// FIELD STATE TYPES
// ============================================================================

/**
 * 🎯 FieldState - Complete state for a single form field
 */
export interface FieldState {
  // Value and basic state
  value: string;
  initialValue: string;

  // Validation state
  isValid: boolean;
  isInvalid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];

  // Interaction state
  isTouched: boolean;
  isFocused: boolean;
  isDirty: boolean; // Value has changed from initial

  // Completion state
  isCompleted: boolean;
  isRequired: boolean;

  // Async validation state
  isValidating: boolean;
  lastValidated?: Date;
}

/**
 * 📊 FieldValidationState - Validation-specific field state
 */
export interface FieldValidationState {
  status: ValidationStatus;
  errors: ValidationError[];
  warnings: ValidationError[];
  isValidating: boolean;
  lastValidationTime?: Date;
}

// ============================================================================
// FORM STATE TYPES
// ============================================================================

/**
 * 📋 FormState - Complete state for entire form
 */
export interface FormState {
  [fieldName: string]: FieldState;
}

/**
 * 📊 FormValidationState - Form-level validation state
 */
export interface FormValidationState {
  // Overall validation status
  isValid: boolean;
  isInvalid: boolean;
  isPending: boolean;

  // Interaction state
  isTouched: boolean;
  isDirty: boolean;
  isSubmitting: boolean;

  // Completion state
  isCompleted: boolean;
  completionPercentage: number;
  completedFieldsCount: number;
  totalRequiredFieldsCount: number;

  // Error aggregation
  errors: ValidationError[];
  warnings: ValidationError[];
  fieldErrors: Record<string, ValidationError[]>;

  // Submission state
  canSubmit: boolean;
  submitAttempts: number;
  lastSubmitTime?: Date;
}

// ============================================================================
// VALIDATION CONTEXT TYPES
// ============================================================================

/**
 * 🎛️ ValidationConfig - Global validation configuration
 */
export interface ValidationConfig {
  // Validation timing
  validateOnChange: boolean;
  validateOnBlur: boolean;
  validateOnSubmit: boolean;

  // Performance settings
  debounceMs: number;
  enableAsyncValidation: boolean;

  // UI behavior
  showErrorsImmediately: boolean;
  showWarnings: boolean;
  highlightInvalidFields: boolean;

  // Accessibility
  announceErrors: boolean;
  errorAnnouncementDelay: number;
}

/**
 * 🔄 ValidationContext - Context for validation operations
 */
export interface ValidationContext {
  formData: Record<string, any>;
  fieldConfigs: Record<string, FieldValidationConfig>;
  config: ValidationConfig;
  isSubmitting: boolean;
}

// ============================================================================
// VALIDATION HOOK TYPES
// ============================================================================

/**
 * 🎣 UseFieldValidationReturn - Return type for field validation hook
 */
export interface UseFieldValidationReturn {
  // Field state
  fieldState: FieldState;

  // Actions
  setValue: (value: string) => void;
  setTouched: (touched?: boolean) => void;
  setFocused: (focused: boolean) => void;
  validate: () => Promise<boolean>;
  reset: () => void;

  // Computed properties
  hasErrors: boolean;
  hasWarnings: boolean;
  displayError: string | null;
  displayWarning: string | null;
}

/**
 * 🎣 UseFormValidationReturn - Return type for form validation hook
 */
export interface UseFormValidationReturn {
  // Form state
  formState: FormState;
  validationState: FormValidationState;

  // Field operations
  updateField: (fieldName: string, value: string) => void;
  touchField: (fieldName: string) => void;
  focusField: (fieldName: string) => void;
  validateField: (fieldName: string) => Promise<boolean>;
  resetField: (fieldName: string) => void;

  // Form operations
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  submitForm: () => Promise<boolean>;

  // Computed properties
  isFormValid: boolean;
  isFormTouched: boolean;
  isFormCompleted: boolean;
  canSubmit: boolean;

  // Field helpers
  getFieldProps: (fieldName: string) => {
    value: string;
    error: string | null;
    warning: string | null;
    touched: boolean;
    focused: boolean;
    valid: boolean;
    completed: boolean;
    onChange: (value: string) => void;
    onBlur: () => void;
    onFocus: () => void;
  };

  isFieldCompleted: (fieldName: string) => boolean;
  getFieldError: (fieldName: string) => string | null;
  getFieldWarning: (fieldName: string) => string | null;
}

// ============================================================================
// SUBMIT BUTTON STATE TYPES
// ============================================================================

/**
 * 🔘 SubmitButtonState - Submit button state management
 */
export interface SubmitButtonState {
  // Button state
  isDisabled: boolean;
  isEnabled: boolean;
  isLoading: boolean;

  // Visual state
  buttonText: string;
  buttonStyle: 'default' | 'disabled' | 'loading' | 'ready' | 'error';

  // Accessibility
  accessibilityLabel: string;
  accessibilityHint: string;

  // Feedback
  disabledReason: string | null;
  canSubmit: boolean;

  // Progress indication
  showProgress: boolean;
  progressPercentage: number;
}

/**
 * ⚙️ SubmitButtonConfig - Submit button configuration
 */
export interface SubmitButtonConfig {
  // Validation requirements
  isFormValid: boolean;
  isFormTouched: boolean;
  isFormCompleted?: boolean;

  // Loading state
  isLoading: boolean;

  // Custom validation
  customValidation?: () => boolean;

  // Button text configuration
  defaultText: string;
  loadingText: string;
  disabledText?: string;
  errorText?: string;

  // Requirements
  requireCompletion?: boolean;
  requireTouched?: boolean;
  minCompletionPercentage?: number;
  currentCompletionPercentage?: number;

  // Behavior
  preventMultipleSubmits?: boolean;
  submitCooldownMs?: number;
}

// ============================================================================
// VALIDATION UTILITY TYPES
// ============================================================================

/**
 * 🔧 ValidatorFunction - Generic validator function type
 */
export type ValidatorFunction<T = string> = (
  value: T,
  context?: ValidationContext
) => ValidationError | null;

/**
 * 🔧 AsyncValidatorFunction - Async validator function type
 */
export type AsyncValidatorFunction<T = string> = (
  value: T,
  context?: ValidationContext
) => Promise<ValidationError | null>;

/**
 * 📝 FormValidatorFunction - Form-level validator function type
 */
export type FormValidatorFunction = (
  formData: Record<string, any>,
  context?: ValidationContext
) => ValidationResult;

/**
 * 🎯 ValidationTrigger - When validation should be triggered
 */
export type ValidationTrigger = 'change' | 'blur' | 'focus' | 'submit' | 'manual';

/**
 * 📊 ValidationMetrics - Validation performance metrics
 */
export interface ValidationMetrics {
  totalValidations: number;
  averageValidationTime: number;
  errorRate: number;
  lastValidationTime: Date;
  slowValidations: number; // Validations taking > threshold
}

// ============================================================================
// FORM SCHEMA TYPES
// ============================================================================

/**
 * 📋 FormSchema - Complete form validation schema
 */
export interface FormSchema {
  fields: Record<string, FieldValidationConfig>;
  formValidators?: FormValidatorFunction[];
  config?: Partial<ValidationConfig>;
  metadata?: {
    name: string;
    version: string;
    description?: string;
  };
}

/**
 * 🏗️ FormSchemaBuilder - Builder pattern for form schemas
 */
export interface FormSchemaBuilder {
  addField: (name: string, config: FieldValidationConfig) => FormSchemaBuilder;
  addFormValidator: (validator: FormValidatorFunction) => FormSchemaBuilder;
  setConfig: (config: Partial<ValidationConfig>) => FormSchemaBuilder;
  build: () => FormSchema;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Re-export for backward compatibility
  ValidationError as LegacyValidationError,
  ValidationResult as LegacyValidationResult,
};
