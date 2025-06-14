import React from 'react';
import { View, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';

// Define a type for the message props
export interface MessageType {
  id: string;
  author: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Message: React.FC<MessageType> = ({ author, text }) => {
  const isUser = author === 'user';

  if (isUser) {
    // User messages: right-aligned with speech bubble (PRD 4.3.2)
    return (
      <View className="my-2 items-end px-4">
        <View className="bg-blue-600 rounded-lg rounded-tr-sm px-4 py-3 max-w-[80%] min-w-[60px]">
          <Text className="text-white text-base leading-6">{text}</Text>
        </View>
      </View>
    );
  } else {
    // Bot messages: left-aligned WITHOUT speech bubble (PRD 4.3.2)
    return (
      <View className="my-2 items-start px-4">
        <View className="max-w-[80%]">
          <Markdown
            style={{
              body: {
                color: '#111827',
                fontSize: 16,
                lineHeight: 24,
                margin: 0,
              },
            }}
          >
            {text}
          </Markdown>
        </View>
      </View>
    );
  }
};
