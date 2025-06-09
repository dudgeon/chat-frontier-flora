import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import type { TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}) => {
  // Base button classes with responsive design
  const baseClasses = "flex justify-center items-center rounded-lg font-medium transition-colors duration-200";

  // Size classes with responsive breakpoints
  const sizeClasses = {
    small: "h-8 px-3 text-sm sm:h-9 sm:px-4",
    medium: "h-10 px-4 text-base sm:h-11 sm:px-6",
    large: "h-12 px-6 text-lg sm:h-14 sm:px-8"
  };

  // Variant classes with hover and active states
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white",
    outline: "bg-transparent border border-blue-600 hover:bg-blue-50 active:bg-blue-100 text-blue-600"
  };

  // Width classes
  const widthClass = fullWidth ? "w-full" : "";

  // Disabled state classes
  const disabledClasses = disabled || loading
    ? "opacity-50 cursor-not-allowed"
    : "";

  // Combine all button classes
  const buttonClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    widthClass,
    disabledClasses
  ].filter(Boolean).join(' ');

  // Text classes for different variants and states
  const getTextClasses = () => {
    const baseTextClasses = "font-medium";

    // Size-specific text classes
    const textSizeClasses = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg"
    };

    // Variant-specific text colors (already included in button variant classes)
    const textColorClasses = {
      primary: "text-white",
      secondary: "text-white",
      outline: "text-blue-600"
    };

    // Disabled text color override
    const disabledTextClass = disabled || loading ? "text-gray-400" : "";

    return [
      baseTextClasses,
      textSizeClasses[size],
      !disabled && !loading ? textColorClasses[variant] : "",
      disabledTextClass
    ].filter(Boolean).join(' ');
  };

  // Loading spinner color based on variant
  const getSpinnerColor = () => {
    if (variant === 'outline') return '#3B82F6'; // blue-600
    return '#FFFFFF'; // white
  };

  return (
    <TouchableOpacity
      className={buttonClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={getSpinnerColor()}
          size="small"
          className="w-4 h-4"
        />
      ) : (
        <Text className={getTextClasses()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
