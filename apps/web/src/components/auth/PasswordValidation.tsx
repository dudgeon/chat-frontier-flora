import React from 'react';

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
  className?: string;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  showRules = true,
  className = '',
}) => {
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
    strengthColor = 'text-red-600';
    progressColor = 'bg-red-500';
  } else if (strengthScore < 60) {
    strengthLabel = 'Fair';
    strengthColor = 'text-orange-600';
    progressColor = 'bg-orange-500';
  } else if (strengthScore < 80) {
    strengthLabel = 'Good';
    strengthColor = 'text-yellow-600';
    progressColor = 'bg-yellow-500';
  } else {
    strengthLabel = 'Strong';
    strengthColor = 'text-green-600';
    progressColor = 'bg-green-500';
  }

  const allRequiredRulesPassed = requiredRulesPassed === totalRequiredRules;

  if (!password || !showRules) {
    return null;
  }

  return (
    <div className={`mt-3 ${className}`} data-testid="password-validation">
      {/* Password Strength Indicator */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-medium ${strengthColor}`} data-testid="strength-label">
            {strengthLabel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2" data-testid="strength-progress-container">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${strengthScore}%` }}
            data-testid="strength-progress-bar"
          />
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {Math.round(strengthScore)}% strength
        </div>
      </div>

      {/* Password Rules */}
      <div className="flex flex-wrap gap-2 mt-2 mb-1">
        {ruleResults.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center px-2 py-1 rounded bg-gray-50 border border-gray-200"
            style={{ fontSize: 12, minWidth: 0 }}
            data-testid={`rule-${rule.id}`}
          >
            {rule.passed ? (
              <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20" data-testid={`rule-${rule.id}-check`}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20" data-testid={`rule-${rule.id}-x`}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            <span className={rule.passed ? 'text-green-700' : 'text-gray-600'} data-testid={`rule-${rule.id}-label`} style={{ fontSize: 12 }}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>

      {/* Overall Status */}
      {password.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div
            className={`text-sm font-medium ${
              allRequiredRulesPassed ? 'text-green-600' : 'text-gray-600'
            }`}
            data-testid="overall-status"
          >
            {allRequiredRulesPassed ? (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Password meets all requirements</span>
              </div>
            ) : (
              <span>
                {requiredRulesPassed} of {totalRequiredRules} requirements met
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordValidation;
