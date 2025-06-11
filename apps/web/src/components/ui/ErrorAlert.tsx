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
 * A beautiful, NativeWind-styled error alert component that displays
 * error messages with proper styling and dismiss functionality.
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
    <View
      className={`rounded-lg border p-4 mb-4 ${styles.container}`}
      style={{
        backgroundColor: type === 'error' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#eff6ff',
        borderColor: type === 'error' ? '#fecaca' : type === 'warning' ? '#fde68a' : '#bfdbfe',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 20, marginRight: 12 }}>{styles.icon}</Text>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: type === 'error' ? '#991b1b' : type === 'warning' ? '#92400e' : '#1e40af',
              marginBottom: 4,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: type === 'error' ? '#7f1d1d' : type === 'warning' ? '#854d0e' : '#1e40af',
            }}
          >
            {message}
          </Text>
        </View>

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={{
              padding: 4,
              marginLeft: 8,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={{
                fontSize: 18,
                color: type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb',
                fontWeight: '500',
              }}
            >
              ×
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
