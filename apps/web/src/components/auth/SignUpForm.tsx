/**
 * 📝 SIGN-UP FORM COMPONENT - CRITICAL USER REGISTRATION
 *
 * ⚠️ WARNING: This component handles user account creation.
 * DO NOT MODIFY without reading AUTHENTICATION_FLOW_DOCUMENTATION.md
 *
 * This form manages:
 * - User input validation with real-time feedback
 * - Submit button state control based on form validation
 * - Authentication flow integration
 * - Error handling and display
 * - PRD-compliant data collection (age verification, development consent)
 *
 * CRITICAL DEPENDENCIES:
 * - useAuth hook (AuthContext)
 * - useFormValidation hook for form state management
 * - PasswordValidation component for real-time password feedback
 * - Form validation utilities
 *
 * REGRESSION RISKS:
 * - Changing validation breaks form submission
 * - Modifying submit logic breaks account creation
 * - Altering button state breaks user experience
 * - Breaking error handling confuses users
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation, FieldConfig } from '../../hooks/useFormValidation';
import { useSubmitButton, getSubmitButtonStyles, getSubmitButtonTextStyles } from '../../hooks/useSubmitButton';
import { PasswordValidation } from './PasswordValidation';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { Checkbox } from '../Checkbox';

/**
 * 🎨 DESIGN SYSTEM - NativeWind Compatible Values
 *
 * These values align with Tailwind CSS for easy NativeWind conversion
 */
const styles = {
  // Colors (Tailwind equivalent)
  colors: {
    gray50: '#f9fafb',    // bg-gray-50
    gray100: '#f3f4f6',   // bg-gray-100
    gray300: '#d1d5db',   // border-gray-300
    gray400: '#9ca3af',   // bg-gray-400
    gray600: '#4b5563',   // text-gray-600
    gray700: '#374151',   // text-gray-700
    gray900: '#1f2937',   // text-gray-900
    blue500: '#3b82f6',   // bg-blue-500
    blue600: '#2563eb',   // bg-blue-600
    red500: '#ef4444',    // text-red-500
    white: '#ffffff',     // bg-white
  },

  // Spacing (Tailwind equivalent)
  spacing: {
    1: 4,    // space-1
    2: 8,    // space-2
    3: 12,   // space-3
    4: 16,   // space-4
    6: 24,   // space-6
    8: 32,   // space-8
  },

  // Typography (Tailwind equivalent)
  text: {
    sm: 14,   // text-sm
    base: 16, // text-base
    lg: 18,   // text-lg
    xl: 20,   // text-xl
    '2xl': 24, // text-2xl
    '3xl': 30, // text-3xl
  },

  // Border radius (Tailwind equivalent)
  radius: {
    md: 6,    // rounded-md
    lg: 8,    // rounded-lg
    xl: 12,   // rounded-xl
  },

  // Common input styles
  input: {
    borderWidth: 1,
    borderRadius: 12, // rounded-xl
    padding: 12,      // p-3
    fontSize: 16,     // text-base
    backgroundColor: '#ffffff', // bg-white
  },

  // Common label styles
  label: {
    fontSize: 16,     // text-base
    fontWeight: '500' as const, // font-medium
    marginBottom: 8,   // mb-2
    color: '#374151',  // text-gray-700
  },

  // Error text styles
  error: {
    color: '#ef4444',  // text-red-500
    fontSize: 14,      // text-sm
    marginTop: 4,      // mt-1
  },
};

/**
 * 📋 Form Data Interface - PRD Compliant
 *
 * ⚠️ CRITICAL: This interface defines the form structure per PRD requirements.
 * Changing field names breaks form logic and validation.
 */
interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string; // PRD requires full_name, not displayName
  ageVerification: boolean; // PRD requirement: 18+ verification
  developmentConsent: boolean; // PRD requirement: development data usage consent
}

/**
 * 📝 SignUpForm Component - PRD Compliant
 *
 * CRITICAL FUNCTIONALITY:
 * 1. Collects user registration data per PRD requirements
 * 2. Validates all inputs in real-time with visual feedback
 * 3. Controls submit button state based on complete form validation
 * 4. Handles authentication errors with user-friendly messages
 * 5. Records consent timestamps for compliance
 *
 * ⚠️ DO NOT MODIFY without understanding all validation logic and PRD requirements
 */
