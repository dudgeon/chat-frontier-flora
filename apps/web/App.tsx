import React from 'react';
import { View, Text } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { AuthFlow } from './src/components/auth/AuthFlow';

export default function App() {
  return (
    <AuthProvider>
      <View className="flex-1 bg-gray-100 p-5 sm:p-6 lg:p-8">
        <Text className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 mt-10 sm:mt-12 lg:mt-16">
          Frontier.Family
        </Text>

        {/* Test NativeWind styling */}
        <View className="bg-red-500 p-4 m-2 rounded-lg">
          <Text className="text-white text-center">NativeWind Test - Red Background</Text>
        </View>

        <AuthFlow />
      </View>
    </AuthProvider>
  );
}
