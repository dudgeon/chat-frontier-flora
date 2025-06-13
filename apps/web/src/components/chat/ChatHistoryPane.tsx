import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
        className="absolute inset-0 bg-black/50 z-10"
        onPress={onToggle}
        testID="history-menu-overlay"
      />

      {/* History Menu - matching ProfileMenu but on left side */}
      <View
        className="absolute left-0 top-0 bottom-0 w-[300px] bg-white border-r border-gray-200 z-20 shadow"
        testID="history-menu"
      >
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onToggle} className="p-1" testID="history-menu-close">
            <Text className="text-2xl text-gray-500">×</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-700">History</Text>
        </View>

        {/* New Chat Button */}
        <TouchableOpacity
          className="bg-gray-50 py-3 px-4 rounded-md m-4"
          onPress={() => {
            /* TODO: implement new chat logic */
          }}
          testID="new-chat-button"
        >
          <Text className="text-base text-gray-700 font-medium text-center">✨ New</Text>
        </TouchableOpacity>

        <View className="flex-1">
          {dummySessions.map(session => (
            <TouchableOpacity
              key={session.id}
              className="py-3 px-4 border-b border-gray-200"
              // Ref: ChatHistoryPane.SessionListItem
            >
              <Text className="text-base text-gray-700 mb-1">{session.name}</Text>
              <Text className="text-xs text-gray-500">{session.timestamp}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};
