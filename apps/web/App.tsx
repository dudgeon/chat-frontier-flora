import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { AuthFlow } from './src/components/auth/AuthFlow';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container} role="main">
        <Text style={styles.title} role="heading" aria-level={1}>
          Frontier.Family
        </Text>
        <AuthFlow />
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
});
