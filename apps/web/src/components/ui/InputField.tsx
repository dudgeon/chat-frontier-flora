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
        className={`w-full border rounded-xl p-3 text-base text-gray-900 bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
    );
  }
);
