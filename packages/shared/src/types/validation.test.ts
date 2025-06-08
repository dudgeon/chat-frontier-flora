/**
 * 🧪 VALIDATION TYPES TESTS
 *
 * Tests to verify that validation types and interfaces work correctly
 * and provide proper type safety across the application.
 */

import {
  ValidationError,
  ValidationResult,
  ValidationStatus,
  ValidationRule,
  FieldState,
  FormValidationState,
  SubmitButtonState,
  SubmitButtonConfig,
  ValidatorFunction,
  FormSchema,
} from './validation';

describe('Validation Types', () => {
  describe('ValidationError', () => {
    it('should create a basic validation error', () => {
      const error: ValidationError = {
        field: 'email',
        message: 'Invalid email format',
      };

      expect(error.field).toBe('email');
      expect(error.message).toBe('Invalid email format');
    });

    it('should create a validation error with severity and code', () => {
      const error: ValidationError = {
        field: 'password',
        message: 'Password too weak',
        severity: 'warning',
        code: 'WEAK_PASSWORD',
      };

      expect(error.severity).toBe('warning');
      expect(error.code).toBe('WEAK_PASSWORD');
    });
  });

  describe('ValidationResult', () => {
    it('should handle null result for valid input', () => {
      const result: ValidationResult = null;
      expect(result).toBeNull();
    });

    it('should handle array of errors for invalid input', () => {
      const result: ValidationResult = [
        { field: 'email', message: 'Required' },
        { field: 'password', message: 'Too short' },
      ];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });
  });

  describe('ValidationStatus', () => {
    it('should accept all valid status values', () => {
      const statuses: ValidationStatus[] = ['valid', 'invalid', 'pending', 'untouched'];

      statuses.forEach(status => {
        expect(['valid', 'invalid', 'pending', 'untouched']).toContain(status);
      });
    });
  });

  describe('ValidationRule', () => {
    it('should create a required field rule', () => {
      const rule: ValidationRule = {
        type: 'required',
        required: true,
        message: 'This field is required',
      };

      expect(rule.type).toBe('required');
      expect(rule.required).toBe(true);
    });

    it('should create a pattern validation rule', () => {
      const rule: ValidationRule = {
        type: 'pattern',
        pattern: /^[a-zA-Z]+$/,
        message: 'Only letters allowed',
      };

      expect(rule.pattern).toBeInstanceOf(RegExp);
    });

    it('should create a custom validation rule', () => {
      const rule: ValidationRule = {
        type: 'custom',
        custom: (value: string) => {
          return value.length > 5 ? null : 'Too short';
        },
      };

      expect(typeof rule.custom).toBe('function');
      expect(rule.custom!('test')).toBe('Too short');
      expect(rule.custom!('testing')).toBeNull();
    });
  });

  describe('FieldState', () => {
    it('should create a complete field state', () => {
      const fieldState: FieldState = {
        value: 'test@example.com',
        initialValue: '',
        isValid: true,
        isInvalid: false,
        errors: [],
        warnings: [],
        isTouched: true,
        isFocused: false,
        isDirty: true,
        isCompleted: true,
        isRequired: true,
        isValidating: false,
      };

      expect(fieldState.value).toBe('test@example.com');
      expect(fieldState.isValid).toBe(true);
      expect(fieldState.isDirty).toBe(true);
    });

    it('should handle field state with errors', () => {
      const fieldState: FieldState = {
        value: 'invalid-email',
        initialValue: '',
        isValid: false,
        isInvalid: true,
        errors: [{ field: 'email', message: 'Invalid format' }],
        warnings: [],
        isTouched: true,
        isFocused: false,
        isDirty: true,
        isCompleted: false,
        isRequired: true,
        isValidating: false,
      };

      expect(fieldState.isInvalid).toBe(true);
      expect(fieldState.errors).toHaveLength(1);
    });
  });

  describe('FormValidationState', () => {
    it('should create a complete form validation state', () => {
      const formState: FormValidationState = {
        isValid: true,
        isInvalid: false,
        isPending: false,
        isTouched: true,
        isDirty: true,
        isSubmitting: false,
        isCompleted: true,
        completionPercentage: 100,
        completedFieldsCount: 3,
        totalRequiredFieldsCount: 3,
        errors: [],
        warnings: [],
        fieldErrors: {},
        canSubmit: true,
        submitAttempts: 0,
      };

      expect(formState.isValid).toBe(true);
      expect(formState.completionPercentage).toBe(100);
      expect(formState.canSubmit).toBe(true);
    });
  });

  describe('SubmitButtonState', () => {
    it('should create a submit button state', () => {
      const buttonState: SubmitButtonState = {
        isDisabled: false,
        isEnabled: true,
        isLoading: false,
        buttonText: 'Submit',
        buttonStyle: 'ready',
        accessibilityLabel: 'Submit form',
        accessibilityHint: 'Double tap to submit',
        disabledReason: null,
        canSubmit: true,
        showProgress: false,
        progressPercentage: 100,
      };

      expect(buttonState.isEnabled).toBe(true);
      expect(buttonState.buttonStyle).toBe('ready');
    });
  });

  describe('SubmitButtonConfig', () => {
    it('should create a submit button configuration', () => {
      const config: SubmitButtonConfig = {
        isFormValid: true,
        isFormTouched: true,
        isFormCompleted: true,
        isLoading: false,
        defaultText: 'Submit',
        loadingText: 'Submitting...',
        requireCompletion: true,
        minCompletionPercentage: 100,
        currentCompletionPercentage: 100,
      };

      expect(config.requireCompletion).toBe(true);
      expect(config.minCompletionPercentage).toBe(100);
    });
  });

  describe('ValidatorFunction', () => {
    it('should create a validator function', () => {
      const validator: ValidatorFunction = (value: string) => {
        if (!value) {
          return { field: 'test', message: 'Required' };
        }
        return null;
      };

      expect(validator('')).toEqual({ field: 'test', message: 'Required' });
      expect(validator('valid')).toBeNull();
    });
  });

  describe('FormSchema', () => {
    it('should create a form schema', () => {
      const schema: FormSchema = {
        fields: {
          email: {
            rules: [
              {
                type: 'required',
                required: true,
              },
              {
                type: 'email',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              },
            ],
          },
          password: {
            rules: [
              {
                type: 'required',
                required: true,
              },
              {
                type: 'minLength',
                minLength: 8,
              },
            ],
          },
        },
        metadata: {
          name: 'SignUpForm',
          version: '1.0.0',
          description: 'User registration form',
        },
      };

      expect(schema.fields.email.rules).toHaveLength(2);
      expect(schema.fields.password.rules).toHaveLength(2);
      expect(schema.metadata?.name).toBe('SignUpForm');
    });
  });

  describe('Type Safety', () => {
    it('should enforce correct ValidationStatus values', () => {
      // This test ensures TypeScript compilation catches invalid status values
      const validStatuses: ValidationStatus[] = ['valid', 'invalid', 'pending', 'untouched'];

      validStatuses.forEach(status => {
        const testStatus: ValidationStatus = status;
        expect(testStatus).toBe(status);
      });
    });

    it('should enforce correct button style values', () => {
      const validStyles: SubmitButtonState['buttonStyle'][] = [
        'default', 'disabled', 'loading', 'ready', 'error'
      ];

      validStyles.forEach(style => {
        const buttonState: Partial<SubmitButtonState> = {
          buttonStyle: style,
        };
        expect(buttonState.buttonStyle).toBe(style);
      });
    });
  });
});
