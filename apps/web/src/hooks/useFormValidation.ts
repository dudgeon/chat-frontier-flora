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
  completed: boolean;
}

export interface FormState {
  [fieldName: string]: FieldState;
}

export interface UseFormValidationReturn {
  formState: FormState;
  isFormValid: boolean;
  isFormTouched: boolean;
  isFormCompleted: boolean;
  completionPercentage: number;
  completedFieldsCount: number;
  totalRequiredFieldsCount: number;
  updateField: (fieldName: string, value: string) => void;
  touchField: (fieldName: string) => void;
  validateField: (fieldName: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  isFieldCompleted: (fieldName: string) => boolean;
  getFieldProps: (fieldName: string) => {
    value: string;
    error: string | null;
    touched: boolean;
    valid: boolean;
    completed: boolean;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
}

const isFieldValueCompleted = (value: string, rules: ValidationRule): boolean => {
  if (rules.required && !value.trim()) {
    return false;
  }

  if (!rules.required) {
    return true;
  }

  if (rules.minLength && value.trim().length < rules.minLength) {
    return false;
  }

  return value.trim().length > 0;
};

export function useFormValidation(
  fieldsConfig: Record<string, FieldConfig>
): UseFormValidationReturn {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    Object.entries(fieldsConfig).forEach(([fieldName, config]) => {
      const initialValue = config.initialValue || '';
      initialState[fieldName] = {
        value: initialValue,
        error: null,
        touched: false,
        valid: !config.rules.required || !!initialValue,
        completed: isFieldValueCompleted(initialValue, config.rules),
      };
    });
    return initialState;
  });

  const validateField = useCallback((fieldName: string, value?: string) => {
    const fieldConfig = fieldsConfig[fieldName];
    if (!fieldConfig) return;

    const fieldValue = value !== undefined ? value : formState[fieldName]?.value || '';
    const rules = fieldConfig.rules;
    let error: string | null = null;

    if (rules.required && !fieldValue.trim()) {
      error = 'This field is required';
    }
    else if (rules.minLength && fieldValue.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters`;
    }
    else if (rules.maxLength && fieldValue.length > rules.maxLength) {
      error = `Must be no more than ${rules.maxLength} characters`;
    }
    else if (rules.pattern && !rules.pattern.test(fieldValue)) {
      error = 'Invalid format';
    }
    else if (rules.custom) {
      error = rules.custom(fieldValue);
    }

    const isValid = error === null;
    const isCompleted = isFieldValueCompleted(fieldValue, rules);

    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value: fieldValue,
        error,
        valid: isValid,
        completed: isCompleted,
      },
    }));

    return isValid;
  }, [fieldsConfig, formState]);

  const updateField = useCallback((fieldName: string, value: string) => {
    validateField(fieldName, value);
  }, [validateField]);

  const touchField = useCallback((fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true,
      },
    }));
  }, []);

  const isFieldCompleted = useCallback((fieldName: string): boolean => {
    return formState[fieldName]?.completed || false;
  }, [formState]);

  const validateForm = useCallback(() => {
    let isValid = true;
    Object.keys(fieldsConfig).forEach(fieldName => {
      const fieldValid = validateField(fieldName);
      if (!fieldValid) {
        isValid = false;
      }
      touchField(fieldName);
    });
    return isValid;
  }, [fieldsConfig, validateField, touchField]);

  const resetForm = useCallback(() => {
    setFormState(() => {
      const resetState: FormState = {};
      Object.entries(fieldsConfig).forEach(([fieldName, config]) => {
        const initialValue = config.initialValue || '';
        resetState[fieldName] = {
          value: initialValue,
          error: null,
          touched: false,
          valid: !config.rules.required || !!initialValue,
          completed: isFieldValueCompleted(initialValue, config.rules),
        };
      });
      return resetState;
    });
  }, [fieldsConfig]);

  const getFieldProps = useCallback((fieldName: string) => {
    const field = formState[fieldName];
    return {
      value: field?.value || '',
      error: field?.error || null,
      touched: field?.touched || false,
      valid: field?.valid || false,
      completed: field?.completed || false,
      onChange: (value: string) => updateField(fieldName, value),
      onBlur: () => touchField(fieldName),
    };
  }, [formState, updateField, touchField]);

  const isFormValid = useMemo(() => {
    return Object.values(formState).every(field => field.valid);
  }, [formState]);

  const isFormTouched = useMemo(() => {
    return Object.values(formState).some(field => field.touched);
  }, [formState]);

  const totalRequiredFieldsCount = useMemo(() => {
    return Object.values(fieldsConfig).filter(config => config.rules.required).length;
  }, [fieldsConfig]);

  const completedFieldsCount = useMemo(() => {
    return Object.entries(formState)
      .filter(([fieldName, field]) => {
        const config = fieldsConfig[fieldName];
        return config?.rules.required && field.completed;
      }).length;
  }, [formState, fieldsConfig]);

  const completionPercentage = useMemo(() => {
    if (totalRequiredFieldsCount === 0) return 100;
    return Math.round((completedFieldsCount / totalRequiredFieldsCount) * 100);
  }, [completedFieldsCount, totalRequiredFieldsCount]);

  const isFormCompleted = useMemo(() => {
    return completionPercentage === 100;
  }, [completionPercentage]);

  return {
    formState,
    isFormValid,
    isFormTouched,
    isFormCompleted,
    completionPercentage,
    completedFieldsCount,
    totalRequiredFieldsCount,
    updateField,
    touchField,
    validateField: (fieldName: string) => validateField(fieldName),
    validateForm,
    resetForm,
    isFieldCompleted,
    getFieldProps,
  };
}
