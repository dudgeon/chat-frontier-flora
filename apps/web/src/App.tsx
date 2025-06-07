import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { SignUpForm } from './components/auth/SignUpForm';

console.log('Starting app initialization...');

function App() {
  console.log('App component rendering');

  // Verify environment variables
  console.log('Checking environment variables:', {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
  });

  return (
    <AuthProvider>
      <View style={styles.container}>
        <SignUpForm />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});

export default App;
