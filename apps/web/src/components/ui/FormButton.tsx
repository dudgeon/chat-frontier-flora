import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';

interface FormButtonProps extends PressableProps {
  title: string;
  disabled?: boolean;
}

export function FormButton({ title, disabled = false, ...props }: FormButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={`w-full items-center justify-center rounded-xl py-4 px-6 ${
        disabled ? 'bg-gray-400 opacity-60' : 'bg-blue-500'
      }`}
      {...props}
    >
      <Text className="text-white font-semibold text-base">
        {title}
      </Text>
    </Pressable>
  );
}
