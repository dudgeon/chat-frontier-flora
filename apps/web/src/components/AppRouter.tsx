import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthFlow } from './auth/AuthFlow';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';
import { ChatPage } from './ChatPage';
import { DebugPage } from '../pages/DebugPage';
import { useAuthNavigation } from '../hooks/useAuthNavigation';

/**
 * Protected Route Component
 * Redirects to root homepage if user is not authenticated
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * Chat Page Wrapper with Profile Menu State
 */
const ChatPageWrapper: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleToggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <ChatPage
      showProfileMenu={showProfileMenu}
      onToggleProfileMenu={handleToggleProfileMenu}
    />
  );
};

// Helper component that runs the navigation hook inside Router context
const NavigationListener: React.FC = () => {
  useAuthNavigation();
  return null;
};

/**
 * Main App Router Component
 * Handles all routing logic for the application
 *
 * Routing Behavior:
 * - Unauthenticated users: All routes redirect to / (homepage with login/signup)
 * - Authenticated users: / redirects to /chat, /chat shows chat page
 */
export const AppRouter: React.FC = () => {
  console.log('🔄 AppRouter rendering');

  return (
    <BrowserRouter>
      {/* Runs navigation side-effects inside Router */}
      <NavigationListener />
      <Routes>
        {/* Homepage - Shows login/signup */}
        <Route path="/" element={<AuthFlow />} />

        {/* Dedicated Login Route - For testing and direct access */}
        <Route path="/login" element={<LoginForm />} />

        {/* Dedicated Signup Route - For testing and direct access */}
        <Route path="/signup" element={<SignUpForm />} />

        {/* Protected Chat Route - Requires authentication */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPageWrapper />
            </ProtectedRoute>
          }
        />

        {/* Debug Page - Always accessible */}
        <Route path="/debug" element={<DebugPage />} />

        {/* Catch all routes - redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
