import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ChatHistoryPane } from './chat/ChatHistoryPane';
import { ChatInterface } from './chat/ChatInterface';

interface ChatPageProps {
  showProfileMenu?: boolean;
  onToggleProfileMenu?: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  showProfileMenu = false,
  onToggleProfileMenu,
}) => {
  const { user, signOut } = useAuth();
  const [showHistoryPane, setShowHistoryPane] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View className="flex-1 flex-row bg-gray-100" testID="chat-page">
      {/* Main Chat Area */}
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setShowHistoryPane(!showHistoryPane)}
              className="p-2 mr-2"
              testID="history-menu-button"
            >
              <Text className="text-lg text-gray-500">☰</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-700">Frontier.Family</Text>
          </View>
          <TouchableOpacity
            className="p-2 rounded bg-gray-300"
            onPress={onToggleProfileMenu}
            testID="profile-menu-button"
            accessibilityRole="button"
            accessibilityLabel="Open user profile menu"
            accessibilityHint="Opens the profile menu with account settings and logout option"
            aria-label="User profile menu"
            aria-expanded={showProfileMenu}
            aria-haspopup="menu"
          >
            <Text className="text-lg text-gray-500">👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          <ChatInterface />
        </ScrollView>
      </View>

      <ChatHistoryPane show={showHistoryPane} onToggle={() => setShowHistoryPane(false)} />

      {/* Profile Menu - Right Sidebar */}
      {showProfileMenu && (
        <>
          {/* Overlay for mobile */}
          <TouchableOpacity
            className="absolute inset-0 bg-black/50 z-10"
            onPress={onToggleProfileMenu}
            testID="profile-menu-overlay"
          />

          {/* Profile Menu */}
          <View
            className="absolute right-0 top-0 bottom-0 w-[300px] bg-white border-l border-gray-200 z-20 shadow"
            testID="profile-menu"
          >
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-700">Profile</Text>
              <TouchableOpacity
                onPress={onToggleProfileMenu}
                className="p-1"
                testID="profile-menu-close"
              >
                <Text className="text-2xl text-gray-500">×</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-1 p-4">
              <View className="mb-6 p-4 bg-gray-50 rounded-lg">
                <Text className="text-base font-medium text-gray-700 mb-1">{user?.email}</Text>
                <Text className="text-xs text-gray-500 uppercase">Email</Text>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">Account</Text>
                <TouchableOpacity className="py-3 px-4 rounded-md mb-1">
                  <Text className="text-base text-gray-700">Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3 px-4 rounded-md mb-1">
                  <Text className="text-base text-gray-700">Preferences</Text>
                </TouchableOpacity>
              </View>

              <View className="mb-6">
                <TouchableOpacity
                  className="py-3 px-4 rounded-md mb-1 bg-red-600 mt-4"
                  onPress={handleLogout}
                  testID="logout-button"
                >
                  <Text className="text-base text-white font-medium text-center">Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
