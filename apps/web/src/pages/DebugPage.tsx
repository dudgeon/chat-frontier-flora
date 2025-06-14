import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const DebugPage: React.FC = () => {
  const { user, loading, error, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();
      // Force reload
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Page</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auth State:</Text>
        <Text>Loading: {loading ? 'true' : 'false'}</Text>
        <Text>User: {user ? 'authenticated' : 'not authenticated'}</Text>
        <Text>Email: {user?.email || 'none'}</Text>
        <Text>Error: {error?.message || 'none'}</Text>
      </View>

      {/* NativeWind Test Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NativeWind Test:</Text>
        <View className="my-2 items-end px-4">
          <View className="bg-green-500 rounded-lg rounded-tr-sm px-4 py-3 max-w-[80%] min-w-[60px]">
            <Text className="text-white text-base leading-6">
              Test message bubble - should be green with white text
            </Text>
          </View>
        </View>
        <Text>If the above message shows with green background and white text, NativeWind is working!</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={clearStorage}>
          <Text style={styles.buttonText}>Clear Storage & Reload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
