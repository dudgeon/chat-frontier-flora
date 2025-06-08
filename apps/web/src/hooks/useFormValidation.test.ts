import { renderHook, act } from '@testing-library/react';
import { useFormValidation, FieldConfig } from './useFormValidation';

describe('useFormValidation - Completion Tracking', () => {
  const testConfig: Record<string, FieldConfig> = {
    email: {
      rules: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    password: {
      rules: {
        required: true,
        minLength: 8,
      },
    },
    confirmPassword: {
      rules: {
        required: true,
      },
    },
    optionalField: {
      rules: {
        required: false,
      },
    },
  };

  it('should initialize with correct completion tracking values', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    expect(result.current.isFormCompleted).toBe(false);
    expect(result.current.completionPercentage).toBe(0);
    expect(result.current.completedFieldsCount).toBe(0);
    expect(result.current.totalRequiredFieldsCount).toBe(3); // email, password, confirmPassword
  });

  it('should track field completion correctly', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    // Initially no fields are completed
    expect(result.current.isFieldCompleted('email')).toBe(false);
    expect(result.current.isFieldCompleted('password')).toBe(false);

    // Complete email field
    act(() => {
      result.current.updateField('email', 'test@example.com');
    });

    expect(result.current.isFieldCompleted('email')).toBe(true);
    expect(result.current.completedFieldsCount).toBe(1);
    expect(result.current.completionPercentage).toBe(33); // 1/3 = 33%

    // Complete password field
    act(() => {
      result.current.updateField('password', 'password123');
    });

    expect(result.current.isFieldCompleted('password')).toBe(true);
    expect(result.current.completedFieldsCount).toBe(2);
    expect(result.current.completionPercentage).toBe(67); // 2/3 = 67%

    // Complete confirmPassword field
    act(() => {
      result.current.updateField('confirmPassword', 'password123');
    });

    expect(result.current.isFieldCompleted('confirmPassword')).toBe(true);
    expect(result.current.completedFieldsCount).toBe(3);
    expect(result.current.completionPercentage).toBe(100); // 3/3 = 100%
    expect(result.current.isFormCompleted).toBe(true);
  });

  it('should not count optional fields in completion tracking', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    // Optional field should be considered completed by default
    expect(result.current.isFieldCompleted('optionalField')).toBe(true);

    // Adding content to optional field should not affect completion count
    act(() => {
      result.current.updateField('optionalField', 'some content');
    });

    expect(result.current.totalRequiredFieldsCount).toBe(3); // Still only 3 required fields
  });

  it('should handle minimum length requirements for completion', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    // Password with less than minimum length should not be completed
    act(() => {
      result.current.updateField('password', 'short');
    });

    expect(result.current.isFieldCompleted('password')).toBe(false);
    expect(result.current.completedFieldsCount).toBe(0);

    // Password meeting minimum length should be completed
    act(() => {
      result.current.updateField('password', 'longenough');
    });

    expect(result.current.isFieldCompleted('password')).toBe(true);
    expect(result.current.completedFieldsCount).toBe(1);
  });

  it('should include completion status in field props', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    // Initially not completed
    expect(result.current.getFieldProps('email').completed).toBe(false);

    // After adding valid content
    act(() => {
      result.current.updateField('email', 'test@example.com');
    });

    expect(result.current.getFieldProps('email').completed).toBe(true);
  });

  it('should reset completion tracking when form is reset', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    // Complete some fields
    act(() => {
      result.current.updateField('email', 'test@example.com');
      result.current.updateField('password', 'password123');
    });

    expect(result.current.completedFieldsCount).toBe(2);

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.completedFieldsCount).toBe(0);
    expect(result.current.completionPercentage).toBe(0);
    expect(result.current.isFormCompleted).toBe(false);
  });

  it('should validate form correctly', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    // Initially invalid
    expect(result.current.isFormValid).toBe(false);

    // Fill all required fields correctly
    act(() => {
      result.current.updateField('email', 'test@example.com');
      result.current.updateField('password', 'password123');
      result.current.updateField('confirmPassword', 'password123');
    });

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.isFormCompleted).toBe(true);
  });

  it('should handle field props correctly', () => {
    const { result } = renderHook(() => useFormValidation(testConfig));

    const emailProps = result.current.getFieldProps('email');

    expect(emailProps).toHaveProperty('value');
    expect(emailProps).toHaveProperty('error');
    expect(emailProps).toHaveProperty('touched');
    expect(emailProps).toHaveProperty('valid');
    expect(emailProps).toHaveProperty('completed');
    expect(emailProps).toHaveProperty('onChange');
    expect(emailProps).toHaveProperty('onBlur');

    // Test onChange callback
    act(() => {
      emailProps.onChange('new@email.com');
    });

    expect(result.current.getFieldProps('email').value).toBe('new@email.com');
  });
});
