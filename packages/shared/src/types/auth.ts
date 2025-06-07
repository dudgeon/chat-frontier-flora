import { User } from '@supabase/supabase-js';

export type UserRole = 'primary' | 'child';

export interface UserProfile {
    id: string;
    user_role: UserRole;
    full_name: string;
    display_name: string | null;
    parent_user_id: string | null;
    development_consent: boolean;
    age_verification: boolean;
    consent_timestamp: string;
    created_at: string;
    updated_at: string;
}

export interface AuthUser extends User {
    profile?: UserProfile;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: Error | null;
}

export interface AuthContextType extends AuthState {
    signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
    createChildAccount: (email: string, password: string, fullName: string) => Promise<void>;
    isPrimaryUser: () => boolean;
    isChildUser: () => boolean;
}

export interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    ageVerification: boolean;
    agreeToTerms: boolean;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface ProfileUpdateData {
    fullName?: string;
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

export type ValidationResult = ValidationError[] | null;
