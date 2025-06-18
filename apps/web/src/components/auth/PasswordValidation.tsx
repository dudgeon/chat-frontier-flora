import React from 'react';
import { View, Text } from 'react-native';

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
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  showRules = true,
}) => {
  // Calculate which rules are met
  const ruleResults = PASSWORD_RULES.map(rule => ({
    ...rule,
    passed: rule.test(password),
  }));

  if (!password || !showRules) {
    return null;
  }

  return (
    <View className="mt-1 p-4 bg-white border border-gray-200 rounded-lg" testID="password-validation">
      <Text className="text-base font-semibold text-gray-900 mb-2">
        Your password must contain:
      </Text>
      
      <View className="space-y-1">
        {ruleResults.map((rule) => (
          <View
            key={rule.id}
            className={`flex-row items-center gap-x-2 ${
              rule.passed ? 'text-green-600' : 'text-gray-500'
            }`}
            testID={`rule-${rule.id}`}
          >
            <View className="w-5 h-5 shrink-0">
              {rule.passed ? (
                <Text
                  className="text-green-600 text-lg"
                  testID={`rule-${rule.id}-check`}
                >
                  ✓
                </Text>
              ) : (
                <Text
                  className="text-gray-400 text-lg"
                  testID={`rule-${rule.id}-x`}
                >
                  ✕
                </Text>
              )}
            </View>
            <Text
              className={`text-sm flex-1 ${
                rule.passed ? 'text-green-600' : 'text-gray-500'
              }`}
              testID={`rule-${rule.id}-label`}
            >
              {rule.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PasswordValidation;
