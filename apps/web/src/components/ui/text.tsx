import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  className?: string;
  variant?: 'default' | 'heading' | 'subheading' | 'caption' | 'label';
}

export const Text = React.forwardRef<RNText, TextProps>(
  ({ className, variant = 'default', style, children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'heading':
          return {
            fontSize: 28,
            fontWeight: '700' as const,
            color: '#111827', // gray-900
            marginBottom: 8,
          };
        case 'subheading':
          return {
            fontSize: 20,
            fontWeight: '600' as const,
            color: '#374151', // gray-700
            marginBottom: 6,
          };
        case 'label':
          return {
            fontSize: 14,
            fontWeight: '500' as const,
            color: '#374151', // gray-700
            marginBottom: 6,
          };
        case 'caption':
          return {
            fontSize: 12,
            fontWeight: '400' as const,
            color: '#6B7280', // gray-500
          };
        default:
          return {
            fontSize: 16,
            fontWeight: '400' as const,
            color: '#111827', // gray-900
            lineHeight: 24,
          };
      }
    };

    return (
      <RNText
        ref={ref}
        style={[
          {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          getVariantStyles(),
          style
        ]}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';
