import React from 'react';
import { Text, View } from 'react-native';

// Design system constants (matching other components)
const designSystem = {
  colors: {
    green500: '#22C55E',
    green600: '#16A34A',
    red500: '#EF4444',
    red600: '#DC2626',
    yellow500: '#EAB308',
    yellow600: '#CA8A04',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
  },
  fontSize: {
    sm: 12,
    base: 14,
    lg: 16,
  },
};

export type ValidationState = 'success' | 'error' | 'warning' | 'pending' | 'neutral';

interface ValidationIconProps {
  state: ValidationState;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  customText?: string;
  testID?: string;
}

/**
 * ValidationIcon component provides visual feedback for validation states.
 *
 * Features:
 * - Color-coded icons for different validation states
 * - Consistent design system integration
 * - Accessibility support with proper labels
 * - Customizable size and text display
 * - Support for success, error, warning, pending, and neutral states
 *
 * @param props - The validation icon component props
 * @returns A styled validation icon with optional text
 */
export const ValidationIcon: React.FC<ValidationIconProps> = ({
  state,
  size = 'md',
  showText = false,
  customText,
  testID,
}) => {
  const getIconConfig = () => {
    switch (state) {
      case 'success':
        return {
          icon: '✓',
          color: designSystem.colors.green500,
          text: customText || 'Valid',
          accessibilityLabel: 'Success: Validation passed',
        };
      case 'error':
        return {
          icon: '✗',
          color: designSystem.colors.red500,
          text: customText || 'Invalid',
          accessibilityLabel: 'Error: Validation failed',
        };
      case 'warning':
        return {
          icon: '⚠',
          color: designSystem.colors.yellow500,
          text: customText || 'Warning',
          accessibilityLabel: 'Warning: Validation warning',
        };
      case 'pending':
        return {
          icon: '○',
          color: designSystem.colors.gray400,
          text: customText || 'Pending',
          accessibilityLabel: 'Pending: Validation in progress',
        };
      case 'neutral':
      default:
        return {
          icon: '○',
          color: designSystem.colors.gray500,
          text: customText || 'Not checked',
          accessibilityLabel: 'Neutral: No validation status',
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          iconSize: designSystem.fontSize.sm,
          textSize: designSystem.fontSize.sm,
          spacing: designSystem.spacing.xs,
        };
      case 'lg':
        return {
          iconSize: designSystem.fontSize.lg,
          textSize: designSystem.fontSize.base,
          spacing: designSystem.spacing.sm,
        };
      case 'md':
      default:
        return {
          iconSize: designSystem.fontSize.base,
          textSize: designSystem.fontSize.base,
          spacing: designSystem.spacing.xs,
        };
    }
  };

  const iconConfig = getIconConfig();
  const sizeConfig = getSizeConfig();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: sizeConfig.spacing,
      }}
      testID={testID}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={iconConfig.accessibilityLabel}
    >
      <Text
        style={{
          fontSize: sizeConfig.iconSize,
          color: iconConfig.color,
          fontWeight: '600' as const,
          lineHeight: sizeConfig.iconSize + 2,
        }}
        testID={testID ? `${testID}-icon` : undefined}
        accessible={false} // Parent handles accessibility
      >
        {iconConfig.icon}
      </Text>
      {showText && (
        <Text
          style={{
            fontSize: sizeConfig.textSize,
            color: iconConfig.color,
            fontWeight: '500' as const,
          }}
          testID={testID ? `${testID}-text` : undefined}
          accessible={false} // Parent handles accessibility
        >
          {iconConfig.text}
        </Text>
      )}
    </View>
  );
};
