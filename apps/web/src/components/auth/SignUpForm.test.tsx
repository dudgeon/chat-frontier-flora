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

describe('SignUpForm', () => {
  const mockSignUp = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
    mockSignUp.mockReset();
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<SignUpForm />);

    // Check for field labels
    expect(screen.getByText('Full Name *')).toBeInTheDocument();
    expect(screen.getByText('Email Address *')).toBeInTheDocument();
    expect(screen.getByText('Password *')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password *')).toBeInTheDocument();

    // Check for form inputs using testIds
    expect(screen.getByTestId('full-name')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password')).toBeInTheDocument();

    // Check for checkboxes
    expect(screen.getByTestId('age-verification')).toBeInTheDocument();
    expect(screen.getByTestId('development-consent')).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<SignUpForm />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // The form should show that it's invalid and disabled
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Please fix all form errors')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const confirmPasswordInput = screen.getByTestId('confirm-password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });

    // Wait for validation to process
    await waitFor(() => {
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });
  });

  it('enables submit button when all fields are valid', async () => {
    render(<SignUpForm />);

    const fullNameInput = screen.getByTestId('full-name');
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const confirmPasswordInput = screen.getByTestId('confirm-password');
    const ageVerification = screen.getByTestId('age-verification');
    const developmentConsent = screen.getByTestId('development-consent');

    // Fill in all required fields
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(ageVerification);
    fireEvent.click(developmentConsent);

    // Wait for validation to process
    await waitFor(() => {
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls signUp with correct data when form is valid', async () => {
    render(<SignUpForm />);

    const fullNameInput = screen.getByTestId('full-name');
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const confirmPasswordInput = screen.getByTestId('confirm-password');
    const ageVerification = screen.getByTestId('age-verification');
    const developmentConsent = screen.getByTestId('development-consent');

    // Fill in all required fields
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(ageVerification);
    fireEvent.click(developmentConsent);

    // Wait for form to become valid
    await waitFor(() => {
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

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
  });

  it('shows error message when signup fails', async () => {
    const mockAlert = jest.mocked(Alert.alert);
    mockSignUp.mockRejectedValue(new Error('Email already exists'));

    render(<SignUpForm />);

    const fullNameInput = screen.getByTestId('full-name');
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const confirmPasswordInput = screen.getByTestId('confirm-password');
    const ageVerification = screen.getByTestId('age-verification');
    const developmentConsent = screen.getByTestId('development-consent');

    // Fill in all required fields
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(ageVerification);
    fireEvent.click(developmentConsent);

    // Wait for form to become valid
    await waitFor(() => {
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Email already exists');
    });
  });
});
