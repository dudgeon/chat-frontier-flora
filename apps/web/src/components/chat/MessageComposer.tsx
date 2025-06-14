import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Platform,
} from 'react-native';

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(44); // Increased initial height for better UX

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    const height = event.nativeEvent.contentSize.height;
    // Max height for approx 3 lines + padding (adjusted for new padding)
    const maxHeight = 108;
    setInputHeight(Math.min(Math.max(44, height + 8), maxHeight));
  };

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
      setInputHeight(44); // Reset height after sending
    }
  };

  // Task 4.4: Handle keyboard shortcuts properly
  const handleKeyPress = (event: any) => {
    // For web platform, handle Cmd+Enter and Ctrl+Enter
    if (Platform.OS === 'web') {
      const { key, metaKey, ctrlKey } = event.nativeEvent;

      // Send on Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if (key === 'Enter' && (metaKey || ctrlKey)) {
        event.preventDefault();
        handleSend();
        return;
      }

      // For mobile-like behavior, send on Enter without modifiers
      // (but only if not in the middle of composing)
      if (key === 'Enter' && !metaKey && !ctrlKey && !event.nativeEvent.shiftKey) {
        // Allow normal Enter for line breaks in multiline
        // Only send if user wants to (this is optional behavior)
        // For now, we'll keep Enter as line break and require Cmd/Ctrl+Enter to send
      }
    }
  };

  return (
    <View className="flex-row items-end p-4 pt-3 pb-4 border-t border-gray-200 bg-white gap-3">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message... (Cmd+Enter to send)"
        placeholderTextColor="#9ca3af"
        className="flex-1 border rounded-full px-4 py-3 text-base text-gray-900 bg-gray-50 border-gray-300 max-h-[108px]"
        style={{ height: inputHeight, textAlignVertical: 'top' }}
        multiline
        onContentSizeChange={handleContentSizeChange}
        onKeyPress={handleKeyPress}
        // Ref: 3.2.1 MessageComposer.InputField
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim()}
        className={`w-11 h-11 rounded-full items-center justify-center shadow ${text.trim() ? 'bg-blue-500' : 'bg-gray-400'}`}
        // Ref: 3.2.2 MessageComposer.SendButton
      >
        <Text className="text-white text-lg font-semibold">➤</Text>
      </TouchableOpacity>
    </View>
  );
};
