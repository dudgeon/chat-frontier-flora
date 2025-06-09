import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import type { TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  // NativeWind classes
  const baseClasses = "h-10 rounded-md px-4 justify-center items-center";
  const variantClasses = {
    primary: "bg-primary-600",
    secondary: "bg-gray-500",
    outline: "bg-transparent border border-primary-600"
  };
  const fullWidthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50" : "";

  const buttonClassName = `${baseClasses} ${variantClasses[variant]} ${fullWidthClass} ${disabledClass}`.trim();

  const textClasses = {
    primary: "text-white text-base font-medium",
    secondary: "text-white text-base font-medium",
    outline: "text-primary-600 text-base font-medium"
  };
  const disabledTextClass = disabled ? "text-gray-400" : "";
  const textClassName = `${textClasses[variant]} ${disabledTextClass}`.trim();

  // Fallback StyleSheet styles
  const buttonStyles = [
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      className={buttonClassName}
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#3B82F6' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text className={textClassName} style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Keep StyleSheet as fallback
const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: '#6B7280',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#3B82F6',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});
