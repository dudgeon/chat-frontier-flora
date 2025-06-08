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
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation, FieldConfig } from '../../hooks/useFormValidation';
import { PasswordValidation } from './PasswordValidation';
import { validateEmail, validatePassword } from '../../../utils/validation';

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
  termsConsent: boolean; // Standard terms agreement
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
    termsConsent: {
      rules: {
        required: true,
        custom: (value: string) => {
          if (value !== 'true') return 'You must agree to the terms and conditions';
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* ⚠️ CRITICAL: Full Name Input Field (PRD Requirement) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          testID="full-name"
          style={formValidation.getFieldProps('fullName').error ? [styles.input, styles.inputError] : styles.input}
          value={formValidation.getFieldProps('fullName').value}
          onChangeText={(text) => formValidation.updateField('fullName', text)}
          onBlur={() => formValidation.touchField('fullName')}
          placeholder="Enter your first and last name"
          autoComplete="name"
        />
        {formValidation.getFieldProps('fullName').touched && formValidation.getFieldProps('fullName').error && (
          <Text style={styles.errorText}>{formValidation.getFieldProps('fullName').error}</Text>
        )}
      </View>

      {/* ⚠️ CRITICAL: Email Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          testID="email"
          style={formValidation.getFieldProps('email').error ? [styles.input, styles.inputError] : styles.input}
          value={formValidation.getFieldProps('email').value}
          onChangeText={(text) => formValidation.updateField('email', text)}
          onBlur={() => formValidation.touchField('email')}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        {formValidation.getFieldProps('email').touched && formValidation.getFieldProps('email').error && (
          <Text style={styles.errorText}>{formValidation.getFieldProps('email').error}</Text>
        )}
      </View>

      {/* ⚠️ CRITICAL: Password Input Field with Real-time Validation */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          testID="password"
          style={formValidation.getFieldProps('password').error ? [styles.input, styles.inputError] : styles.input}
          value={formValidation.getFieldProps('password').value}
          onChangeText={(text) => {
            formValidation.updateField('password', text);
            setShowPasswordValidation(text.length > 0);
          }}
          onBlur={() => formValidation.touchField('password')}
          onFocus={() => setShowPasswordValidation(true)}
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="new-password"
        />
        {formValidation.getFieldProps('password').touched && formValidation.getFieldProps('password').error && (
          <Text style={styles.errorText}>{formValidation.getFieldProps('password').error}</Text>
        )}

        {/* ⚠️ CRITICAL: Real-time Password Validation Component */}
        <PasswordValidation
          password={formValidation.getFieldProps('password').value}
          showRules={showPasswordValidation}
        />
      </View>

      {/* ⚠️ CRITICAL: Password Confirmation Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          testID="confirm-password"
          style={formValidation.getFieldProps('confirmPassword').error ? [styles.input, styles.inputError] : styles.input}
          value={formValidation.getFieldProps('confirmPassword').value}
          onChangeText={(text) => formValidation.updateField('confirmPassword', text)}
          onBlur={() => formValidation.touchField('confirmPassword')}
          placeholder="Confirm your password"
          secureTextEntry
          autoComplete="new-password"
        />
        {formValidation.getFieldProps('confirmPassword').touched && formValidation.getFieldProps('confirmPassword').error && (
          <Text style={styles.errorText}>{formValidation.getFieldProps('confirmPassword').error}</Text>
        )}
      </View>

      {/* ⚠️ CRITICAL: Age Verification Checkbox (PRD Requirement) */}
      <TouchableOpacity
        testID="age-verification-checkbox"
        style={styles.checkboxContainer}
        onPress={() => {
          const currentValue = formValidation.getFieldProps('ageVerification').value === 'true';
          formValidation.updateField('ageVerification', (!currentValue).toString());
        }}
      >
        <View style={[
          styles.checkbox,
          formValidation.getFieldProps('ageVerification').value === 'true' && styles.checkboxChecked
        ]}>
          {formValidation.getFieldProps('ageVerification').value === 'true' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          <Text style={styles.required}>* </Text>
          I verify that I am 18 years of age or older
        </Text>
      </TouchableOpacity>
      {formValidation.getFieldProps('ageVerification').touched && formValidation.getFieldProps('ageVerification').error && (
        <Text style={styles.errorText}>{formValidation.getFieldProps('ageVerification').error}</Text>
      )}

      {/* ⚠️ CRITICAL: Terms Agreement Checkbox */}
      <TouchableOpacity
        testID="terms-checkbox"
        style={styles.checkboxContainer}
        onPress={() => {
          const currentValue = formValidation.getFieldProps('termsConsent').value === 'true';
          formValidation.updateField('termsConsent', (!currentValue).toString());
        }}
      >
        <View style={[
          styles.checkbox,
          formValidation.getFieldProps('termsConsent').value === 'true' && styles.checkboxChecked
        ]}>
          {formValidation.getFieldProps('termsConsent').value === 'true' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          <Text style={styles.required}>* </Text>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </TouchableOpacity>
      {formValidation.getFieldProps('termsConsent').touched && formValidation.getFieldProps('termsConsent').error && (
        <Text style={styles.errorText}>{formValidation.getFieldProps('termsConsent').error}</Text>
      )}

      {/* ⚠️ CRITICAL: Development Consent Checkbox (PRD Requirement) */}
      <TouchableOpacity
        testID="development-consent-checkbox"
        style={styles.checkboxContainer}
        onPress={() => {
          const currentValue = formValidation.getFieldProps('developmentConsent').value === 'true';
          formValidation.updateField('developmentConsent', (!currentValue).toString());
        }}
      >
        <View style={[
          styles.checkbox,
          formValidation.getFieldProps('developmentConsent').value === 'true' && styles.checkboxChecked
        ]}>
          {formValidation.getFieldProps('developmentConsent').value === 'true' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
        <View style={styles.consentTextContainer}>
          <Text style={styles.checkboxLabel}>
            <Text style={styles.required}>* </Text>
            I consent to the use of my data for development and improvement purposes
          </Text>
          <Text style={styles.consentDetails}>
            This includes anonymized usage analytics, feature testing, and service improvements.
            Your personal information will be protected according to our Privacy Policy.
          </Text>
        </View>
      </TouchableOpacity>
      {formValidation.getFieldProps('developmentConsent').touched && formValidation.getFieldProps('developmentConsent').error && (
        <Text style={styles.errorText}>{formValidation.getFieldProps('developmentConsent').error}</Text>
      )}

      {/* ⚠️ CRITICAL: Submit Button with Real-time State Control */}
      <TouchableOpacity
        testID="submit-button"
        style={[
          styles.button,
          // ⚠️ CRITICAL: Button disabled when form invalid OR loading
          (!formValidation.isFormValid || loading) && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        // ⚠️ CRITICAL: Prevent submission when form invalid or loading
        disabled={!formValidation.isFormValid || loading}
      >
        <Text style={[
          styles.buttonText,
          (!formValidation.isFormValid || loading) && styles.buttonTextDisabled
        ]}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      {/* Form Status Indicator for Development */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Form Valid: {formValidation.isFormValid ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.debugText}>
            Form Touched: {formValidation.isFormTouched ? 'Yes' : 'No'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

/**
 * 🎨 COMPONENT STYLES
 *
 * ⚠️ SAFE TO MODIFY: These styles can be changed without breaking functionality.
 * However, ensure disabled button states remain visually distinct.
 */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  consentTextContainer: {
    flex: 1,
  },
  consentDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#0056b3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  // ⚠️ CRITICAL: Disabled button style must be visually distinct
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
  },
});

export default SignUpForm;
