import React from 'react';
import { View, Text, Dimensions } from 'react-native';

/**
 * 🎨 DESIGN SYSTEM - NativeWind Compatible Values
 *
 * These values align with Tailwind CSS for easy NativeWind conversion
 */
const designSystem = {
  // Colors (Tailwind equivalent)
  colors: {
    gray200: '#e5e7eb',   // bg-gray-200
    gray500: '#6b7280',   // text-gray-500
    gray600: '#4b5563',   // text-gray-600
    gray700: '#374151',   // text-gray-700
    green500: '#22c55e',  // text-green-500
    green600: '#16a34a',  // text-green-600
    green700: '#15803d',  // text-green-700
    red500: '#ef4444',    // text-red-500
    red600: '#dc2626',    // text-red-600
    orange500: '#f97316', // text-orange-500
    orange600: '#ea580c', // text-orange-600
    yellow500: '#eab308', // text-yellow-500
    yellow600: '#ca8a04', // text-yellow-600
  },

  // Spacing (Tailwind equivalent)
  spacing: {
    1: 4,    // space-1
    2: 8,    // space-2
    3: 12,   // space-3
    4: 16,   // space-4
    6: 24,   // space-6
    8: 32,   // space-8
  },

  // Typography (Tailwind equivalent)
  text: {
    xs: 11,   // text-xs
    sm: 14,   // text-sm
    base: 16, // text-base
  },

  // Border radius (Tailwind equivalent)
  radius: {
    sm: 4,    // rounded-sm
    md: 6,    // rounded-md
    lg: 8,    // rounded-lg
  },
};

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
  required: boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'minLength',
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
    required: true,
  },
  {
    id: 'hasUppercase',
    label: 'At least one uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
    required: true,
  },
  {
    id: 'hasLowercase',
    label: 'At least one lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
    required: true,
  },
  {
    id: 'hasNumber',
    label: 'At least one number',
    test: (password: string) => /\d/.test(password),
    required: true,
  },
  {
    id: 'hasSpecialChar',
    label: 'At least one special character (!@#$%^&*)',
    test: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    required: true,
  },
];

