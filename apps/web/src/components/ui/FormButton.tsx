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
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
        opacity: disabled ? 0.6 : 1,
      }}
      {...props}
    >
      <Text style={{
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
      }}>
        {title}
      </Text>
    </Pressable>
  );
}
