import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Design system constants for consistent styling (matching ChatPage.tsx)
const designSystem = {
  colors: {
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray200: '#e0e0e0',
    gray500: '#666666',
    gray700: '#333333',
    overlayDark: 'rgba(0, 0, 0, 0.5)',
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 }, // Reversed from -2 for left side
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  },
};

interface ChatHistoryPaneProps {
  show: boolean;
  onToggle: () => void;
}

// Ref: ChatHistoryPane.SessionList - placeholder static data
const dummySessions = [
  { id: 1, name: 'Family Planning', timestamp: '10:45 AM' },
  { id: 2, name: 'Grocery Ideas', timestamp: 'Yesterday' },
  { id: 3, name: 'Vacation Brainstorm', timestamp: 'Mon' },
];

export const ChatHistoryPane: React.FC<ChatHistoryPaneProps> = ({ show, onToggle }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      {/* Overlay - exact match to ProfileMenu */}
      <TouchableOpacity
        style={{
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: designSystem.colors.overlayDark,
          zIndex: 1,
        }}
        onPress={onToggle}
        testID="history-menu-overlay"
      />

      {/* History Menu - matching ProfileMenu but on left side */}
      <View style={{
        position: 'absolute' as const,
        top: 0,
        left: 0, // Changed from right: 0
        bottom: 0,
        width: 300,
        backgroundColor: designSystem.colors.white,
        borderRightWidth: 1, // Changed from borderLeftWidth
        borderRightColor: designSystem.colors.gray200, // Changed from borderLeftColor
        zIndex: 2,
        ...designSystem.shadow.sm,
      }} testID="history-menu">
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: designSystem.colors.gray200,
        }}>
          <TouchableOpacity
            onPress={onToggle}
            style={{
              padding: 4,
            }}
            testID="history-menu-close"
          >
            <Text style={{
              fontSize: 24,
              color: designSystem.colors.gray500,
            }}>×</Text>
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold' as const,
            color: designSystem.colors.gray700,
          }}>History</Text>
        </View>

        {/* New Chat Button */}
        <TouchableOpacity
          style={{
            backgroundColor: designSystem.colors.gray50,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 6,
            margin: 16,
          }}
          onPress={() => {
            /* TODO: implement new chat logic */
          }}
          testID="new-chat-button"
        >
          <Text style={{
            fontSize: 16,
            color: designSystem.colors.gray700,
            fontWeight: '500' as const,
            textAlign: 'center' as const,
          }}>✨ New</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          {dummySessions.map(session => (
            <TouchableOpacity
              key={session.id}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: designSystem.colors.gray200,
              }}
              // Ref: ChatHistoryPane.SessionListItem
            >
              <Text style={{ fontSize: 16, color: designSystem.colors.gray700, marginBottom: 4 }}>
                {session.name}
              </Text>
              <Text style={{ fontSize: 12, color: designSystem.colors.gray500 }}>
                {session.timestamp}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};