export interface PasswordValidationProps {
  password: string;
  showRules?: boolean;
  style?: any;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  showRules = true,
  style,
}) => {
  // Get screen dimensions for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 768; // Mobile breakpoint
  const isVerySmallScreen = screenWidth < 480; // Very small mobile screens

  // Calculate which rules are met
  const ruleResults = PASSWORD_RULES.map(rule => ({
    ...rule,
    passed: rule.test(password),
  }));

  // Calculate strength score (0-100)
  const requiredRulesPassed = ruleResults.filter(rule => rule.required && rule.passed).length;
  const totalRequiredRules = ruleResults.filter(rule => rule.required).length;
  let strengthScore = 0;

  if (password.length > 0) {
    // Base score from required rules (80% of total)
    strengthScore += (requiredRulesPassed / totalRequiredRules) * 80;

    // Bonus points for length beyond minimum (up to 20%)
    if (password.length > 8) {
      const lengthBonus = Math.min((password.length - 8) * 2, 20);
      strengthScore += lengthBonus;
    }
  }

  // Determine strength category and color
  let strengthLabel: string;
  let strengthColor: string;
  let progressColor: string;

  if (strengthScore < 40) {
    strengthLabel = 'Weak';
    strengthColor = '#dc2626'; // red-600
    progressColor = '#ef4444'; // red-500
  } else if (strengthScore < 60) {
    strengthLabel = 'Fair';
    strengthColor = '#ea580c'; // orange-600
    progressColor = '#f97316'; // orange-500
  } else if (strengthScore < 80) {
    strengthLabel = 'Good';
    strengthColor = '#ca8a04'; // yellow-600
    progressColor = '#eab308'; // yellow-500
  } else {
    strengthLabel = 'Strong';
    strengthColor = '#16a34a'; // green-600
    progressColor = '#22c55e'; // green-500
  }

  const allRequiredRulesPassed = requiredRulesPassed === totalRequiredRules;

  if (!password || !showRules) {
    return null;
  }

  // Responsive styles using design system
  const containerStyle = [
    {
      marginTop: 12,
      paddingHorizontal: 4,
    },
    isSmallScreen && {
      marginTop: 8,
      paddingHorizontal: 2,
    },
    style,
  ];

  const rulesGridStyle = [
    {
      marginTop: 8,
      marginBottom: 4,
    },
    isSmallScreen && {
      marginTop: 6,
    },
    // isVerySmallScreen styles would go here if needed
  ];

  const ruleTextStyle = [
    {
      fontSize: 11,
      flex: 1,
      lineHeight: 16,
    },
    isSmallScreen && {
      fontSize: 10,
      lineHeight: 14,
    },
  ];

  // Accessibility: Generate comprehensive screen reader descriptions
  const strengthDescription = `Password strength is ${strengthLabel.toLowerCase()}, ${Math.round(strengthScore)} percent complete`;

  const rulesDescription = ruleResults.map(rule =>
    `${rule.label}: ${rule.passed ? 'satisfied' : 'not satisfied'}`
  ).join(', ');

  const overallDescription = allRequiredRulesPassed
    ? 'All password requirements have been met'
    : `${requiredRulesPassed} of ${totalRequiredRules} password requirements have been met`;

  const fullAccessibilityDescription = `${strengthDescription}. Password requirements: ${rulesDescription}. ${overallDescription}`;

  return (
        <View
      style={containerStyle}
      testID="password-validation"
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Password validation feedback"
      accessibilityHint="Shows password strength and requirement status"
      accessibilityValue={{ text: fullAccessibilityDescription }}
    >
      {/* Password Strength Indicator */}
      <View
        style={{ marginBottom: 12 }}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={`Password strength indicator: ${strengthLabel}`}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(strengthScore),
          text: strengthDescription
        }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500' as const,
              color: '#374151', // gray-700
            }}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="Password strength section"
          >
            Password Strength
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500' as const,
              color: strengthColor,
            }}
            testID="strength-label"
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Current password strength: ${strengthLabel}`}
          >
            {strengthLabel}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#e5e7eb', // gray-200
            borderRadius: 4,
            overflow: 'hidden',
          }}
          testID="strength-progress-container"
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel="Password strength progress bar"
          accessibilityValue={{
            min: 0,
            max: 100,
            now: Math.round(strengthScore),
            text: `${Math.round(strengthScore)} percent strength`
          }}
        >
          <View
            style={{
              height: '100%',
              borderRadius: 4,
              width: `${strengthScore}%`,
              backgroundColor: progressColor,
            }}
            testID="strength-progress-bar"
            accessible={false} // Parent handles accessibility
          />
        </View>

        <Text
          style={{
            fontSize: 11,
            color: '#6b7280', // gray-500
            marginTop: 4,
          }}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Password strength percentage: ${Math.round(strengthScore)} percent`}
        >
          {Math.round(strengthScore)}% strength
        </Text>
      </View>

      {/* Password Rules - Responsive Grid Layout */}
      <View
        style={rulesGridStyle}
        accessible={true}
        accessibilityRole="list"
        accessibilityLabel="Password requirements list"
        accessibilityHint="List of password requirements and their current status"
      >
        {ruleResults.map((rule, index) => (
          <View
            key={rule.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
              paddingVertical: 1,
            }}
            testID={`rule-${rule.id}`}
                        accessible={true}
            accessibilityRole="none"
            accessibilityLabel={`Requirement ${index + 1}: ${rule.label}`}
            accessibilityValue={{ text: rule.passed ? 'satisfied' : 'not satisfied' }}
            accessibilityState={{
              checked: rule.passed,
              disabled: false
            }}
          >
            <Text
              style={{
                fontSize: 12,
                marginRight: 8,
                width: 12,
                textAlign: 'center' as const,
                color: rule.passed ? '#22c55e' : '#9ca3af',
              }}
              testID={`rule-${rule.id}-${rule.passed ? 'check' : 'x'}`}
              accessible={false} // Parent handles accessibility
            >
              {rule.passed ? '✓' : '○'}
            </Text>
            <Text
              style={[
                ruleTextStyle,
                { color: rule.passed ? '#15803d' : '#6b7280' }
              ]}
              testID={`rule-${rule.id}-label`}
              accessible={false} // Parent handles accessibility
            >
              {rule.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Overall Status */}
      {password.length > 0 && (
        <View
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb', // gray-200
          }}
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Password requirements summary"
          accessibilityLiveRegion="polite"
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '400' as const,
              color: allRequiredRulesPassed ? '#16a34a' : '#6b7280',
            }}
            testID="overall-status"
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={overallDescription}
          >
            {allRequiredRulesPassed ? (
              '✓ All requirements met'
            ) : (
              `${requiredRulesPassed} of ${totalRequiredRules} requirements met`
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PasswordValidation;
