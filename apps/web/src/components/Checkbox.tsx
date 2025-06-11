import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

// Design system constants (matching other components)
const designSystem = {
  colors: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray900: '#111827',
    blue600: '#2563EB',
    red500: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
  },
  fontSize: {
    sm: 14,
    base: 16,
    lg: 18,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 20,
    normal: 24,
  },
};

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  error?: string;
  testID?: string;
}

/**
 * Checkbox component with inline styles using design system constants.
 *
 * This component has been converted from StyleSheet to inline styles as part of the
 * NativeWind implementation project. It uses a centralized design system for consistent
 * styling across the application.
 *
 * Design System Features:
 * - Consistent color palette (gray scale, blue primary, red error)
 * - Standardized spacing system (xs: 4px, sm: 8px, md: 16px, etc.)
 * - Unified border radius values (sm: 4px, md: 6px, lg: 8px)
 * - Typography scale with consistent font sizes and weights
 *
 * Styling Approach:
 * - Container: Uses design system spacing for margins and overflow handling
 * - Checkbox box: Dynamic border and background colors based on state (checked/error)
 * - Label: Flexible text with proper wrapping and responsive behavior
 * - Error text: Consistent error styling with design system colors
 *
 * @param props - The checkbox component props
 * @returns A styled checkbox component with label and optional error message
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  error,
  testID,
}) => {
  return (
    <View style={{
      marginBottom: designSystem.spacing.md,
      maxWidth: '100%',
      overflow: 'hidden',
    }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={`${label}, checkbox ${checked ? 'checked' : 'unchecked'}`}
        accessibilityHint="Toggle checkbox selection"
        testID={testID}
      >
        <View style={{
          width: 20,
          height: 20,
          borderWidth: 2,
          borderColor: error ? designSystem.colors.red500 : (checked ? designSystem.colors.blue600 : designSystem.colors.gray300),
          borderRadius: designSystem.borderRadius.sm,
          marginRight: designSystem.spacing.sm,
          marginTop: 2,
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
          backgroundColor: checked ? designSystem.colors.blue600 : 'transparent',
        }}>
          {checked && (
            <View style={{
              width: 10,
              height: 10,
              backgroundColor: designSystem.colors.white,
              borderRadius: 2,
            }} />
          )}
        </View>
        <Text style={{
          fontSize: designSystem.fontSize.sm,
          color: designSystem.colors.gray900,
          flex: 1,
          lineHeight: designSystem.lineHeight.tight,
          flexShrink: 1,
          flexWrap: 'wrap',
          minWidth: 0,
        }}>{label}</Text>
      </TouchableOpacity>
      {error && (
        <Text style={{
          color: designSystem.colors.red500,
          fontSize: designSystem.fontSize.sm,
          marginTop: designSystem.spacing.xs,
        }}>{error}</Text>
      )}
    </View>
  );
};
