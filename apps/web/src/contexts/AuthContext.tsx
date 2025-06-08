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
  // Flag to prevent race condition during signup
  const [isSigningUp, setIsSigningUp] = useState(false);

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
   * @param retryCount - Number of retries for profile loading (default: 0)
   */
  const loadUserProfile = async (userId: string, retryCount: number = 0, authUser?: any) => {
    try {
      console.log(`🔄 Loading profile for user ${userId} (attempt ${retryCount + 1})`);

      // Add timeout to prevent hanging queries
      const queryPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile query timeout')), 2000)
      );

      // ⚠️ CRITICAL QUERY: Must match database schema exactly
      const { data: profile, error: profileError } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any;

      if (profileError) {
        console.error('Profile loading error:', profileError);

        // If profile doesn't exist and we haven't retried much, wait and retry
        if (profileError.code === 'PGRST116' && retryCount < 2) {
          console.log(`Profile not found, retrying in ${(retryCount + 1) * 500}ms... (attempt ${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 500));
          return loadUserProfile(userId, retryCount + 1, authUser);
        }

        console.error('Error loading user profile after retries:', profileError);
        throw profileError;
      }

      // ⚠️ CRITICAL: Use provided authUser or get current user
      let currentAuthUser = authUser;
      if (!currentAuthUser) {
        const { data: { user } } = await supabase.auth.getUser();
        currentAuthUser = user;
      }

      if (!currentAuthUser) {
        throw new Error('No authenticated user found');
      }

      // ⚠️ CRITICAL STATE UPDATE: This triggers UI re-renders
      // Create AuthUser object that extends Supabase User with profile
      const userWithProfile: AuthUser = {
        ...currentAuthUser,
        profile: profile as UserProfile,
      };

      setUser(userWithProfile);
      setError(null);
      setLoading(false);
      console.log('User profile loaded successfully:', userWithProfile.profile);
      console.log('🔄 User state updated, should trigger routing re-render');
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to load user profile'));

      // ⚠️ CRITICAL: Always set loading to false to prevent infinite loading
      setLoading(false);

      // Use provided authUser if available, otherwise try to get session
      if (authUser) {
        console.log('Using provided auth user despite profile error');
        setUser({
          ...authUser,
          profile: null as any,
        } as AuthUser);
      } else {
        try {
          // Add timeout to session check too
          const sessionPromise = supabase.auth.getSession();
          const sessionTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Session check timeout')), 1000)
          );

          const { data: { session } } = await Promise.race([
            sessionPromise,
            sessionTimeout
          ]) as any;

          if (session?.user) {
            console.log('Keeping auth user despite profile error, user can still access app');
            setUser({
              ...session.user,
              profile: null as any,
            } as AuthUser);
          } else {
            setUser(null);
          }
        } catch (sessionErr) {
          console.error('Session check also failed:', sessionErr);
          // If everything fails, just clear the user
          setUser(null);
        }
      }
    }
  };

  /**
   * 🔐 signUp - HYBRID AUTHENTICATION FUNCTION
   *
   * Tries Edge Function first, falls back to improved client-side approach.
   * This ensures authentication works while Edge Function is being set up.
   *
   * @param email - User email address
   * @param password - User password
   * @param fullName - User's full name (PRD requirement)
   * @param role - User role ('primary' or 'child')
   * @param ageVerification - Age verification consent (PRD requirement)
   * @param developmentConsent - Development data usage consent (PRD requirement)
   */
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'primary' | 'child' = 'primary',
    ageVerification: boolean = false,
    developmentConsent: boolean = false
  ) => {
    try {
      setIsSigningUp(true);
      console.log('🔐 Starting signup for:', email);

      // Try Edge Function first
      try {
        console.log('🌐 Attempting Edge Function signup...');
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            fullName,
            ageVerification,
            developmentConsent,
            role,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Edge Function signup successful');

            // Sign in the user with the created credentials
            const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (signInError) throw signInError;
            if (!authUser?.id) throw new Error('No user ID returned from sign in');

            await loadUserProfile(authUser.id, 0, authUser);
            console.log('🎉 Edge Function signup flow completed');
            return;
          }
        }

        console.log('⚠️ Edge Function not available, falling back to client-side approach');
      } catch (edgeError) {
        console.log('⚠️ Edge Function failed, falling back to client-side approach:', edgeError);
      }

      // Fallback: Improved client-side approach
      console.log('🔄 Using improved client-side signup...');

      // Create auth user
      console.log('📝 About to create auth user...');
      const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_role: role,
          }
        }
      });

      console.log('📝 Auth signup response received');
      if (authError) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }
      if (!authUser?.id) {
        console.error('❌ No user ID in response');
        throw new Error('No user ID returned from signup');
      }

      console.log('✅ Auth user created:', authUser.id);

      // Small delay to ensure auth user is fully committed to database
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create profile with all PRD fields
      console.log('📝 About to create user profile...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authUser.id,
          full_name: fullName,
          user_role: role,
          age_verification: ageVerification,
          development_consent: developmentConsent,
          consent_timestamp: new Date().toISOString(),
        });

      console.log('📝 Profile creation response received');
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        throw profileError;
      }

      console.log('✅ Profile created successfully');

            // Load profile to complete registration
      console.log('📝 About to load user profile...');
      await loadUserProfile(authUser.id, 0, authUser);
      console.log('🎉 Client-side signup flow completed successfully');

      // Navigate to chat page after successful signup
      console.log('🔄 Navigating to /chat after successful signup');
      // Use a small delay to ensure state updates are processed
      setTimeout(() => {
        window.location.href = '/chat';
      }, 100);

    } catch (err) {
      console.error('❌ Error during sign up:', err);
      throw err;
    } finally {
      setIsSigningUp(false);
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

      await loadUserProfile(authUser.id, 0, authUser);
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
        loadUserProfile(session.user.id, 0, session.user);
      } else {
        setLoading(false);
      }
    });

    // ⚠️ CRITICAL: Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        // Skip profile loading during signup to prevent race conditions
        if (isSigningUp) {
          console.log('🔄 Skipping profile loading during signup process');
          return;
        }

        if (session?.user) {
          console.log('🔄 Loading profile after auth state change');
          try {
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile loading timeout')), 10000)
            );

            await Promise.race([
              loadUserProfile(session.user.id, 0, session.user),
              timeoutPromise
            ]);
          } catch (error) {
            console.error('Profile loading failed in auth state change:', error);

            // Even if profile loading fails, set a minimal user so app works
            setUser({
              ...session.user,
              profile: null as any,
            } as AuthUser);
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // ⚠️ CRITICAL: Cleanup subscription to prevent memory leaks
    return () => subscription.unsubscribe();
  }, [isSigningUp]); // Include isSigningUp to prevent race conditions during signup

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

  // Debug log when user state changes
  React.useEffect(() => {
    console.log('🔄 AuthContext user state changed:', user ? 'authenticated' : 'not authenticated');
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 🪝 useAuth Hook
 *
 * Custom hook to access authentication context.
 * Provides type-safe access to auth state and methods.
 *
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
