import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';
import './index.css';
import { injectNativeWindStyles } from '../nativewind-styles';

console.log('Starting app initialization...');

function App() {
  console.log('App component rendering');

  // Inject NativeWind styles
  useEffect(() => {
    injectNativeWindStyles();
  }, []);

  // Verify environment variables
  console.log('Checking environment variables:', {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
  });

  return (
    <AuthProvider>
      <View style={styles.container}>
        <AppRouter />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