export const SignUpForm: React.FC = () => {
  // ⚠️ CRITICAL: Auth hook provides signUp function
  const { signUp } = useAuth();

  // ⚠️ CRITICAL STATE: Controls form behavior and UI
  const [loading, setLoading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  // ⚠️ CRITICAL: Form validation configuration per PRD requirements
  const formConfig: Record<string, FieldConfig> = {
    email: {
      rules: {
        required: true,
        custom: (value: string) => {
          const result = validateEmail(value);
          return result ? result.message : null;
        },
      },
    },
    password: {
      rules: {
        required: true,
        custom: (value: string) => {
          const result = validatePassword(value);
          return result ? result.message : null;
        },
      },
    },
    confirmPassword: {
      rules: {
        required: true,
        custom: (value: string) => {
          if (value !== formValidation.formState.password?.value) {
            return 'Passwords do not match';
          }
          return null;
        },
      },
    },
    fullName: {
      rules: {
        required: true,
        custom: (value: string) => {
          if (!value.trim()) return 'Full name is required';
          if (value.trim().length < 2) return 'Full name must be at least 2 characters';
          if (!value.trim().includes(' ')) return 'Please enter your first and last name';
          return null;
        },
      },
    },
    ageVerification: {
      rules: {
        required: true,
        custom: (value: string) => {
          if (value !== 'true') return 'You must be 18 or older to create an account';
          return null;
        },
      },
    },
    developmentConsent: {
      rules: {
        required: true,
        custom: (value: string) => {
          if (value !== 'true') return 'You must consent to data usage for development purposes';
          return null;
        },
      },
    },
  };

  // ⚠️ CRITICAL: Form validation hook for real-time state management
  const formValidation = useFormValidation(formConfig);

  // ⚠️ CRITICAL: Submit button state management with comprehensive validation
  const submitButtonState = useSubmitButton({
    isFormValid: formValidation.isFormValid,
    isFormTouched: formValidation.isFormTouched,
    isFormCompleted: formValidation.isFormCompleted,
    isLoading: loading,
    defaultText: 'Create Account',
    loadingText: 'Creating Account...',
    disabledText: 'Complete Form to Continue',
    requireCompletion: true, // Require all fields to be completed
    requireTouched: false, // Don't require form to be touched
    minCompletionPercentage: 100, // Require 100% completion
    currentCompletionPercentage: formValidation.completionPercentage,
    customValidation: () => {
      // Additional custom validation can be added here
      // For now, rely on form validation
      return true;
    },
  });

  /**
   * 🚀 handleSubmit - CRITICAL SUBMISSION FUNCTION
   *
   * This function handles the account creation process with PRD compliance.
   * It validates the form and calls the auth context signUp function.
   *
   * ⚠️ BREAKING CHANGES RISK:
   * - Changing validation check breaks form security
   * - Modifying signUp call breaks account creation
   * - Altering error handling breaks user feedback
   *
   * PROCESS:
   * 1. Validate complete form data
   * 2. Set loading state
   * 3. Call AuthContext.signUp() with PRD-compliant data
   * 4. Handle success/error feedback
   * 5. Reset loading state
   */
  const handleSubmit = async () => {
    // ⚠️ CRITICAL: Form validation gate - prevents invalid submissions
    if (!formValidation.validateForm()) {
      Alert.alert('Validation Error', 'Please fix all form errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const formData = formValidation.formState;

      // ⚠️ CRITICAL: Auth context signUp call with ALL PRD-compliant data
      // This creates the user account and profile with all required fields
      await signUp(
        formData.email.value,
        formData.password.value,
        formData.fullName.value,
        'primary', // Default role
        formData.ageVerification.value === 'true', // Convert string to boolean
        formData.developmentConsent.value === 'true' // Convert string to boolean
      );
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      // ⚠️ CRITICAL: Error handling for user feedback
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      // ⚠️ CRITICAL: Always reset loading state
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <View style={{ paddingHorizontal: 16, width: '100%', maxWidth: 384 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#1f2937' }}>
          Create Account
        </Text>

        <View style={{ flexDirection: 'column', gap: 24 }}>
          {/* ⚠️ CRITICAL: Full Name Input Field (PRD Requirement) */}
          <View>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              testID="full-name"
              style={{
                ...styles.input,
                borderColor: formValidation.getFieldProps('fullName').error ? styles.colors.red500 : styles.colors.gray300
              }}
              value={formValidation.getFieldProps('fullName').value}
              onChangeText={(text) => formValidation.updateField('fullName', text)}
              onBlur={() => formValidation.touchField('fullName')}
              placeholder="Enter your first and last name"
              autoComplete="name"
              autoCapitalize="sentences"
              autoCorrect={true}
            />
            {formValidation.getFieldProps('fullName').error && (
              <Text style={styles.error}>
                {formValidation.getFieldProps('fullName').error}
              </Text>
            )}
          </View>

          {/* ⚠️ CRITICAL: Email Input Field (PRD Requirement) */}
          <View>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              testID="email"
              style={{
                ...styles.input,
                borderColor: formValidation.getFieldProps('email').error ? styles.colors.red500 : styles.colors.gray300
              }}
              value={formValidation.getFieldProps('email').value}
              onChangeText={(text) => formValidation.updateField('email', text)}
              onBlur={() => formValidation.touchField('email')}
              placeholder="Enter your email address"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {formValidation.getFieldProps('email').error && (
              <Text style={styles.error}>
                {formValidation.getFieldProps('email').error}
              </Text>
            )}
          </View>

          {/* ⚠️ CRITICAL: Password Input Field (PRD Requirement) */}
          <View>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              testID="password"
              style={{
                ...styles.input,
                borderColor: formValidation.getFieldProps('password').error ? styles.colors.red500 : styles.colors.gray300
              }}
              value={formValidation.getFieldProps('password').value}
              onChangeText={(text) => {
                formValidation.updateField('password', text);
                setShowPasswordValidation(text.length > 0);
              }}
              onBlur={() => formValidation.touchField('password')}
              onFocus={() => setShowPasswordValidation(true)}
              placeholder="Enter your password"
              secureTextEntry={true}
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {formValidation.getFieldProps('password').error && (
              <Text style={styles.error}>
                {formValidation.getFieldProps('password').error}
              </Text>
            )}
          </View>

          {/* ⚠️ CRITICAL: Password Validation Component */}
          {showPasswordValidation && (
            <PasswordValidation
              password={formValidation.getFieldProps('password').value}
            />
          )}

          {/* ⚠️ CRITICAL: Confirm Password Input Field (PRD Requirement) */}
          <View>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              testID="confirm-password"
              style={{
                ...styles.input,
                borderColor: formValidation.getFieldProps('confirmPassword').error ? styles.colors.red500 : styles.colors.gray300
              }}
              value={formValidation.getFieldProps('confirmPassword').value}
              onChangeText={(text) => formValidation.updateField('confirmPassword', text)}
              onBlur={() => formValidation.touchField('confirmPassword')}
              placeholder="Confirm your password"
              secureTextEntry={true}
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {formValidation.getFieldProps('confirmPassword').error && (
              <Text style={styles.error}>
                {formValidation.getFieldProps('confirmPassword').error}
              </Text>
            )}
          </View>

          {/* ⚠️ CRITICAL: Age Verification Checkbox (PRD Requirement) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Checkbox
              testID="age-verification"
              label="I verify that I am 18 years of age or older"
              checked={formValidation.getFieldProps('ageVerification').value === 'true'}
              onPress={() => {
                const currentValue = formValidation.getFieldProps('ageVerification').value === 'true';
                formValidation.updateField('ageVerification', (!currentValue).toString());
              }}
            />
          </View>
          {formValidation.getFieldProps('ageVerification').error && (
            <Text style={styles.error}>
              {formValidation.getFieldProps('ageVerification').error}
            </Text>
          )}

          {/* ⚠️ CRITICAL: Development Consent Checkbox (PRD Requirement) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Checkbox
              testID="development-consent"
              label="I consent to the use of my data for development and improvement purposes"
              checked={formValidation.getFieldProps('developmentConsent').value === 'true'}
              onPress={() => {
                const currentValue = formValidation.getFieldProps('developmentConsent').value === 'true';
                formValidation.updateField('developmentConsent', (!currentValue).toString());
              }}
            />
          </View>
          {formValidation.getFieldProps('developmentConsent').error && (
            <Text style={styles.error}>
              {formValidation.getFieldProps('developmentConsent').error}
            </Text>
          )}
        </View>

        {/* ⚠️ CRITICAL: Submit Button with proper spacing */}
        <View style={{ marginTop: 32, marginBottom: 24 }}>
          <TouchableOpacity
            testID="submit-button"
            accessibilityLabel="Create Account Button"
            accessibilityHint={submitButtonState.isDisabled ? "Complete all form fields to enable" : "Submit the form to create your account"}
            accessibilityRole="button"
            style={{
              backgroundColor: submitButtonState.isDisabled ? styles.colors.gray400 : styles.colors.blue500,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: 'center',
              opacity: submitButtonState.isDisabled ? 0.6 : 1
            }}
            onPress={handleSubmit}
            disabled={submitButtonState.isDisabled}
          >
            <Text style={{
              color: styles.colors.white,
              fontSize: 16,
              fontWeight: '600' as const
            }}>
              {submitButtonState.buttonText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ⚠️ CRITICAL: Form Status Debug Information */}
        <View style={{ marginTop: 16, padding: 16, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
            Complete Form to Continue
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Please fix all form errors
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Form Valid: {formValidation.isFormValid ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Form Touched: {formValidation.isFormTouched ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Form Completed: {formValidation.isFormCompleted ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Completion: {formValidation.completionPercentage}/6 ({Math.round((formValidation.completionPercentage / 6) * 100)}%)
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Submit Button: {submitButtonState.isDisabled ? 'disabled' : 'enabled'} - {submitButtonState.isDisabled ? 'Disabled' : 'Enabled'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            Disabled Reason: {submitButtonState.disabledReason}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignUpForm;
