import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { useAuthNavigation } from '../src/hooks/useAuthNavigation';

// Navigation component that runs the auth navigation hook
function NavigationListener() {
  useAuthNavigation();
  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationListener />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="debug" />
      </Stack>
    </AuthProvider>
  );
}