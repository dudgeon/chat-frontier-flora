/**
 * SignUpForm Integration Tests - Complete Form Validation Flow
 *
 * This file contains comprehensive integration tests for the complete form validation flow
 * with all PRD requirements including real-time validation, submit button states, and
 * all required fields.
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Alert } from 'react-native';
import { SignUpForm } from './SignUpForm';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

describe('SignUpForm - Complete Form Validation Flow Integration Tests', () => {
  const mockSignUp = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
    mockSignUp.mockReset();
    jest.clearAllMocks();
  });

  describe('Initial Form State', () => {
    it('should start with all fields empty and submit button disabled', () => {
      render(<SignUpForm />);

      // Check all fields are empty
      expect(screen.getByTestId('full-name')).toHaveValue('');
      expect(screen.getByTestId('email')).toHaveValue('');
      expect(screen.getByTestId('password')).toHaveValue('');
      expect(screen.getByTestId('confirm-password')).toHaveValue('');

      // Check checkboxes are unchecked
      expect(screen.getByTestId('age-verification')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('development-consent')).toHaveAttribute('aria-checked', 'false');

      // Check submit button is disabled
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Complete Form to Continue');
    });

    it('should show form completion status in debug mode', () => {
      render(<SignUpForm />);

      // Check debug information is displayed
      expect(screen.getByText('Form Valid: No')).toBeInTheDocument();
      expect(screen.getByText('Form Completed: No')).toBeInTheDocument();
      expect(screen.getByText(/Completion: 0\/6 \(0%\)/)).toBeInTheDocument();
    });
  });

  describe('Progressive Form Completion', () => {
    it('should update completion status as fields are filled', async () => {
      render(<SignUpForm />);

      const fullNameInput = screen.getByTestId('full-name');
      const emailInput = screen.getByTestId('email');
      const passwordInput = screen.getByTestId('password');

      // Fill full name
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 1\/6/)).toBeInTheDocument();
      });

      // Fill email
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 2\/6/)).toBeInTheDocument();
      });

      // Fill password
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 3\/6/)).toBeInTheDocument();
      });
    });

    it('should show password validation feedback in real-time', async () => {
      render(<SignUpForm />);

      const passwordInput = screen.getByTestId('password');

      // Start typing password
      fireEvent.change(passwordInput, { target: { value: 'pass' } });

      // Password validation should appear
      await waitFor(() => {
        expect(screen.getByTestId('password-validation')).toBeInTheDocument();
        expect(screen.getByTestId('strength-label')).toHaveTextContent('Weak');
      });

      // Complete strong password
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

      await waitFor(() => {
        expect(screen.getByTestId('strength-label')).toHaveTextContent('Strong');
      });
    });
  });

  describe('Field Validation Rules', () => {
        it('should validate full name requirement during form submission', async () => {
      render(<SignUpForm />);

      const fullNameInput = screen.getByTestId('full-name');
      const submitButton = screen.getByTestId('submit-button');

      // Try to submit form without filling full name
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Complete Form to Continue');

      // Fill other fields but leave full name empty
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Submit button should still be disabled because full name is empty
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Now fill full name
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      // Submit button should now be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent('Create Account');
      });
    });

    it('should validate email format', async () => {
      render(<SignUpForm />);

      const emailInput = screen.getByTestId('email');

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });

      // Enter valid email
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      render(<SignUpForm />);

      const passwordInput = screen.getByTestId('password');
      const confirmPasswordInput = screen.getByTestId('confirm-password');

      // Enter different passwords
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      // Fix password confirmation
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });
    });
  });

  describe('Checkbox Requirements', () => {
    it('should require age verification checkbox', async () => {
      render(<SignUpForm />);

      // Fill all other fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('development-consent'));

      // Submit button should still be disabled
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeDisabled();
      });

      // Check age verification
      fireEvent.click(screen.getByTestId('age-verification'));

      // Submit button should now be enabled
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should require development consent checkbox', async () => {
      render(<SignUpForm />);

      // Fill all other fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));

      // Submit button should still be disabled
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeDisabled();
      });

      // Check development consent
      fireEvent.click(screen.getByTestId('development-consent'));

      // Submit button should now be enabled
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Submit Button State Management', () => {
    it('should show different button text based on form state', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Initially disabled with completion message
      expect(submitButton).toHaveTextContent('Complete Form to Continue');
      expect(submitButton).toBeDisabled();

      // Fill all fields to make form valid
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Should show ready to submit
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Create Account');
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should provide accessibility labels for submit button states', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByTestId('submit-button');

      // Check disabled state accessibility
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit button disabled. Please fix all form errors');

      // Fill form to enable button
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Check enabled state accessibility
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        // When enabled, aria-disabled might be removed or set to false
        const ariaDisabled = submitButton.getAttribute('aria-disabled');
        expect(ariaDisabled === null || ariaDisabled === 'false').toBe(true);
      });
    });
  });

  describe('Complete Form Submission Flow', () => {
    it('should successfully submit form with all valid data', async () => {
      mockSignUp.mockResolvedValue(undefined);
      const mockAlert = jest.mocked(Alert.alert);

      render(<SignUpForm />);

      // Fill all required fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Wait for form to become valid
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      // Verify signUp was called with correct parameters
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          'test@example.com',
          'Password123!',
          'John Doe',
          'primary',
          true,
          true
        );
      });

      // Verify success alert
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Success', 'Account created successfully!');
      });
    });

    it('should handle form submission errors gracefully', async () => {
      mockSignUp.mockRejectedValue(new Error('Email already exists'));
      const mockAlert = jest.mocked(Alert.alert);

      render(<SignUpForm />);

      // Fill all required fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByTestId('age-verification'));
      fireEvent.click(screen.getByTestId('development-consent'));

      // Wait for form to become valid
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      // Verify error alert
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Error', 'Email already exists');
      });
    });
  });

  describe('Form Reset and State Management', () => {
    it('should maintain form state during validation', async () => {
      render(<SignUpForm />);

      // Fill some fields
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });

      // Trigger validation on another field
      fireEvent.focus(screen.getByTestId('password'));
      fireEvent.blur(screen.getByTestId('password'));

      // Previously filled fields should maintain their values
      expect(screen.getByTestId('full-name')).toHaveValue('John Doe');
      expect(screen.getByTestId('email')).toHaveValue('test@example.com');
    });

    it('should update completion percentage correctly', async () => {
      render(<SignUpForm />);

      // Fill fields progressively and check completion
      fireEvent.change(screen.getByTestId('full-name'), { target: { value: 'John Doe' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 1\/6 \(17%\)/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 2\/6 \(33%\)/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 3\/6 \(50%\)/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
      await waitFor(() => {
        expect(screen.getByText(/Completion: 4\/6 \(67%\)/)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('age-verification'));
      await waitFor(() => {
        expect(screen.getByText(/Completion: 5\/6 \(83%\)/)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('development-consent'));
      await waitFor(() => {
        expect(screen.getByText(/Completion: 6\/6 \(100%\)/)).toBeInTheDocument();
        expect(screen.getByText('Form Completed: Yes')).toBeInTheDocument();
      });
    });
  });
});
