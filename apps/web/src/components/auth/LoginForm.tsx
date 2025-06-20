import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../ui/InputField';
import { FormButton } from '../ui/FormButton';
import { ErrorAlert } from '../ui/ErrorAlert';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useSubmitButton } from '../../hooks/useSubmitButton';
import { validateEmail } from '../../../utils/validation';
import { parseAuthError, createSuccessMessage, type ParsedError } from '../../utils/errorHandling';
import { supabase } from '../../lib/supabase';

// Design system constants (matching other components)
const designSystem = {
  colors: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray900: '#111827',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',
    red500: '#EF4444',
    green500: '#22C55E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
  },
  fontSize: {
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 20,
    normal: 24,
    relaxed: 28,
  },
};

interface LoginFormProps {
  onSuccess?: () => void;
}

/**
 * LoginForm component with comprehensive validation and accessibility.
 *
 * Features:
 * - Real-time email validation
 * - Password field with show/hide toggle
 * - Remember me functionality
 * - Loading states and error handling
 * - Accessibility support with ARIA labels
 * - Responsive design with design system
 * - Submit button state management
 * - Link to sign up form
 *
 * @param props - The login form component props
 * @returns A styled login form component
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
}) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorState, setErrorState] = useState<ParsedError | null>(null);

  // Form validation setup using correct API
  const formValidation = useFormValidation({
    email: {
      rules: {
        required: true,
        custom: (value: string) => {
          if (!value.trim()) return 'Email is required';
          const emailValidation = validateEmail(value);
          return emailValidation ? emailValidation.message : null;
        },
      },
      initialValue: '',
    },
    password: {
      rules: {
        required: true,
        minLength: 8,
        custom: (value: string) => {
          if (!value.trim()) return 'Password is required';
          if (value.length < 8) return 'Password must be at least 8 characters';
          return null;
        },
      },
      initialValue: '',
    },
  });

  // Submit button state management
  const submitButtonState = useSubmitButton({
    isFormValid: formValidation.isFormValid,
    isFormTouched: formValidation.isFormTouched,
    isLoading: loading,
    defaultText: 'Sign In',
    loadingText: 'Signing In...',
    requireTouched: true,
  });

  const handleSubmit = async () => {
    // Skip if button should be disabled (loading or invalid)
    if (submitButtonState.isDisabled || loading) return;

    setLoading(true);
    setErrorState(null); // Clear any previous errors

    try {
      const email = formValidation.getFieldProps('email').value;
      const password = formValidation.getFieldProps('password').value;

      // signIn method throws on error, doesn't return error object
      await signIn(email, password);

      // Handle "Remember me" functionality
      // If the user does NOT want to be remembered, we still keep the session for the lifetime
      // of the current tab so the chat page can render. We schedule token removal on
      // page unload, which clears persistence but preserves the current-tab session.
      if (!rememberMe) {
        try {
          const removeTokens = () => {
            try {
              // Supabase JS v2 stores auth session under this key
              // @ts-ignore - storageKey is internal, may not be typed
              const storageKey = (supabase.auth as any).storageKey as string | undefined;
              if (storageKey) {
                localStorage.removeItem(storageKey);
              } else {
                Object.keys(localStorage).forEach((key) => {
                  if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                    localStorage.removeItem(key);
                  }
                });
              }
            } catch (err) {
              console.warn('Remember me cleanup error:', err);
            }
          };

          // Ensure we only attach one listener per tab
          window.removeEventListener('beforeunload', removeTokens);
          window.addEventListener('beforeunload', removeTokens);
        } catch (err) {
          console.warn('Remember me setup error:', err);
        }
      }

      // Success - redirect will be handled by auth context
      onSuccess?.();
    } catch (error) {
      console.error('Login error:', error);
      const parsedError = parseAuthError(error);
      setErrorState(parsedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      paddingHorizontal: 16,
    }}>
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
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#1f2937' }}>
          Welcome Back
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

        <View style={{ flexDirection: 'column', gap: 24 }}>
          {/* Email Field */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151',
            }}>
              Email Address
            </Text>
            <InputField
              error={!!(formValidation.getFieldProps('email').touched && formValidation.getFieldProps('email').error)}
              value={formValidation.getFieldProps('email').value}
              onChangeText={(text: string) => formValidation.updateField('email', text)}
              onBlur={() => formValidation.touchField('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              testID="email-input"
              placeholder="Enter your email address"
            />
            {formValidation.getFieldProps('email').touched &&
              formValidation.getFieldProps('email').error && (
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
              Password
            </Text>
            <View style={{ position: 'relative' }}>
              <InputField
                error={!!(formValidation.getFieldProps('password').touched && formValidation.getFieldProps('password').error)}
                value={formValidation.getFieldProps('password').value}
                onChangeText={(text: string) => formValidation.updateField('password', text)}
                onBlur={() => formValidation.touchField('password')}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                textContentType="password"
                testID="password-input"
                placeholder="Enter your password"
              />
              {/* Show/Hide Password Toggle */}
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
            {formValidation.getFieldProps('password').touched &&
              formValidation.getFieldProps('password').error && (
              <Text style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}>
                {formValidation.getFieldProps('password').error}
              </Text>
            )}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setRememberMe(!rememberMe)}
              testID="remember-me"
            >
              <View style={{
                width: 20,
                height: 20,
                borderWidth: 2,
                borderColor: rememberMe ? '#2563eb' : '#d1d5db',
                borderRadius: 4,
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: rememberMe ? '#2563eb' : 'transparent',
              }}>
                {rememberMe && (
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: '#374151',
              }}>
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity testID="forgot-password">
              <Text style={{
                fontSize: 14,
                color: '#2563eb',
                fontWeight: '500',
              }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <View style={{ marginTop: 32, marginBottom: 24 }}>
          <FormButton
            title={submitButtonState.buttonText}
            disabled={submitButtonState.isDisabled}
            onPress={handleSubmit}
            testID="submit-button"
          />
        </View>

        {/* Sign Up Link */}
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
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigate('/signup')}
            testID="switch-to-signup"
          >
            <Text style={{
              fontSize: 14,
              color: '#0056b3',
              fontWeight: '600',
            }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};
