import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.trim() !== ''
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          testID="login-email"
          style={errors.email ? [styles.input, styles.inputError] : styles.input}
          value={formData.email}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, email: text }));
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          testID="login-password"
          style={errors.password ? [styles.input, styles.inputError] : styles.input}
          value={formData.password}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, password: text }));
            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
          }}
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="current-password"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <TouchableOpacity
        testID="login-submit-button"
        style={[
          styles.button,
          (!isFormValid() || loading) && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
  button: {
    backgroundColor: '#0056b3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
