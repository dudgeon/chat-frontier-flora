import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';

// Import CSS for web
import './global.css';

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
        {/* NativeWind Test */}
        <View className="bg-red-500 p-4 m-2 rounded-lg">
          <Text className="text-white text-center font-bold">NativeWind Test - Should be Red</Text>
        </View>
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
