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
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
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

    // Task 4.3: Trigger mock response after user message
    setTimeout(() => {
      simulateStreamingResponse(messageText.trim());
    }, 500); // Small delay to simulate processing
  }, []);

  // Task 4.3: Mock response function with streaming simulation
  const simulateStreamingResponse = useCallback((userMessage: string) => {
    const responseText = `You said: "${userMessage}". This is a mock echo response that demonstrates the streaming functionality.`;

    // Create initial bot message with empty text
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: MessageType = {
      id: botMessageId,
      author: 'bot',
      text: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, initialBotMessage]);

    // Simulate streaming by adding characters over time
    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      if (currentIndex < responseText.length) {
        const nextChar = responseText[currentIndex];
        setMessages(prev =>
          prev.map(msg => (msg.id === botMessageId ? { ...msg, text: msg.text + nextChar } : msg))
        );
        currentIndex++;
      } else {
        clearInterval(streamInterval);
      }
    }, 30); // Add character every 30ms for smooth streaming effect
  }, []);

  return (
    <View className="flex-1 justify-between">
      {/* Ref: 3 ChatInterface.Root */}
      <View className="flex-1">
        {/* Ref: 3.1 MessageList.Component */}
        <MessageList messages={messages} />
      </View>
      {/* Ref: 3.2 MessageComposer.Component */}
      <MessageComposer onSendMessage={handleSendMessage} />
    </View>
  );
};
