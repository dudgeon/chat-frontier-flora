import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';
import '../global.css';  // Import the source CSS with @tailwind directives

console.log('Starting app initialization...');

function App() {
  console.log('App component rendering');

  // Verify environment variables
  console.log('Checking environment variables:', {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing'
  });

  return (
    <AuthProvider>
      <View style={styles.container}>
        <AppRouter />
        {/* Test React Native Web + NativeWind integration with !important */}
        <View className="!w-10 !h-10 !bg-blue-500 absolute top-2 right-2 z-50" />
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
