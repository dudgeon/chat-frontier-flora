/**
 * SignUpForm Submit Button State Tests
 *
 * This file contains focused tests for submit button state changes with various
 * input combinations to ensure proper user feedback and form validation.
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { SignUpForm } from './SignUpForm';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('SignUpForm - Submit Button State Changes', () => {
  const mockSignUp = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
    mockSignUp.mockReset();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should start with disabled submit button and appropriate text', () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Complete Form to Continue');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit button disabled. Please fix all form errors');
    });
  });

  describe('Progressive Field Completion', () => {
    it('should update button state as each field is completed', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');
      const fullNameInput = screen.getByTestId('full-name');
      const emailInput = screen.getByTestId('email');
      const passwordInput = screen.getByTestId('password');
      const confirmPasswordInput = screen.getByTestId('confirm-password');
      const ageVerification = screen.getByTestId('age-verification');
      const developmentConsent = screen.getByTestId('development-consent');

      // Initially disabled
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Complete Form to Continue');

      // Fill full name - still disabled
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Complete Form to Continue');
      });

      // Fill email - still disabled
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Complete Form to Continue');
      });

      // Fill password - still disabled
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Complete Form to Continue');
      });

      // Fill confirm password - still disabled
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Complete Form to Continue');
      });

      // Check age verification - still disabled
      fireEvent.click(ageVerification);
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Complete Form to Continue');
      });

      // Check development consent - NOW ENABLED!
      fireEvent.click(developmentConsent);
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent('Create Account');
      });
    });
  });

  describe('Invalid Input Combinations', () => {
    it('should disable button when email is invalid', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Fill all fields with valid data except email
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Button should remain disabled due to invalid email
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Fix email - button should become enabled
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should disable button when passwords do not match', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Fill all fields with valid data except password confirmation
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'DifferentPassword!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Button should remain disabled due to password mismatch
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Fix password confirmation - button should become enabled
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should disable button when password is weak', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Fill all fields with valid data except weak password
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'weak' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'weak' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Button should remain disabled due to weak password
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Fix password - button should become enabled
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Checkbox Requirements', () => {
    it('should require both checkboxes to be checked', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Fill all text fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });

      // Check only age verification
      fireEvent.click(screen.getByTestId('age-verification'));
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Uncheck age verification, check development consent
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Check both - should be enabled
      fireEvent.click(screen.getByTestId('age-verification'));
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Dynamic State Changes', () => {
    it('should handle rapid field changes correctly', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');
      const emailInput = screen.getByTestId('email');

      // Fill all fields to make form valid
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Button should be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Make email invalid
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Fix email again
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should handle checkbox toggling correctly', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');
      const ageVerification = screen.getByTestId('age-verification');

      // Fill all text fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('development-consent'));

      // Check age verification - should be enabled
      fireEvent.click(ageVerification);
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Uncheck age verification - should be disabled
      fireEvent.click(ageVerification);
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Check again - should be enabled
      fireEvent.click(ageVerification);
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Button Text and Accessibility', () => {
    it('should show appropriate button text for different states', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Initially shows completion message
      expect(submitButton).toHaveTextContent('Complete Form to Continue');

      // Fill some fields - still shows completion message
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Complete Form to Continue');
      });

      // Complete all fields - shows create account
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Create Account');
      });
    });

    it('should provide appropriate accessibility labels', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Disabled state accessibility
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit button disabled. Please fix all form errors');

      // Fill all fields to enable
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Enabled state accessibility
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        const ariaDisabled = submitButton.getAttribute('aria-disabled');
        expect(ariaDisabled === null || ariaDisabled === 'false').toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty field after being filled', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');
      const fullNameInput = screen.getByTestId('full-name');

      // Fill all fields
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Button should be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Clear full name
      fireEvent.change(fullNameInput, { target: { value: '' } });

      // Button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should handle whitespace-only input', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Fill fields with whitespace-only full name
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: '   ' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Button should remain disabled due to whitespace-only name
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
