/**
 * TODO CLEANUP: This is a temporary test entry file used during Metro configuration debugging
 * 
 * PURPOSE: Minimal React component to test Metro compilation without complex app dependencies
 * 
 * WHEN TO DELETE: 
 * - Once main App.tsx compiles successfully with Metro
 * - After full Metro configuration is stable and verified
 * - When metro.config.js entry point can safely be changed back to 'index.ts'
 * 
 * VERIFIED WORKING:
 * - Basic Metro config: ✅ 3231ms compilation
 * - + NativeWind plugin: ✅ 4378ms compilation  
 * - + Polyfills: ✅ 38ms compilation
 * - + Monorepo support: ⏳ Testing
 */

import '@expo/metro-runtime';  // CRITICAL: Required for Metro web serving
import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text } from 'react-native';

// Minimal React component for testing Metro compilation - using React.createElement to avoid JSX
function MinimalApp() {
  return React.createElement(View, 
    { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
    React.createElement(Text, null, '🚀 Metro Minimal Test - If you see this, compilation works!')
  );
}

registerRootComponent(MinimalApp);