import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';
import { useTailwind } from './utils/nativewind-styles';
import './global.css';  // Import the source CSS with @tailwind directives

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
        {/* Comprehensive NativeWind-style test elements */}
        <View style={useTailwind("w-10 h-10 bg-blue-500 absolute top-2 right-2 z-50")} />
        <View style={useTailwind("w-8 h-8 bg-green-500 absolute top-14 right-2 z-50 rounded-full")} />
        <View style={useTailwind("w-12 h-4 bg-red-500 absolute top-24 right-2 z-50 rounded-lg")} />
        <View style={useTailwind("px-4 py-2 bg-gray-200 absolute top-32 right-2 z-50 rounded-md border")}>
          <Text style={useTailwind("text-sm text-gray-700 font-medium")}>Test Text</Text>
        </View>
        
        {/* Additional comprehensive style tests */}
        <View style={useTailwind("flex flex-col absolute top-2 right-20 z-50")}>
          <View style={useTailwind("w-full h-8 bg-blue-600 rounded-sm mb-2")} />
          <View style={useTailwind("w-full h-8 bg-gray-400 rounded-md mb-2")} />
          <View style={useTailwind("px-2 py-2 bg-white border rounded-lg")}>
            <Text style={useTailwind("text-xs text-gray-500 font-bold")}>Flex Layout</Text>
          </View>
        </View>
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
