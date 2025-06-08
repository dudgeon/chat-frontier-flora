import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { AuthFlow } from './src/components/auth/AuthFlow';

export default function App() {
  return (
    <AuthProvider>
      <View
        className="flex-1 bg-white items-center justify-start p-5"
        style={styles.container}
        role="main"
      >
        <Text
          className="text-2xl font-bold mb-2 mt-10 text-gray-800"
          style={styles.title}
          role="heading"
          aria-level={1}
        >
          Frontier.Family
        </Text>
        <AuthFlow />
      </View>
    </AuthProvider>
  );
}

// Keep StyleSheet as fallback for now
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
});
