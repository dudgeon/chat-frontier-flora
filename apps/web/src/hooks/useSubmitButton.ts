import { useMemo } from 'react';

/**
 * 🔘 SUBMIT BUTTON STATE MANAGEMENT HOOK
 *
 * This hook provides comprehensive state management for submit buttons,
 * including validation checks, loading states, completion tracking,
 * and user-friendly feedback messages.
 *
 * Features:
 * - Multi-condition button state management
 * - Dynamic button text based on state
 * - Accessibility support
 * - Customizable validation requirements
 * - Loading state handling
 * - Completion percentage integration
 */

export interface SubmitButtonConfig {
  // Validation requirements
  isFormValid: boolean;
  isFormTouched: boolean;
  isFormCompleted?: boolean;

  // Loading state
  isLoading: boolean;

  // Custom validation function
  customValidation?: () => boolean;

  // Button text configuration
  defaultText: string;
  loadingText: string;
  disabledText?: string;

  // Completion requirements
  requireCompletion?: boolean; // If true, button disabled until form is completed
  requireTouched?: boolean; // If true, button disabled until form is touched

  // Minimum completion percentage required (0-100)
  minCompletionPercentage?: number;
  currentCompletionPercentage?: number;
}

export interface SubmitButtonState {
  // Button state
  isDisabled: boolean;
  isEnabled: boolean;

  // Visual state
  buttonText: string;
  buttonStyle: 'default' | 'disabled' | 'loading' | 'ready';

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
 * 🎯 useSubmitButton - Comprehensive Submit Button State Management
 *
 * Manages all aspects of submit button state including validation,
 * loading, completion tracking, and user feedback.
 *
 * @param config - Configuration object defining button behavior
 * @returns SubmitButtonState object with all button state properties
 */
export function useSubmitButton(config: SubmitButtonConfig): SubmitButtonState {
  const {
    isFormValid,
    isFormTouched,
    isFormCompleted = true,
    isLoading,
    customValidation,
    defaultText,
    loadingText,
    disabledText,
    requireCompletion = false,
    requireTouched = false,
    minCompletionPercentage = 0,
    currentCompletionPercentage = 100,
  } = config;

  // Calculate button state
  const buttonState = useMemo(() => {
    let isDisabled = false;
    let disabledReason: string | null = null;
    let buttonStyle: SubmitButtonState['buttonStyle'] = 'default';

    // Check loading state first
    if (isLoading) {
      isDisabled = true;
      buttonStyle = 'loading';
    }
    // Check if form is valid
    else if (!isFormValid) {
      isDisabled = true;
      disabledReason = 'Please fix all form errors';
      buttonStyle = 'disabled';
    }
    // Check completion requirement
    else if (requireCompletion && !isFormCompleted) {
      isDisabled = true;
      disabledReason = 'Please complete all required fields';
      buttonStyle = 'disabled';
    }
    // Check touched requirement
    else if (requireTouched && !isFormTouched) {
      isDisabled = true;
      disabledReason = 'Please fill out the form';
      buttonStyle = 'disabled';
    }
    // Check minimum completion percentage
    else if (currentCompletionPercentage < minCompletionPercentage) {
      isDisabled = true;
      disabledReason = `Form must be at least ${minCompletionPercentage}% complete`;
      buttonStyle = 'disabled';
    }
    // Check custom validation
    else if (customValidation && !customValidation()) {
      isDisabled = true;
      disabledReason = 'Additional validation required';
      buttonStyle = 'disabled';
    }
    // Button is ready
    else {
      buttonStyle = 'ready';
    }

    return {
      isDisabled,
      disabledReason,
      buttonStyle,
    };
  }, [
    isLoading,
    isFormValid,
    isFormCompleted,
    isFormTouched,
    requireCompletion,
    requireTouched,
    minCompletionPercentage,
    currentCompletionPercentage,
    customValidation,
  ]);

  // Calculate button text
  const buttonText = useMemo(() => {
    if (isLoading) {
      return loadingText;
    }
    if (buttonState.isDisabled && disabledText) {
      return disabledText;
    }
    return defaultText;
  }, [isLoading, buttonState.isDisabled, loadingText, disabledText, defaultText]);

  // Calculate accessibility properties
  const accessibilityLabel = useMemo(() => {
    if (isLoading) {
      return `${loadingText}. Please wait.`;
    }
    if (buttonState.isDisabled && buttonState.disabledReason) {
      return `Submit button disabled. ${buttonState.disabledReason}`;
    }
    return `${defaultText}. Form is ready to submit.`;
  }, [isLoading, buttonState.isDisabled, buttonState.disabledReason, loadingText, defaultText]);

  const accessibilityHint = useMemo(() => {
    if (isLoading) {
      return 'Processing your request';
    }
    if (buttonState.isDisabled) {
      return buttonState.disabledReason || 'Button is currently disabled';
    }
    return 'Double tap to submit the form';
  }, [isLoading, buttonState.isDisabled, buttonState.disabledReason]);

  return {
    // Button state
    isDisabled: buttonState.isDisabled,
    isEnabled: !buttonState.isDisabled,

    // Visual state
    buttonText,
    buttonStyle: buttonState.buttonStyle,

    // Accessibility
    accessibilityLabel,
    accessibilityHint,

    // Feedback
    disabledReason: buttonState.disabledReason,
    canSubmit: !buttonState.isDisabled && !isLoading,

    // Progress indication
    showProgress: minCompletionPercentage > 0,
    progressPercentage: currentCompletionPercentage,
  };
}

/**
 * 🎨 getSubmitButtonStyles - Helper function to get button styles
 *
 * Returns appropriate styles based on button state.
 * Can be customized per component while maintaining consistent behavior.
 */
export function getSubmitButtonStyles(
  buttonState: SubmitButtonState,
  baseStyles: any,
  disabledStyles: any,
  loadingStyles?: any
) {
  const styles = [baseStyles];

  if (buttonState.buttonStyle === 'disabled') {
    styles.push(disabledStyles);
  } else if (buttonState.buttonStyle === 'loading' && loadingStyles) {
    styles.push(loadingStyles);
  }

  return styles;
}

/**
 * 🎨 getSubmitButtonTextStyles - Helper function to get button text styles
 *
 * Returns appropriate text styles based on button state.
 */
export function getSubmitButtonTextStyles(
  buttonState: SubmitButtonState,
  baseTextStyles: any,
  disabledTextStyles: any,
  loadingTextStyles?: any
) {
  const styles = [baseTextStyles];

  if (buttonState.buttonStyle === 'disabled') {
    styles.push(disabledTextStyles);
  } else if (buttonState.buttonStyle === 'loading' && loadingTextStyles) {
    styles.push(loadingTextStyles);
  }

  return styles;
}
