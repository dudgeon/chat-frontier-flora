import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  visible: boolean;
  type?: 'error' | 'warning' | 'info';
}

/**
 * ErrorAlert Component
 *
 * A NativeWind-styled error alert component that displays
 * error messages with proper styling and dismiss functionality.
 * Fully converted to use NativeWind v4 utility classes.
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  message,
  onDismiss,
  visible,
  type = 'error'
}) => {
  if (!visible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: '🚨',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          buttonColor: 'text-red-600'
        };
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200',
          icon: '⚠️',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          buttonColor: 'text-amber-600'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'ℹ️',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          buttonColor: 'text-blue-600'
        };
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: '🚨',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          buttonColor: 'text-red-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <View className={`rounded-lg border p-4 mb-4 ${styles.container}`}>
      <View className="flex-row items-start">
        <Text className="text-xl mr-3">{styles.icon}</Text>

        <View className="flex-1">
          <Text className={`text-base font-semibold mb-1 ${styles.titleColor}`}>
            {title}
          </Text>

          <Text className={`text-sm leading-5 ${styles.messageColor}`}>
            {message}
          </Text>
        </View>

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            className="p-1 ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className={`text-lg font-medium ${styles.buttonColor}`}>
              ×
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
