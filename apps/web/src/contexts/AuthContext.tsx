/**
 * 🔐 AUTHENTICATION CONTEXT - CRITICAL COMPONENT
 *
 * ⚠️ WARNING: This file controls the entire authentication system.
 * DO NOT MODIFY without reading AUTHENTICATION_FLOW_DOCUMENTATION.md
 *
 * This context manages:
 * - User authentication state
 * - Session persistence
 * - Profile management
 * - Role-based access control
 *
 * CRITICAL DEPENDENCIES:
 * - Supabase Auth service
 * - user_profiles database table
 * - RLS policies for security
 * - AuthContextType interface
 *
 * REGRESSION RISKS:
 * - Changing signUp() signature breaks SignUpForm
 * - Modifying session logic breaks persistence
 * - Altering profile loading breaks user state
 * - Breaking auth listeners causes session issues
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthContextType, AuthUser, UserProfile } from '@chat-frontier-flora/shared';
import { supabase } from '../lib/supabase';

// ⚠️ CRITICAL: Context must be nullable for proper error handling
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 🔐 AuthProvider Component
 *
 * CRITICAL FUNCTIONALITY:
 * 1. Manages global authentication state
 * 2. Handles session persistence across app restarts
 * 3. Provides auth methods to entire app
 * 4. Loads user profiles from database
 *
 * ⚠️ DO NOT MODIFY without understanding all dependencies
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ⚠️ CRITICAL STATE: These control entire app authentication
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 🔄 loadUserProfile - CRITICAL FUNCTION
   *
   * Loads user profile from database and updates context state.
   * This function is called after every auth operation.
   *
   * ⚠️ BREAKING CHANGES RISK:
   * - Changing the query breaks profile loading
   * - Modifying error handling breaks user experience
   * - Altering state updates breaks UI updates
   *
   * @param userId - Supabase auth user ID (must match user_profiles.id)
   */
  const loadUserProfile = async (userId: string) => {
    try {
      // ⚠️ CRITICAL QUERY: Must match database schema exactly
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading user profile:', profileError);
        throw profileError;
      }

      // ⚠️ CRITICAL: Get auth user for complete user object
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        throw new Error('No authenticated user found');
      }

      // ⚠️ CRITICAL STATE UPDATE: This triggers UI re-renders
      // Create AuthUser object that extends Supabase User with profile
      const userWithProfile: AuthUser = {
        ...authUser,
        profile: profile as UserProfile,
      };

      setUser(userWithProfile);
      setError(null);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to load user profile'));
      setUser(null);
    }
  };

  /**
   * 🔐 signUp - CRITICAL AUTHENTICATION FUNCTION
   *
   * Creates new user account with Supabase Auth and user profile.
   * This is the main registration function used by SignUpForm.
   *
   * ⚠️ BREAKING CHANGES RISK:
   * - Changing function signature breaks SignUpForm component
   * - Modifying profile creation breaks user data
   * - Altering error handling breaks form feedback
   *
   * PROCESS:
   * 1. Create auth user with Supabase
   * 2. Create user profile in database (manual + trigger backup)
   * 3. Load profile into context state
   *
   * @param email - User email address
   * @param password - User password (hashed by Supabase)
   * @param displayName - Optional display name
   * @param role - User role ('primary' or 'child')
   */
  const signUp = async (email: string, password: string, displayName?: string, role: 'primary' | 'child' = 'primary') => {
    try {
      // ⚠️ CRITICAL: Supabase auth user creation
      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || 'User',
            user_role: role,
          }
        }
      });

      if (error) throw error;
      if (!authUser?.id) throw new Error('No user ID returned from signup');

      // ⚠️ CRITICAL: Manual profile creation (backup for trigger)
      // This ensures profile exists even if database trigger fails
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authUser.id,
            display_name: displayName || 'User',
            user_role: role,
          });

        if (profileError) {
          console.warn('Profile creation error (might be handled by trigger):', profileError);
        }
      } catch (profileErr) {
        console.warn('Profile creation failed (might be handled by trigger):', profileErr);
      }

      // ⚠️ CRITICAL: Load profile to complete registration
      await loadUserProfile(authUser.id);
    } catch (err) {
      console.error('Error during sign up:', err);
      throw err;
    }
  };

  /**
   * 🔑 signIn - User Login Function
   *
   * Authenticates existing user and loads their profile.
   *
   * @param email - User email
   * @param password - User password
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!authUser?.id) throw new Error('No user ID returned from sign in');

      await loadUserProfile(authUser.id);
    } catch (err) {
      console.error('Error during sign in:', err);
      throw err;
    }
  };

  /**
   * 🚪 signOut - User Logout Function
   *
   * Signs out user and clears all state.
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error during sign out:', err);
      throw err;
    }
  };

  /**
   * ✏️ updateProfile - Profile Update Function
   *
   * Updates user profile in database and refreshes context state.
   *
   * @param profile - Partial profile data to update
   */
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user?.id) throw new Error('No authenticated user');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;
      await loadUserProfile(user.id);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  /**
   * 👶 createChildAccount - Child Account Creation
   *
   * Creates child account linked to primary user.
   * Only primary users can create child accounts.
   *
   * @param email - Child email
   * @param password - Child password
   * @param displayName - Child display name
   */
  const createChildAccount = async (email: string, password: string, displayName: string) => {
    if (user?.profile?.user_role !== 'primary') {
      throw new Error('Only primary users can create child accounts');
    }

    await signUp(email, password, displayName, 'child');
  };

  // 🔍 Role checking utility functions
  const isPrimaryUser = () => user?.profile?.user_role === 'primary';
  const isChildUser = () => user?.profile?.user_role === 'child';

  /**
   * 🔄 SESSION MANAGEMENT - CRITICAL EFFECT
   *
   * This effect handles:
   * 1. Initial session check on app start
   * 2. Auth state changes (login/logout)
   * 3. Session persistence across browser restarts
   *
   * ⚠️ BREAKING CHANGES RISK:
   * - Modifying this effect breaks session persistence
   * - Changing auth listeners breaks real-time updates
   * - Altering loading states breaks UI
   */
  useEffect(() => {
    // ⚠️ CRITICAL: Check for existing session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // ⚠️ CRITICAL: Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    // ⚠️ CRITICAL: Cleanup subscription to prevent memory leaks
    return () => subscription.unsubscribe();
  }, []);

  // ⚠️ CRITICAL: Context value object - changing this breaks all consumers
  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createChildAccount,
    isPrimaryUser,
    isChildUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
