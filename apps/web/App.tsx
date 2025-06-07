import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { SignUpForm } from './src/components/auth/SignUpForm';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Chat Frontier Flora</Text>
        <Text style={styles.subtitle}>Authentication Demo</Text>
        <View style={styles.formContainer}>
          <SignUpForm />
        </View>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
});
