import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { SignUpForm } from './SignUpForm';
import { LoginForm } from './LoginForm';

type AuthMode = 'login' | 'signup';

export const AuthFlow: React.FC = () => {
  const { loading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show authentication forms
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Chat Frontier Flora</Text>
        <Text style={styles.subtitle}>
          {authMode === 'signup' ? 'Create your account' : 'Sign in to your account'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        {authMode === 'signup' ? <SignUpForm /> : <LoginForm />}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
        </Text>
        <TouchableOpacity
          testID={authMode === 'signup' ? 'switch-to-login' : 'switch-to-signup'}
          onPress={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
        >
          <Text style={styles.switchLink}>
            {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  switchLink: {
    fontSize: 14,
    color: '#0056b3',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
