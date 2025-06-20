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
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation, FieldConfig } from '../../hooks/useFormValidation';
import { useSubmitButton, getSubmitButtonStyles, getSubmitButtonTextStyles } from '../../hooks/useSubmitButton';
import { PasswordValidation, PASSWORD_RULES } from './PasswordValidation';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { Checkbox } from '../Checkbox';
import { InputField } from '../ui/InputField';
import { FormButton } from '../ui/FormButton';
import { ErrorAlert } from '../ui/ErrorAlert';
import { parseAuthError, createSuccessMessage, type ParsedError } from '../../utils/errorHandling';



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
  const navigate = useNavigate();

  // ⚠️ CRITICAL STATE: Controls form behavior and UI
  const [loading, setLoading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorState, setErrorState] = useState<ParsedError | null>(null);

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

  // Helper function to check if all password criteria are met
  const checkPasswordCriteriaMet = (password: string): boolean => {
    if (!password) return false;
    return PASSWORD_RULES.filter(rule => rule.required).every(rule => rule.test(password));
  };

  // ⚠️ CRITICAL: Submit button state management with comprehensive validation
  const submitButtonState = useSubmitButton({
    isFormValid: formValidation.isFormValid,
    isFormTouched: formValidation.isFormTouched,
    isLoading: loading,
    defaultText: 'Create Account',
    loadingText: 'Creating Account...',
    requireTouched: true, // Require form to be touched (like LoginForm)
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
    // Skip if button should be disabled (loading or invalid)
    if (submitButtonState.isDisabled || loading) return;

    setLoading(true);
    setErrorState(null); // Clear any previous errors

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

      // Show success message briefly, then it will be handled by auth context navigation
      setErrorState(createSuccessMessage('Account created successfully! Welcome aboard.'));
    } catch (error) {
      // ⚠️ CRITICAL: Enhanced error handling with user-friendly messages
      console.error('SignUp error:', error);
      const parsedError = parseAuthError(error);
      setErrorState(parsedError);
    } finally {
      // ⚠️ CRITICAL: Always reset loading state
      setLoading(false);
    }
  };

    return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: '100%',
        backgroundColor: '#f9fafb',
      }}
      testID="signup-form"
    >
      <View style={{
        width: '100%',
        maxWidth: 448,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}>
                  <Text style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 32,
            textAlign: 'center',
            color: '#111827',
          }}>
          Create Account
        </Text>

        {/* Error Alert */}
        {errorState && (
          <ErrorAlert
            title={errorState.title}
            message={errorState.message}
            type={errorState.type}
            visible={true}
            onDismiss={() => setErrorState(null)}
          />
        )}

        <View style={{ gap: 20 }}>
          {/* Full Name Field */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151',
            }}>
              Full Name *
            </Text>
            <InputField
              testID="full-name"
              error={!!formValidation.getFieldProps('fullName').error}
              value={formValidation.getFieldProps('fullName').value}
              onChangeText={(text) => formValidation.updateField('fullName', text)}
              onBlur={() => formValidation.touchField('fullName')}
              placeholder="Enter your first and last name"
              autoComplete="name"
              autoCapitalize="sentences"
              autoCorrect={true}
            />
            {formValidation.getFieldProps('fullName').error && (
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('fullName').error}
              </Text>
            )}
          </View>

          {/* Email Field */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151',
            }}>
              Email Address *
            </Text>
            <InputField
              testID="email"
              error={!!formValidation.getFieldProps('email').error}
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
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('email').error}
              </Text>
            )}
          </View>

          {/* Password Field */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151',
            }}>
              Password *
            </Text>
            <View style={{ position: 'relative' }}>
              <InputField
                testID="password"
                error={!!formValidation.getFieldProps('password').error}
                value={formValidation.getFieldProps('password').value}
                onChangeText={(text) => {
                  formValidation.updateField('password', text);
                  setShowPasswordValidation(text.length > 0);
                }}
                onBlur={() => formValidation.touchField('password')}
                onFocus={() => setShowPasswordValidation(true)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  padding: 8,
                }}
                onPress={() => setShowPassword(!showPassword)}
                testID="password-toggle"
              >
                <Text style={{
                  fontSize: 14,
                  color: '#2563eb',
                  fontWeight: '500',
                }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
            </View>
            {formValidation.getFieldProps('password').error && (
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('password').error}
              </Text>
            )}
          </View>

          {/* Password Validation Component */}
          {showPasswordValidation && !checkPasswordCriteriaMet(formValidation.getFieldProps('password').value) && (
            <PasswordValidation
              password={formValidation.getFieldProps('password').value}
            />
          )}

          {/* Confirm Password Field */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151',
            }}>
              Confirm Password *
            </Text>
            <View style={{ position: 'relative' }}>
              <InputField
                testID="confirm-password"
                error={!!formValidation.getFieldProps('confirmPassword').error}
                value={formValidation.getFieldProps('confirmPassword').value}
                onChangeText={(text) => formValidation.updateField('confirmPassword', text)}
                onBlur={() => formValidation.touchField('confirmPassword')}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  padding: 8,
                }}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                testID="confirm-password-toggle"
              >
                <Text style={{
                  fontSize: 14,
                  color: '#2563eb',
                  fontWeight: '500',
                }}>
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
            </View>
            {formValidation.getFieldProps('confirmPassword').error && (
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('confirmPassword').error}
              </Text>
            )}
          </View>

          {/* Age Verification Checkbox */}
          <View style={{ marginTop: 16 }}>
            <Checkbox
              testID="age-verification"
              label="I verify that I am 18 years of age or older"
              checked={formValidation.getFieldProps('ageVerification').value === 'true'}
              onPress={() => {
                const currentValue = formValidation.getFieldProps('ageVerification').value === 'true';
                formValidation.updateField('ageVerification', (!currentValue).toString());
              }}
            />
            {formValidation.getFieldProps('ageVerification').error && (
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('ageVerification').error}
              </Text>
            )}
          </View>

          {/* Development Consent Checkbox */}
          <View style={{ marginTop: 16 }}>
            <Checkbox
              testID="development-consent"
              label="I consent to the use of my data for development and improvement purposes"
              checked={formValidation.getFieldProps('developmentConsent').value === 'true'}
              onPress={() => {
                const currentValue = formValidation.getFieldProps('developmentConsent').value === 'true';
                formValidation.updateField('developmentConsent', (!currentValue).toString());
              }}
            />
            {formValidation.getFieldProps('developmentConsent').error && (
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('developmentConsent').error}
              </Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={{ marginTop: 32, marginBottom: 24 }}>
          <FormButton
            testID="submit-button"
            accessibilityLabel="Create Account Button"
            accessibilityHint={submitButtonState.isDisabled ? "Complete all form fields to enable" : "Submit the form to create your account"}
            accessibilityRole="button"
            title={submitButtonState.buttonText}
            disabled={submitButtonState.isDisabled}
            onPress={handleSubmit}
          />
        </View>

        {/* Sign In Link */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 16,
        }}>
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginRight: 8,
          }}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigate('/login')}
            testID="switch-to-login"
          >
            <Text style={{
              fontSize: 14,
              color: '#0056b3',
              fontWeight: '600',
            }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

export default SignUpForm;
