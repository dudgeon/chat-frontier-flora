import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import '../global.css';

console.log('Minimal App starting...');

function App() {
  console.log('Minimal App component rendering');

  return (
    <AuthProvider>
      <Router>
        <View style={styles.container}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </View>
      </Router>
    </AuthProvider>
  );
}

function LoginPage() {
  return (
    <View style={styles.page}>
      <LoginForm />
    </View>
  );
}

function NotFoundPage() {
  return (
    <View style={styles.page}>
      <Text style={styles.text}>Page not found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;