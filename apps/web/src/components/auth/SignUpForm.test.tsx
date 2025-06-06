import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUpForm } from './SignUpForm';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('SignUpForm', () => {
  const mockSignUp = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
    mockSignUp.mockReset();
  });

  it('renders all form fields', () => {
    const { getByText, getByPlaceholderText } = render(<SignUpForm />);

    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByText('Confirm Password')).toBeTruthy();
    expect(getByText('Display Name (Optional)')).toBeTruthy();
    expect(getByText('I agree to the Terms of Service and Privacy Policy')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('shows validation errors for empty required fields', async () => {
    const { getByText } = render(<SignUpForm />);

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows error when passwords do not match', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'DifferentPass123!');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('shows error when terms are not accepted', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'Password123!');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('You must agree to the terms and conditions')).toBeTruthy();
    });
  });

  it('calls signUp with correct data when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'Password123!');
    fireEvent.changeText(getByPlaceholderText('Display Name'), 'Test User');
    fireEvent.press(getByText('I agree to the Terms of Service and Privacy Policy'));

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123!');
    });
  });

  it('shows error message when signup fails', async () => {
    mockSignUp.mockRejectedValue(new Error('Email already exists'));

    const { getByText, getByPlaceholderText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'Password123!');
    fireEvent.press(getByText('I agree to the Terms of Service and Privacy Policy'));

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Email already exists')).toBeTruthy();
    });
  });
});
