import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

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

  // Responsive styles
  const containerStyle = [
    styles.container,
    isSmallScreen && styles.containerMobile,
    style,
  ];

  const rulesGridStyle = [
    styles.rulesGrid,
    isSmallScreen && styles.rulesGridMobile,
    isVerySmallScreen && styles.rulesGridVerySmall,
  ];

  const ruleTextStyle = [
    styles.ruleText,
    isSmallScreen && styles.ruleTextMobile,
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
        style={styles.strengthSection}
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
        <View style={styles.strengthHeader}>
          <Text
            style={styles.strengthTitle}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="Password strength section"
          >
            Password Strength
          </Text>
          <Text
            style={[styles.strengthLabel, { color: strengthColor }]}
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
          style={styles.progressContainer}
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
            style={[
              styles.progressBar,
              {
                width: `${strengthScore}%`,
                backgroundColor: progressColor,
              }
            ]}
            testID="strength-progress-bar"
            accessible={false} // Parent handles accessibility
          />
        </View>

        <Text
          style={styles.strengthPercentage}
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
            style={styles.ruleItem}
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
              style={[
                styles.ruleIcon,
                { color: rule.passed ? '#22c55e' : '#9ca3af' }
              ]}
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
          style={styles.statusSection}
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Password requirements summary"
          accessibilityLiveRegion="polite"
        >
          <Text
            style={[
              styles.statusText,
              { color: allRequiredRulesPassed ? '#16a34a' : '#6b7280' }
            ]}
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

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  containerMobile: {
    marginTop: 8,
    paddingHorizontal: 2,
  },

  // Strength Section
  strengthSection: {
    marginBottom: 12,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    // Smooth transition effect would be handled by Animated in React Native
  },
  strengthPercentage: {
    fontSize: 11,
    color: '#6b7280', // gray-500
    marginTop: 4,
  },

  // Rules Section
  rulesGrid: {
    marginTop: 8,
    marginBottom: 4,
  },
  rulesGridMobile: {
    marginTop: 6,
  },
  rulesGridVerySmall: {
    // On very small screens, stack rules more compactly
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 1,
  },
  ruleIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 12,
    textAlign: 'center',
  },
  ruleText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  ruleTextMobile: {
    fontSize: 10,
    lineHeight: 14,
  },

  // Status Section
  statusSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // gray-200
  },
  statusText: {
    fontSize: 11,
    fontWeight: '400',
  },
});

export default PasswordValidation;
