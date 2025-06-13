import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook that handles navigation based on authentication state
 *
 * This hook ensures users are redirected appropriately:
 * - Authenticated users on root (/) get redirected to /chat
 * - Unauthenticated users on protected routes get redirected to /
 */
export const useAuthNavigation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't navigate while loading
    if (loading) return;

    console.log('🔍 useAuthNavigation - user:', user ? 'authenticated' : 'not authenticated');
    console.log('🔍 useAuthNavigation - current path:', location.pathname);

    // If user is authenticated and on root, redirect based on role
    if (user && location.pathname === '/') {
      const role = user.profile?.user_role;
      let targetPath = '/chat';

      // 🛣️ Role-based destination mapping
      switch (role) {
        case 'primary':
          targetPath = '/chat';
          break;
        case 'child':
          targetPath = '/chat';
          break;
        default:
          targetPath = '/chat';
      }

      console.log(`✅ Authenticated user (${role ?? 'unknown'}) on root, redirecting to ${targetPath}`);
      navigate(targetPath, { replace: true });
    }

    // If user is not authenticated and on protected route, redirect to root
    if (!user && location.pathname === '/chat') {
      console.log('❌ Unauthenticated user on protected route, redirecting to /');
      navigate('/', { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);
};
