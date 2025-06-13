import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';

// Import CSS for web
// NativeWind styles are loaded via index.js

function App() {

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
