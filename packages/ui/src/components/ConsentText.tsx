import React from 'react';
import { Text, View } from 'react-native';

// Design system constants (matching other components)
const designSystem = {
  colors: {
    gray700: '#374151',
    gray600: '#4B5563',
    gray500: '#6B7280',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  fontSize: {
    xs: 11,
    sm: 14,
    base: 16,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
  },
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
  },
};

export type ConsentType = 'age-verification' | 'development-consent' | 'terms-of-service' | 'privacy-policy';

interface ConsentTextProps {
  type: ConsentType;
  variant?: 'default' | 'compact' | 'detailed';
  testID?: string;
}

/**
 * ConsentText component provides properly formatted consent text.
 *
 * Features:
 * - Pre-defined consent text for different purposes
 * - Consistent formatting and styling
 * - Accessibility support with proper labels
 * - Multiple variants (default, compact, detailed)
 * - Clear visual hierarchy with emphasis on key terms
 *
 * @param props - The consent text component props
 * @returns A styled consent text component
 */
export const ConsentText: React.FC<ConsentTextProps> = ({
  type,
  variant = 'default',
  testID,
}) => {
  const getConsentContent = () => {
    switch (type) {
      case 'age-verification':
        return {
          title: 'Age Verification',
          content: variant === 'compact'
            ? 'I confirm that I am 18 years of age or older.'
            : 'I confirm that I am at least 18 years of age and legally able to enter into this agreement.',
          emphasis: ['18 years of age'],
          accessibilityLabel: 'Age verification consent: Confirms user is 18 or older',
        };

      case 'development-consent':
        return {
          title: 'Development Data Usage',
          content: variant === 'compact'
            ? 'I consent to the use of my data for development and improvement purposes.'
            : variant === 'detailed'
            ? 'I understand and consent to the collection and use of my interaction data, including chat messages, usage patterns, and feedback, for the purpose of improving the application\'s functionality, user experience, and AI model performance. This data will be used solely for development purposes and will be handled in accordance with our privacy policy.'
            : 'I consent to the use of my data for development and improvement purposes, including chat interactions and usage analytics.',
          emphasis: ['development and improvement purposes', 'chat interactions', 'usage analytics'],
          accessibilityLabel: 'Development consent: Allows data usage for app improvement',
        };

      case 'terms-of-service':
        return {
          title: 'Terms of Service',
          content: variant === 'compact'
            ? 'I agree to the Terms of Service.'
            : 'I have read, understood, and agree to be bound by the Terms of Service and all applicable policies.',
          emphasis: ['Terms of Service'],
          accessibilityLabel: 'Terms of service agreement',
        };

      case 'privacy-policy':
        return {
          title: 'Privacy Policy',
          content: variant === 'compact'
            ? 'I acknowledge the Privacy Policy.'
            : 'I have read and acknowledge the Privacy Policy and understand how my personal information will be collected, used, and protected.',
          emphasis: ['Privacy Policy'],
          accessibilityLabel: 'Privacy policy acknowledgment',
        };

      default:
        return {
          title: 'Consent',
          content: 'I provide my consent.',
          emphasis: [],
          accessibilityLabel: 'General consent',
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          fontSize: designSystem.fontSize.sm,
          lineHeight: designSystem.lineHeight.normal,
          marginBottom: designSystem.spacing.xs,
        };
      case 'detailed':
        return {
          fontSize: designSystem.fontSize.base,
          lineHeight: designSystem.lineHeight.relaxed,
          marginBottom: designSystem.spacing.md,
        };
      case 'default':
      default:
        return {
          fontSize: designSystem.fontSize.sm,
          lineHeight: designSystem.lineHeight.normal,
          marginBottom: designSystem.spacing.sm,
        };
    }
  };

  const consentContent = getConsentContent();
  const variantStyles = getVariantStyles();

  // Function to render text with emphasis
  const renderTextWithEmphasis = (text: string, emphasisTerms: string[]) => {
    if (emphasisTerms.length === 0) {
      return (
        <Text
          style={{
            fontSize: variantStyles.fontSize,
            lineHeight: variantStyles.lineHeight,
            color: designSystem.colors.gray700,
            fontWeight: designSystem.fontWeight.normal,
          }}
        >
          {text}
        </Text>
      );
    }

    // Split text by emphasis terms and render with different styles
    let parts = [text];
    emphasisTerms.forEach(term => {
      parts = parts.flatMap(part =>
        typeof part === 'string' ? part.split(term) : [part]
      );
    });

    return (
      <Text
        style={{
          fontSize: variantStyles.fontSize,
          lineHeight: variantStyles.lineHeight,
          color: designSystem.colors.gray700,
          fontWeight: designSystem.fontWeight.normal,
        }}
      >
        {parts.map((part, index) => {
          if (typeof part === 'string') {
            const isEmphasis = emphasisTerms.some(term =>
              text.includes(term) && index > 0 && index < parts.length - 1
            );
            return (
              <Text
                key={index}
                style={isEmphasis ? {
                  fontWeight: designSystem.fontWeight.semibold,
                  color: designSystem.colors.blue600,
                } : {}}
              >
                {part}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <View
      style={{
        marginBottom: variantStyles.marginBottom,
      }}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={consentContent.accessibilityLabel}
    >
      {variant === 'detailed' && (
        <Text
          style={{
            fontSize: designSystem.fontSize.base,
            fontWeight: designSystem.fontWeight.semibold,
            color: designSystem.colors.gray700,
            marginBottom: designSystem.spacing.xs,
          }}
          testID={testID ? `${testID}-title` : undefined}
          accessible={false} // Parent handles accessibility
        >
          {consentContent.title}
        </Text>
      )}
      <View
        testID={testID ? `${testID}-content` : undefined}
        accessible={false} // Parent handles accessibility
      >
        {renderTextWithEmphasis(consentContent.content, consentContent.emphasis)}
      </View>
    </View>
  );
};
