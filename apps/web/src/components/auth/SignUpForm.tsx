import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FormInput, Button, Checkbox } from '@chat-frontier-flora/ui';
import { SignUpFormData, ValidationResult } from '@chat-frontier-flora/shared';
import { validateSignUpForm } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';

export const SignUpForm: React.FC = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<ValidationResult>(null);

  const getFieldError = (field: keyof SignUpFormData) =>
    errors?.find((error) => error.field === field)?.message;

  const handleSubmit = async () => {
    const validationErrors = validateSignUpForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      setErrors([
        {
          field: 'email',
          message: error instanceof Error ? error.message : 'An error occurred',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, email: text }));
          setErrors(null);
        }}
        error={getFieldError('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />

      <FormInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, password: text }));
          setErrors(null);
        }}
        error={getFieldError('password')}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
      />

      <FormInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, confirmPassword: text }));
          setErrors(null);
        }}
        error={getFieldError('confirmPassword')}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
      />

      <FormInput
        label="Display Name (Optional)"
        value={formData.displayName}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, displayName: text }));
          setErrors(null);
        }}
        error={getFieldError('displayName')}
        textContentType="nickname"
      />

      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        checked={formData.agreeToTerms}
        onPress={() => {
          setFormData((prev) => ({
            ...prev,
            agreeToTerms: !prev.agreeToTerms,
          }));
          setErrors(null);
        }}
        error={getFieldError('agreeToTerms')}
      />

      <Button
        title="Sign Up"
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
});
