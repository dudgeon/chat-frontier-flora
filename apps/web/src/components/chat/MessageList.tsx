import React, { useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Message, MessageType } from './Message';

interface MessageListProps {
  messages: MessageType[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  // Task 4.5: Ref for auto-scrolling to bottom
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1, padding: 16 }}
      showsVerticalScrollIndicator={false}
      // Ref: 3.1.1 MessageList.ScrollView
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          author={message.author}
          text={message.text}
          timestamp={message.timestamp}
          // Ref: 3.1.2 MessageList.MessageItem
        />
      ))}
    </ScrollView>
  );
};
