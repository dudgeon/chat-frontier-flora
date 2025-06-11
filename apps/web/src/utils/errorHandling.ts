/**
 * Error Handling Utilities
 *
 * Comprehensive error parsing and user-friendly message generation
 * for authentication and other application errors.
 */

export interface ParsedError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  technical?: string; // For development/debugging
}

/**
 * Parse authentication errors from Supabase and other sources
 */
export function parseAuthError(error: any): ParsedError {
  // Handle null/undefined errors
  if (!error) {
    return {
      title: 'Unknown Error',
      message: 'An unexpected error occurred. Please try again.',
      type: 'error'
    };
  }

  const errorMessage = error.message || error.toString() || 'Unknown error';
  const errorCode = error.code || error.status;
  const technical = `${error.name || 'Error'}: ${errorMessage}`;

  // Supabase Auth API Errors
  if (error.name === 'AuthApiError' || errorMessage.includes('AuthApiError')) {
    return parseSupabaseAuthError(errorMessage, technical);
  }

  // Network errors
  if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
    return {
      title: 'Service Unavailable',
      message: 'The authentication service is temporarily unavailable. Please try again in a few moments.',
      type: 'warning',
      technical
    };
  }

  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
    return {
      title: 'Network Error',
      message: 'Please check your internet connection and try again.',
      type: 'warning',
      technical
    };
  }

  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return {
      title: 'Invalid Information',
      message: 'Please check your information and try again.',
      type: 'error',
      technical
    };
  }

  // Generic fallback
  return {
    title: 'Error',
    message: `Something went wrong: ${errorMessage}`,
    type: 'error',
    technical
  };
}

/**
 * Parse specific Supabase authentication errors
 */
function parseSupabaseAuthError(errorMessage: string, technical: string): ParsedError {
  const lowerMessage = errorMessage.toLowerCase();

  // User already exists
  if (lowerMessage.includes('user already registered') || lowerMessage.includes('already registered')) {
    return {
      title: 'Account Already Exists',
      message: 'An account with this email address already exists. Try signing in instead, or use a different email address.',
      type: 'info',
      technical
    };
  }

  // Invalid email/password during signin
  if (lowerMessage.includes('invalid login credentials') || lowerMessage.includes('invalid credentials')) {
    return {
      title: 'Invalid Credentials',
      message: 'The email or password you entered is incorrect. Please check your information and try again.',
      type: 'error',
      technical
    };
  }

  // Email not confirmed
  if (lowerMessage.includes('email not confirmed') || lowerMessage.includes('not confirmed')) {
    return {
      title: 'Email Not Verified',
      message: 'Please check your email and click the verification link before signing in.',
      type: 'warning',
      technical
    };
  }

  // Too many requests
  if (lowerMessage.includes('too many requests') || lowerMessage.includes('rate limit')) {
    return {
      title: 'Too Many Attempts',
      message: 'Too many sign-in attempts. Please wait a few minutes before trying again.',
      type: 'warning',
      technical
    };
  }

  // Weak password
  if (lowerMessage.includes('password') && (lowerMessage.includes('weak') || lowerMessage.includes('short'))) {
    return {
      title: 'Weak Password',
      message: 'Your password must be at least 8 characters long and include a mix of letters, numbers, and special characters.',
      type: 'error',
      technical
    };
  }

  // Invalid email format
  if (lowerMessage.includes('invalid email') || lowerMessage.includes('email format')) {
    return {
      title: 'Invalid Email',
      message: 'Please enter a valid email address.',
      type: 'error',
      technical
    };
  }

  // Signup disabled
  if (lowerMessage.includes('signup') && lowerMessage.includes('disabled')) {
    return {
      title: 'Registration Unavailable',
      message: 'New account registration is temporarily disabled. Please try again later.',
      type: 'warning',
      technical
    };
  }

  // Session expired
  if (lowerMessage.includes('session') && (lowerMessage.includes('expired') || lowerMessage.includes('invalid'))) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired. Please sign in again.',
      type: 'info',
      technical
    };
  }

  // Generic Auth API error
  return {
    title: 'Authentication Error',
    message: 'There was a problem with authentication. Please try again or contact support if the problem persists.',
    type: 'error',
    technical
  };
}

/**
 * Parse form validation errors
 */
export function parseValidationError(error: any): ParsedError {
  const errorMessage = error.message || error.toString() || 'Validation failed';

  return {
    title: 'Form Validation Error',
    message: `Please fix the following issue: ${errorMessage}`,
    type: 'error',
    technical: errorMessage
  };
}

/**
 * Create a success message
 */
export function createSuccessMessage(message: string): ParsedError {
  return {
    title: 'Success',
    message,
    type: 'info'
  };
}
