import React from 'react';
import { TextInput, Text, View } from 'react-native';
import type { TextInputProps } from 'react-native';

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

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

/**
 * FormInput component with inline styles using design system constants.
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
 * - Container: Uses design system spacing for margins
 * - Label: Consistent typography with medium font weight
 * - Input: Dynamic border colors based on error state, consistent padding and sizing
 * - Error text: Consistent error styling with design system colors
 *
 * @param props - The form input component props (extends TextInputProps)
 * @returns A styled form input component with label and optional error message
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={{
      marginBottom: designSystem.spacing.md,
    }}>
      <Text style={{
        fontSize: designSystem.fontSize.base,
        marginBottom: designSystem.spacing.sm,
        fontWeight: designSystem.fontWeight.medium,
        color: designSystem.colors.gray900,
      }}>{label}</Text>
      <TextInput
        style={[
          {
            height: 40,
            borderWidth: 1,
            borderColor: error ? designSystem.colors.red500 : designSystem.colors.gray300,
            borderRadius: designSystem.borderRadius.md,
            paddingHorizontal: 12,
            fontSize: designSystem.fontSize.base,
            backgroundColor: designSystem.colors.white,
          },
          ...(style ? [style] : [])
        ]}
        {...props}
      />
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
