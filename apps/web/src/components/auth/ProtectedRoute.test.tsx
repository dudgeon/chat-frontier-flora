/**
 * 🧪 PROTECTED ROUTE TESTS
 *
 * Comprehensive test suite for ProtectedRoute component covering:
 * - Authentication state handling
 * - Role-based access control
 * - Loading states
 * - Fallback components
 * - Higher-order component functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute, withProtectedRoute, PrimaryUserRoute, ChildUserRoute, AuthenticatedRoute } from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { AuthUser, UserProfile } from '@chat-frontier-flora/shared';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Test component for protected content
const TestComponent: React.FC = () => <div>Protected Content</div>;

// Mock user profiles
const mockPrimaryUser: AuthUser = {
  id: 'user-1',
  email: 'primary@example.com',
  profile: {
    id: 'user-1',
    user_role: 'primary',
    full_name: 'Primary User',
    display_name: 'Primary User',
    parent_user_id: null,
    development_consent: true,
    age_verification: true,
    consent_timestamp: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  } as UserProfile,
} as AuthUser;

const mockChildUser: AuthUser = {
  id: 'user-2',
  email: 'child@example.com',
  profile: {
    id: 'user-2',
    user_role: 'child',
    full_name: 'Child User',
    display_name: 'Child User',
    parent_user_id: 'user-1',
    development_consent: false,
    age_verification: false,
    consent_timestamp: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  } as UserProfile,
} as AuthUser;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => false),
      });

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Setting up your account...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show custom loading component when provided', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => false),
      });

      const CustomLoading = () => <div>Custom Loading...</div>;

      render(
        <ProtectedRoute loadingComponent={<CustomLoading />}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Unauthenticated State', () => {
    it('should show authentication required message when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => false),
      });

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
      expect(screen.getByText('You need to be signed in to access this content.')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show custom unauthorized component when provided', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => false),
      });

      const CustomUnauthorized = () => <div>Custom Unauthorized</div>;

      render(
        <ProtectedRoute unauthorizedComponent={<CustomUnauthorized />}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Custom Unauthorized')).toBeInTheDocument();
      expect(screen.queryByText('Authentication Required')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    it('should render protected content when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockPrimaryUser,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => true),
        isChildUser: jest.fn(() => false),
      });

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Authentication Required')).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow primary user to access primary-only content', () => {
      mockUseAuth.mockReturnValue({
        user: mockPrimaryUser,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => true),
        isChildUser: jest.fn(() => false),
      });

      render(
        <ProtectedRoute requireRole="primary">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should deny child user access to primary-only content', () => {
      mockUseAuth.mockReturnValue({
        user: mockChildUser,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => true),
      });

      render(
        <ProtectedRoute requireRole="primary">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('This area is restricted to primary account holders.')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should allow child user to access child-only content', () => {
      mockUseAuth.mockReturnValue({
        user: mockChildUser,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => true),
      });

      render(
        <ProtectedRoute requireRole="child">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should deny primary user access to child-only content', () => {
      mockUseAuth.mockReturnValue({
        user: mockPrimaryUser,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => true),
        isChildUser: jest.fn(() => false),
      });

      render(
        <ProtectedRoute requireRole="child">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('This area is restricted to child accounts.')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Custom Fallback Components', () => {
    it('should show custom fallback for role restriction', () => {
      mockUseAuth.mockReturnValue({
        user: mockChildUser,
        loading: false,
        error: null,
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        createChildAccount: jest.fn(),
        isPrimaryUser: jest.fn(() => false),
        isChildUser: jest.fn(() => true),
      });

      const CustomFallback = () => <div>Custom Access Denied</div>;

      render(
        <ProtectedRoute requireRole="primary" fallback={<CustomFallback />}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Custom Access Denied')).toBeInTheDocument();
      expect(screen.queryByText('Access Restricted')).not.toBeInTheDocument();
    });
  });
});

describe('Higher-Order Component', () => {
  it('should wrap component with protection', () => {
    mockUseAuth.mockReturnValue({
      user: mockPrimaryUser,
      loading: false,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
      createChildAccount: jest.fn(),
      isPrimaryUser: jest.fn(() => true),
      isChildUser: jest.fn(() => false),
    });

    const ProtectedTestComponent = withProtectedRoute(TestComponent, { requireRole: 'primary' });

    render(<ProtectedTestComponent />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should deny access through HOC when role requirement not met', () => {
    mockUseAuth.mockReturnValue({
      user: mockChildUser,
      loading: false,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
      createChildAccount: jest.fn(),
      isPrimaryUser: jest.fn(() => false),
      isChildUser: jest.fn(() => true),
    });

    const ProtectedTestComponent = withProtectedRoute(TestComponent, { requireRole: 'primary' });

    render(<ProtectedTestComponent />);

    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

describe('Role-Specific Route Helpers', () => {
  it('should work with PrimaryUserRoute', () => {
    mockUseAuth.mockReturnValue({
      user: mockPrimaryUser,
      loading: false,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
      createChildAccount: jest.fn(),
      isPrimaryUser: jest.fn(() => true),
      isChildUser: jest.fn(() => false),
    });

    render(
      <PrimaryUserRoute>
        <TestComponent />
      </PrimaryUserRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should work with ChildUserRoute', () => {
    mockUseAuth.mockReturnValue({
      user: mockChildUser,
      loading: false,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
      createChildAccount: jest.fn(),
      isPrimaryUser: jest.fn(() => false),
      isChildUser: jest.fn(() => true),
    });

    render(
      <ChildUserRoute>
        <TestComponent />
      </ChildUserRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should work with AuthenticatedRoute', () => {
    mockUseAuth.mockReturnValue({
      user: mockPrimaryUser,
      loading: false,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
      createChildAccount: jest.fn(),
      isPrimaryUser: jest.fn(() => true),
      isChildUser: jest.fn(() => false),
    });

    render(
      <AuthenticatedRoute>
        <TestComponent />
      </AuthenticatedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
