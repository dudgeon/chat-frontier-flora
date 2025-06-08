import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PasswordValidation, PASSWORD_RULES } from './PasswordValidation';

describe('PasswordValidation Component', () => {

  describe('Basic Rendering', () => {
    it('should not render when password is empty', () => {
      const { queryByTestId } = render(
        <PasswordValidation password="" showRules={true} />
      );

      expect(queryByTestId('password-validation')).toBeNull();
    });

    it('should not render when showRules is false', () => {
      const { queryByTestId } = render(
        <PasswordValidation password="test123" showRules={false} />
      );

      expect(queryByTestId('password-validation')).toBeNull();
    });

    it('should render when password is provided and showRules is true', () => {
      const { getByTestId } = render(
        <PasswordValidation password="test123" showRules={true} />
      );

      expect(getByTestId('password-validation')).toBeTruthy();
    });
  });

  describe('Password Strength Calculation', () => {
    it('should show "Weak" for passwords meeting 0-1 requirements', () => {
      const { getByTestId } = render(
        <PasswordValidation password="a" showRules={true} />
      );

      expect(getByTestId('strength-label')).toHaveTextContent('Weak');
    });

    it('should show "Fair" for passwords meeting 2-3 requirements', () => {
      const { getByTestId } = render(
        <PasswordValidation password="Abc123" showRules={true} />
      );

      expect(getByTestId('strength-label')).toHaveTextContent('Fair');
    });

    it('should show "Good" for passwords meeting 4 requirements', () => {
      const { getByTestId } = render(
        <PasswordValidation password="Abc123!" showRules={true} />
      );

      expect(getByTestId('strength-label')).toHaveTextContent('Good');
    });

    it('should show "Strong" for passwords meeting all requirements', () => {
      const { getByTestId } = render(
        <PasswordValidation password="StrongPass123!" showRules={true} />
      );

      expect(getByTestId('strength-label')).toHaveTextContent('Strong');
    });
  });

  describe('Password Rules Validation', () => {
    it('should validate minimum length requirement', () => {
      const { getByTestId } = render(
        <PasswordValidation password="short" showRules={true} />
      );

      expect(getByTestId('rule-minLength-x')).toBeTruthy();
      expect(getByTestId('rule-minLength-label')).toHaveTextContent('At least 8 characters');
    });

    it('should validate uppercase letter requirement', () => {
      const { getByTestId } = render(
        <PasswordValidation password="lowercase123!" showRules={true} />
      );

      expect(getByTestId('rule-hasUppercase-x')).toBeTruthy();
      expect(getByTestId('rule-hasUppercase-label')).toHaveTextContent('At least one uppercase letter');
    });

    it('should validate lowercase letter requirement', () => {
      const { getByTestId } = render(
        <PasswordValidation password="UPPERCASE123!" showRules={true} />
      );

      expect(getByTestId('rule-hasLowercase-x')).toBeTruthy();
      expect(getByTestId('rule-hasLowercase-label')).toHaveTextContent('At least one lowercase letter');
    });

    it('should validate number requirement', () => {
      const { getByTestId } = render(
        <PasswordValidation password="NoNumbers!" showRules={true} />
      );

      expect(getByTestId('rule-hasNumber-x')).toBeTruthy();
      expect(getByTestId('rule-hasNumber-label')).toHaveTextContent('At least one number');
    });

    it('should validate special character requirement', () => {
      const { getByTestId } = render(
        <PasswordValidation password="NoSpecialChars123" showRules={true} />
      );

      expect(getByTestId('rule-hasSpecialChar-x')).toBeTruthy();
      expect(getByTestId('rule-hasSpecialChar-label')).toHaveTextContent('At least one special character (!@#$%^&*)');
    });

    it('should show checkmarks for satisfied requirements', () => {
      const { getByTestId } = render(
        <PasswordValidation password="ValidPassword123!" showRules={true} />
      );

      // All requirements should be satisfied
      expect(getByTestId('rule-minLength-check')).toBeTruthy();
      expect(getByTestId('rule-hasUppercase-check')).toBeTruthy();
      expect(getByTestId('rule-hasLowercase-check')).toBeTruthy();
      expect(getByTestId('rule-hasNumber-check')).toBeTruthy();
      expect(getByTestId('rule-hasSpecialChar-check')).toBeTruthy();
    });
  });

  describe('Overall Status', () => {
    it('should show partial completion status', () => {
      const { getByTestId } = render(
        <PasswordValidation password="Partial123" showRules={true} />
      );

      expect(getByTestId('overall-status')).toHaveTextContent(/\d+ of \d+ requirements met/);
    });

    it('should show all requirements met status', () => {
      const { getByTestId } = render(
        <PasswordValidation password="CompletePassword123!" showRules={true} />
      );

      expect(getByTestId('overall-status')).toHaveTextContent('✓ All requirements met');
    });
  });

  describe('Basic Accessibility', () => {
    it('should have proper test IDs for accessibility', () => {
      const { getByTestId } = render(
        <PasswordValidation password="test123" showRules={true} />
      );

      expect(getByTestId('password-validation')).toBeTruthy();
      expect(getByTestId('strength-progress-container')).toBeTruthy();
      expect(getByTestId('overall-status')).toBeTruthy();
    });
  });
});
