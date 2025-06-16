import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { MessageType } from './Message';

export const ChatInterface: React.FC = () => {
  // Task 4.1: State to manage the list of messages
  const [messages, setMessages] = useState<MessageType[]>([
    // Initial welcome message from bot
    {
      id: '1',
      author: 'bot',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);

  // Task 4.2: Function to handle sending messages
  const handleSendMessage = useCallback((messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      author: 'user',
      text: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // SIMPLIFIED: Direct bot response (streaming simulation removed for simplicity)
    const responseText = `You said: "${messageText}". This is a mock echo response.`;
    const botMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      author: 'bot',
      text: responseText,
      timestamp: new Date(),
    };

    // Add bot response immediately (no streaming simulation)
    setMessages(prev => [...prev, botMessage]);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      {/* Ref: 3 ChatInterface.Root */}
      <View style={{ flex: 1 }}>
        {/* Ref: 3.1 MessageList.Component */}
        <MessageList messages={messages} />
      </View>
      {/* Ref: 3.2 MessageComposer.Component */}
      <MessageComposer onSendMessage={handleSendMessage} />
    </View>
  );
};
