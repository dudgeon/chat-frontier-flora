/**
 * 📝 SIGN-UP FORM COMPONENT - CRITICAL USER REGISTRATION
 *
 * ⚠️ WARNING: This component handles user account creation.
 * DO NOT MODIFY without reading AUTHENTICATION_FLOW_DOCUMENTATION.md
 *
 * This form manages:
 * - User input validation
 * - Submit button state control
 * - Authentication flow integration
 * - Error handling and display
 *
 * CRITICAL DEPENDENCIES:
 * - useAuth hook (AuthContext)
 * - Form validation logic
 * - Submit button control logic
 * - Error state management
 *
 * REGRESSION RISKS:
 * - Changing validation breaks form submission
 * - Modifying submit logic breaks account creation
 * - Altering button state breaks user experience
 * - Breaking error handling confuses users
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

/**
 * 📋 Form Data Interface
 *
 * ⚠️ CRITICAL: This interface defines the form structure.
 * Changing field names breaks form logic and validation.
 */
interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  agreeToTerms: boolean;
}

/**
 * 📝 SignUpForm Component
 *
 * CRITICAL FUNCTIONALITY:
 * 1. Collects user registration data
 * 2. Validates all inputs in real-time
 * 3. Controls submit button state
 * 4. Handles authentication errors
 *
 * ⚠️ DO NOT MODIFY without understanding all validation logic
 */
export const SignUpForm: React.FC = () => {
  // ⚠️ CRITICAL: Auth hook provides signUp function
  const { signUp } = useAuth();

  // ⚠️ CRITICAL STATE: Controls form behavior and UI
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 🔍 validateForm - CRITICAL VALIDATION FUNCTION
   *
   * This function determines if the form can be submitted.
   * ALL validation rules must pass for submission to be allowed.
   *
   * ⚠️ BREAKING CHANGES RISK:
   * - Relaxing validation allows invalid submissions
   * - Changing error messages confuses users
   * - Modifying logic breaks submit button control
   *
   * VALIDATION RULES (DO NOT CHANGE):
   * - Email: Required and valid format
   * - Password: Required, min 8 chars, has number and letter
   * - Confirm Password: Must match password
   * - Terms: Must be agreed to
   *
   * @returns boolean - true if form is valid for submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // ⚠️ CRITICAL: Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // ⚠️ CRITICAL: Password validation (matches backend requirements)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter';
    }

    // ⚠️ CRITICAL: Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // ⚠️ CRITICAL: Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 🚀 handleSubmit - CRITICAL SUBMISSION FUNCTION
   *
   * This function handles the account creation process.
   * It validates the form and calls the auth context signUp function.
   *
   * ⚠️ BREAKING CHANGES RISK:
   * - Changing validation check breaks form security
   * - Modifying signUp call breaks account creation
   * - Altering error handling breaks user feedback
   *
   * PROCESS:
   * 1. Validate form data
   * 2. Set loading state
   * 3. Call AuthContext.signUp()
   * 4. Handle success/error feedback
   * 5. Reset loading state
   */
  const handleSubmit = async () => {
    // ⚠️ CRITICAL: Form validation gate - prevents invalid submissions
    if (!validateForm()) return;

    setLoading(true);
    try {
      // ⚠️ CRITICAL: Auth context signUp call
      // This creates the user account and profile
      await signUp(formData.email, formData.password, formData.displayName);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      // ⚠️ CRITICAL: Error handling for user feedback
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      // ⚠️ CRITICAL: Always reset loading state
      setLoading(false);
    }
  };

  /**
   * 🎯 isFormValid - SUBMIT BUTTON CONTROL FUNCTION
   *
   * Determines if the submit button should be enabled.
   * This provides real-time feedback to users about form completeness.
   *
   * ⚠️ CRITICAL: This logic controls when users can submit the form.
   * Changing this affects user experience and form security.
   *
   * @returns boolean - true if form is complete and valid
   */
  const isFormValid = (): boolean => {
    return (
      formData.email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.length >= 8 &&
      /\d/.test(formData.password) &&
      /[a-zA-Z]/.test(formData.password) &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* ⚠️ CRITICAL: Email Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={errors.email ? [styles.input, styles.inputError] : styles.input}
          value={formData.email}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, email: text }));
            // ⚠️ CRITICAL: Clear error on input change for better UX
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* ⚠️ CRITICAL: Password Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={errors.password ? [styles.input, styles.inputError] : styles.input}
          value={formData.password}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, password: text }));
            // ⚠️ CRITICAL: Clear error on input change for better UX
            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
          }}
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="new-password"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      {/* ⚠️ CRITICAL: Password Confirmation Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={errors.confirmPassword ? [styles.input, styles.inputError] : styles.input}
          value={formData.confirmPassword}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, confirmPassword: text }));
            // ⚠️ CRITICAL: Clear error on input change for better UX
            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
          }}
          placeholder="Confirm your password"
          secureTextEntry
          autoComplete="new-password"
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>

      {/* ⚠️ CRITICAL: Display Name Field (Optional) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Display Name (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.displayName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
          placeholder="Enter your display name"
        />
      </View>

      {/* ⚠️ CRITICAL: Terms Agreement Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => {
          setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }));
          // ⚠️ CRITICAL: Clear error on checkbox change
          if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }));
        }}
      >
        <View style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]}>
          {formData.agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </TouchableOpacity>
      {errors.agreeToTerms && <Text style={styles.errorText}>{errors.agreeToTerms}</Text>}

      {/* ⚠️ CRITICAL: Submit Button with State Control */}
      <TouchableOpacity
        style={[
          styles.button,
          // ⚠️ CRITICAL: Button disabled when form invalid OR loading
          (!isFormValid() || loading) && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        // ⚠️ CRITICAL: Prevent submission when form invalid or loading
        disabled={!isFormValid() || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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
});
