import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[
          // Modern, clean styling that matches the example
          {
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            borderWidth: 2,
            borderColor: '#E5E7EB', // Light gray border
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontFamily: 'System', // Use system font
            lineHeight: 24,
          },
          style
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
