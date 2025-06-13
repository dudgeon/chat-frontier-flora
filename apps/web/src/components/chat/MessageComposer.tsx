import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, NativeSyntheticEvent, TextInputContentSizeChangeEventData, Platform } from 'react-native';

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(44); // Increased initial height for better UX

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
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
    <View style={{
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 16,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      backgroundColor: '#ffffff',
      gap: 12,
    }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message... (Cmd+Enter to send)"
        placeholderTextColor="#9ca3af"
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          color: '#111827',
          backgroundColor: '#f9fafb',
          borderColor: '#d1d5db',
          height: inputHeight,
          maxHeight: 108,
          textAlignVertical: 'top',
        }}
        multiline
        onContentSizeChange={handleContentSizeChange}
        onKeyPress={handleKeyPress}
        // Ref: 3.2.1 MessageComposer.InputField
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim()}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: text.trim() ? '#3b82f6' : '#9ca3af',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
        // Ref: 3.2.2 MessageComposer.SendButton
      >
        <Text style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: '600',
        }}>
          ➤
        </Text>
      </TouchableOpacity>
    </View>
  );
};
