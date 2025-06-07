import React, { createContext, useState, useEffect } from 'react';
import { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthContextType, AuthUser, UserProfile } from '@chat-frontier-flora/shared';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) throw new Error('No authenticated user');

      setUser({
        ...session.data.session.user,
        profile: data as UserProfile,
      });
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to load user profile'));
    }
  };

  const signUp = async (email: string, password: string, displayName?: string, role: 'primary' | 'child' = 'primary') => {
    try {
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

      // Manually create user profile (in case trigger fails)
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

      // Load the user profile
      await loadUserProfile(authUser.id);
    } catch (err) {
      console.error('Error during sign up:', err);
      throw err;
    }
  };

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

  const createChildAccount = async (email: string, password: string, displayName: string) => {
    if (user?.profile?.user_role !== 'primary') {
      throw new Error('Only primary users can create child accounts');
    }

    await signUp(email, password, displayName, 'child');
  };

  const isPrimaryUser = () => user?.profile?.user_role === 'primary';
  const isChildUser = () => user?.profile?.user_role === 'child';

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
