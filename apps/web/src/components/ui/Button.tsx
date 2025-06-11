import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from './text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ title, variant = 'primary', size = 'md', loading = false, style, disabled, ...props }, ref) => {
    const getButtonStyles = () => {
      const baseStyles = {
        borderRadius: 12,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
      };

      const sizeStyles = {
        sm: { paddingHorizontal: 16, paddingVertical: 8 },
        md: { paddingHorizontal: 24, paddingVertical: 12 },
        lg: { paddingHorizontal: 32, paddingVertical: 16 },
      };

      const variantStyles = {
        primary: {
          backgroundColor: disabled ? '#9CA3AF' : '#3B82F6', // blue-500 or gray-400
          borderWidth: 0,
        },
        secondary: {
          backgroundColor: disabled ? '#F3F4F6' : '#F3F4F6', // gray-100
          borderWidth: 1,
          borderColor: disabled ? '#E5E7EB' : '#D1D5DB', // gray-300 or gray-400
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? '#E5E7EB' : '#3B82F6', // gray-300 or blue-500
        },
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        opacity: loading ? 0.7 : 1,
      };
    };

    const getTextStyles = () => {
      const sizeStyles = {
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
      };

      const variantStyles = {
        primary: {
          color: disabled ? '#FFFFFF' : '#FFFFFF',
          fontWeight: '600' as const,
        },
        secondary: {
          color: disabled ? '#9CA3AF' : '#374151', // gray-400 or gray-700
          fontWeight: '500' as const,
        },
        outline: {
          color: disabled ? '#9CA3AF' : '#3B82F6', // gray-400 or blue-500
          fontWeight: '500' as const,
        },
      };

      return {
        ...sizeStyles[size],
        ...variantStyles[variant],
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      };
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[getButtonStyles(), style]}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <Text style={getTextStyles()}>
          {loading ? 'Loading...' : title}
        </Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
