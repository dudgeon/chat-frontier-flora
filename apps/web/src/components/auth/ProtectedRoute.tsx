/**
 * 🛡️ PROTECTED ROUTE WRAPPER - ROLE-BASED ACCESS CONTROL
 *
 * This component provides authentication and role-based access control
 * for routes in the application. It ensures only authorized users can
 * access protected content.
 *
 * FEATURES:
 * - Authentication requirement checking
 * - Role-based access control (primary vs child users)
 * - Loading states during auth checks
 * - Automatic redirects for unauthorized access
 * - Fallback components for different access scenarios
 *
 * USAGE EXAMPLES:
 *
 * // Require any authenticated user
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * // Require primary user only
 * <ProtectedRoute requireRole="primary">
 *   <AdminPanel />
 * </ProtectedRoute>
 *
 * // Require child user only
 * <ProtectedRoute requireRole="child">
 *   <ChildContent />
 * </ProtectedRoute>
 *
 * // Custom fallback for unauthorized access
 * <ProtectedRoute
 *   requireRole="primary"
 *   fallback={<CustomUnauthorized />}
 * >
 *   <PrimaryUserContent />
 * </ProtectedRoute>
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '@chat-frontier-flora/shared';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: UserRole;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  unauthorizedComponent?: ReactNode;
}

/**
 * 🛡️ ProtectedRoute Component
 *
 * Wraps content that requires authentication and/or specific user roles.
 * Handles loading states and provides fallbacks for unauthorized access.
 *
 * @param children - Content to protect
 * @param requireRole - Optional specific role requirement ('primary' | 'child')
 * @param fallback - Custom component to show for unauthorized access
 * @param loadingComponent - Custom loading component
 * @param unauthorizedComponent - Custom unauthorized component
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRole,
  fallback,
  loadingComponent,
  unauthorizedComponent,
}) => {
  const { user, loading, isPrimaryUser, isChildUser } = useAuth();

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="protected-route-loading">
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="protected-route-unauthenticated">
        {fallback || unauthorizedComponent || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to access this content.
              </p>
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Check role-based access if required
  if (requireRole) {
    const hasRequiredRole =
      (requireRole === 'primary' && isPrimaryUser()) ||
      (requireRole === 'child' && isChildUser());

    if (!hasRequiredRole) {
      return (
        <div className="protected-route-unauthorized">
          {fallback || unauthorizedComponent || (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Access Restricted
                </h2>
                <p className="text-gray-600 mb-6">
                  You don't have permission to access this content.
                  {requireRole === 'primary' && (
                    <span className="block mt-2">
                      This area is restricted to primary account holders.
                    </span>
                  )}
                  {requireRole === 'child' && (
                    <span className="block mt-2">
                      This area is restricted to child accounts.
                    </span>
                  )}
                </p>
                <a
                  href="/"
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          )}
        </div>
      );
    }
  }

  // User is authenticated and has required role - render protected content
  return <div className="protected-route-content">{children}</div>;
};

/**
 * 🛡️ Higher-Order Component for Route Protection
 *
 * Alternative API for protecting components with authentication/role requirements.
 * Useful for wrapping existing components without changing their structure.
 *
 * @param Component - Component to protect
 * @param options - Protection options
 */
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  const ProtectedComponent: React.FC<P> = (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`;

  return ProtectedComponent;
};

/**
 * 🛡️ Role-Specific Route Helpers
 *
 * Convenience components for common role-based protection scenarios.
 */

// Require primary user role
export const PrimaryUserRoute: React.FC<Omit<ProtectedRouteProps, 'requireRole'>> = (props) => (
  <ProtectedRoute {...props} requireRole="primary" />
);

// Require child user role
export const ChildUserRoute: React.FC<Omit<ProtectedRouteProps, 'requireRole'>> = (props) => (
  <ProtectedRoute {...props} requireRole="child" />
);

// Require any authenticated user (no specific role)
export const AuthenticatedRoute: React.FC<Omit<ProtectedRouteProps, 'requireRole'>> = (props) => (
  <ProtectedRoute {...props} />
);
