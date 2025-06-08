import { renderHook } from '@testing-library/react';
import { useSubmitButton, SubmitButtonConfig } from './useSubmitButton';

describe('useSubmitButton', () => {
  const baseConfig: SubmitButtonConfig = {
    isFormValid: true,
    isFormTouched: true,
    isFormCompleted: true,
    isLoading: false,
    defaultText: 'Submit',
    loadingText: 'Submitting...',
  };

  it('should return enabled state when all conditions are met', () => {
    const { result } = renderHook(() => useSubmitButton(baseConfig));

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.buttonText).toBe('Submit');
    expect(result.current.buttonStyle).toBe('ready');
    expect(result.current.canSubmit).toBe(true);
    expect(result.current.disabledReason).toBeNull();
  });

  it('should disable button when form is invalid', () => {
    const config = { ...baseConfig, isFormValid: false };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.buttonStyle).toBe('disabled');
    expect(result.current.disabledReason).toBe('Please fix all form errors');
    expect(result.current.canSubmit).toBe(false);
  });

  it('should disable button when loading', () => {
    const config = { ...baseConfig, isLoading: true };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.buttonStyle).toBe('loading');
    expect(result.current.buttonText).toBe('Submitting...');
    expect(result.current.canSubmit).toBe(false);
  });

  it('should disable button when completion is required but not met', () => {
    const config = {
      ...baseConfig,
      isFormCompleted: false,
      requireCompletion: true,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.buttonStyle).toBe('disabled');
    expect(result.current.disabledReason).toBe('Please complete all required fields');
  });

  it('should disable button when touched is required but not met', () => {
    const config = {
      ...baseConfig,
      isFormTouched: false,
      requireTouched: true,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.buttonStyle).toBe('disabled');
    expect(result.current.disabledReason).toBe('Please fill out the form');
  });

  it('should disable button when minimum completion percentage not met', () => {
    const config = {
      ...baseConfig,
      minCompletionPercentage: 80,
      currentCompletionPercentage: 60,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.buttonStyle).toBe('disabled');
    expect(result.current.disabledReason).toBe('Form must be at least 80% complete');
  });

  it('should disable button when custom validation fails', () => {
    const config = {
      ...baseConfig,
      customValidation: () => false,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.buttonStyle).toBe('disabled');
    expect(result.current.disabledReason).toBe('Additional validation required');
  });

  it('should use disabled text when provided and button is disabled', () => {
    const config = {
      ...baseConfig,
      isFormValid: false,
      disabledText: 'Fix Errors',
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.buttonText).toBe('Fix Errors');
  });

  it('should provide correct accessibility properties', () => {
    const { result } = renderHook(() => useSubmitButton(baseConfig));

    expect(result.current.accessibilityLabel).toBe('Submit. Form is ready to submit.');
    expect(result.current.accessibilityHint).toBe('Double tap to submit the form');
  });

  it('should provide loading accessibility properties', () => {
    const config = { ...baseConfig, isLoading: true };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.accessibilityLabel).toBe('Submitting.... Please wait.');
    expect(result.current.accessibilityHint).toBe('Processing your request');
  });

  it('should provide disabled accessibility properties', () => {
    const config = { ...baseConfig, isFormValid: false };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.accessibilityLabel).toBe('Submit button disabled. Please fix all form errors');
    expect(result.current.accessibilityHint).toBe('Please fix all form errors');
  });

  it('should show progress when minimum completion percentage is set', () => {
    const config = {
      ...baseConfig,
      minCompletionPercentage: 50,
      currentCompletionPercentage: 75,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.showProgress).toBe(true);
    expect(result.current.progressPercentage).toBe(75);
  });

  it('should not show progress when minimum completion percentage is 0', () => {
    const config = {
      ...baseConfig,
      minCompletionPercentage: 0,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.showProgress).toBe(false);
  });

  it('should prioritize loading state over other disabled states', () => {
    const config = {
      ...baseConfig,
      isLoading: true,
      isFormValid: false, // This should be ignored when loading
    };
    const { result } = renderHook(() => useSubmitButton(config));

    expect(result.current.buttonStyle).toBe('loading');
    expect(result.current.buttonText).toBe('Submitting...');
  });

  it('should handle multiple disabled conditions correctly', () => {
    const config = {
      ...baseConfig,
      isFormValid: false,
      isFormCompleted: false,
      requireCompletion: true,
    };
    const { result } = renderHook(() => useSubmitButton(config));

    // Should show the first failing condition (form validity)
    expect(result.current.disabledReason).toBe('Please fix all form errors');
    expect(result.current.buttonStyle).toBe('disabled');
  });
});
