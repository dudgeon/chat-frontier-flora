import { useState, useCallback, useMemo } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FieldConfig {
  rules: ValidationRule;
  initialValue?: string;
}

export interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export interface FormState {
  [fieldName: string]: FieldState;
}

export interface UseFormValidationReturn {
  formState: FormState;
  isFormValid: boolean;
  isFormTouched: boolean;
  updateField: (fieldName: string, value: string) => void;
  touchField: (fieldName: string) => void;
  validateField: (fieldName: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  getFieldProps: (fieldName: string) => {
    value: string;
    error: string | null;
    touched: boolean;
    valid: boolean;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
}

export function useFormValidation(
  fieldsConfig: Record<string, FieldConfig>
): UseFormValidationReturn {
  // Initialize form state
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    Object.entries(fieldsConfig).forEach(([fieldName, config]) => {
      initialState[fieldName] = {
        value: config.initialValue || '',
        error: null,
        touched: false,
        valid: !config.rules.required || !!config.initialValue,
      };
    });
    return initialState;
  });

  // Validate a single field
  const validateField = useCallback((fieldName: string, value?: string) => {
    const fieldConfig = fieldsConfig[fieldName];
    if (!fieldConfig) return;

    const fieldValue = value !== undefined ? value : formState[fieldName]?.value || '';
    const rules = fieldConfig.rules;
    let error: string | null = null;

    // Required validation
    if (rules.required && !fieldValue.trim()) {
      error = 'This field is required';
    }
    // Min length validation
    else if (rules.minLength && fieldValue.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters`;
    }
    // Max length validation
    else if (rules.maxLength && fieldValue.length > rules.maxLength) {
      error = `Must be no more than ${rules.maxLength} characters`;
    }
    // Pattern validation
    else if (rules.pattern && !rules.pattern.test(fieldValue)) {
      error = 'Invalid format';
    }
    // Custom validation
    else if (rules.custom) {
      error = rules.custom(fieldValue);
    }

    const isValid = error === null;

    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value: fieldValue,
        error,
        valid: isValid,
      },
    }));

    return isValid;
  }, [fieldsConfig, formState]);

  // Update field value and validate
  const updateField = useCallback((fieldName: string, value: string) => {
    validateField(fieldName, value);
  }, [validateField]);

  // Mark field as touched
  const touchField = useCallback((fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true,
      },
    }));
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    let isValid = true;
    Object.keys(fieldsConfig).forEach(fieldName => {
      const fieldValid = validateField(fieldName);
      if (!fieldValid) {
        isValid = false;
      }
      // Mark all fields as touched during form validation
      touchField(fieldName);
    });
    return isValid;
  }, [fieldsConfig, validateField, touchField]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormState(() => {
      const resetState: FormState = {};
      Object.entries(fieldsConfig).forEach(([fieldName, config]) => {
        resetState[fieldName] = {
          value: config.initialValue || '',
          error: null,
          touched: false,
          valid: !config.rules.required || !!config.initialValue,
        };
      });
      return resetState;
    });
  }, [fieldsConfig]);

  // Get field props for easy integration with form components
  const getFieldProps = useCallback((fieldName: string) => {
    const field = formState[fieldName];
    return {
      value: field?.value || '',
      error: field?.error || null,
      touched: field?.touched || false,
      valid: field?.valid || false,
      onChange: (value: string) => updateField(fieldName, value),
      onBlur: () => touchField(fieldName),
    };
  }, [formState, updateField, touchField]);

  // Computed values
  const isFormValid = useMemo(() => {
    return Object.values(formState).every(field => field.valid);
  }, [formState]);

  const isFormTouched = useMemo(() => {
    return Object.values(formState).some(field => field.touched);
  }, [formState]);

  return {
    formState,
    isFormValid,
    isFormTouched,
    updateField,
    touchField,
    validateField: (fieldName: string) => validateField(fieldName),
    validateForm,
    resetForm,
    getFieldProps,
  };
}
