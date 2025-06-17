import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  error?: boolean;
}

export const InputField = React.forwardRef<TextInput, InputFieldProps>(
  ({ error = false, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholderTextColor="#9ca3af"
        style={{
          width: '100%',
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          fontSize: 16,
          color: '#111827',
          backgroundColor: '#ffffff',
          borderColor: error ? '#ef4444' : '#d1d5db',
        }}
        {...props}
      />
    );
  }
);
