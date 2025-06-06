## Relevant Files

- `supabase/migrations/[timestamp]_create_user_profiles.sql` - Database migration for user profiles table and RLS policies
- `packages/shared/src/types/auth.ts` - Shared types for authentication and user profiles
- `packages/shared/src/api/auth.ts` - Shared authentication API client
- `apps/web/components/auth/SignUpForm.tsx` - Sign-up form component with validation
- `apps/web/components/auth/LoginForm.tsx` - Login form component
- `apps/web/components/auth/ProfileManager.tsx` - Profile viewing and editing component
- `apps/web/hooks/useAuth.ts` - Custom hook for auth state management
- `apps/web/contexts/AuthContext.tsx` - Authentication context provider
- `apps/web/utils/validation.ts` - Form validation utilities
- `apps/web/utils/validation.test.ts` - Tests for validation utilities

### Notes

- All components should have corresponding test files (e.g., `SignUpForm.test.tsx`)
- Use Supabase Auth for authentication management
- Implement proper error handling and loading states
- Ensure mobile-responsive design for all forms
- Follow existing component patterns and styling

## Tasks

- [ ] 1.0 Database Setup and Configuration
  - [ ] 1.1 Create user_role enum type
  - [ ] 1.2 Create migration file for user_profiles table with role-based constraints
  - [ ] 1.3 Add RLS policy for users to read their own profiles
  - [ ] 1.4 Add RLS policy for primary users to manage their child accounts
  - [ ] 1.5 Add RLS policy to prevent child users from creating accounts
  - [ ] 1.6 Test migration with rollback capability
  - [ ] 1.7 Configure Supabase Auth settings (disable email confirmation)
  - [ ] 1.8 Create TypeScript types for user roles and database schema

- [ ] 2.0 Authentication State Management
  - [ ] 2.1 Create AuthContext with initial state including user role
  - [ ] 2.2 Implement useAuth hook for accessing auth state and role checks
  - [ ] 2.3 Add session persistence logic
  - [ ] 2.4 Create auth state actions (login, logout, signup)
  - [ ] 2.5 Add loading states for auth operations
  - [ ] 2.6 Implement error handling for auth operations
  - [ ] 2.7 Create protected route wrapper with role-based access
  - [ ] 2.8 Add auth state change listeners
  - [ ] 2.9 Write tests for auth context and hooks including role checks

- [ ] 3.0 Sign-Up Flow Implementation
  - [ ] 3.1 Create validation utilities for email and password
  - [ ] 3.2 Implement SignUpForm component UI
  - [ ] 3.3 Add form validation logic
  - [ ] 3.4 Create user profile with primary role after successful signup
  - [ ] 3.5 Add loading states during signup
  - [ ] 3.6 Implement inline password requirement feedback
  - [ ] 3.7 Add attestation checkboxes with proper styling
  - [ ] 3.8 Create error message components
  - [ ] 3.9 Add success feedback and redirect
  - [ ] 3.10 Write tests for SignUpForm component
  - [ ] 3.11 Write tests for validation utilities

- [ ] 4.0 Login Flow Implementation
  - [ ] 4.1 Create LoginForm component UI
  - [ ] 4.2 Implement form validation
  - [ ] 4.3 Add loading state during login
  - [ ] 4.4 Create error message handling
  - [ ] 4.5 Implement session persistence with role information
  - [ ] 4.6 Add "Remember me" functionality
  - [ ] 4.7 Create success redirect logic based on user role
  - [ ] 4.8 Write tests for LoginForm component
  - [ ] 4.9 Test session persistence across browser restarts

- [ ] 5.0 Profile Management
  - [ ] 5.1 Create ProfileManager component UI with role-specific views
  - [ ] 5.2 Implement profile data fetching
  - [ ] 5.3 Add profile update functionality
  - [ ] 5.4 Create password change form
  - [ ] 5.5 Implement profile data validation
  - [ ] 5.6 Add loading states for profile operations
  - [ ] 5.7 Create success/error feedback messages
  - [ ] 5.8 Implement optimistic updates
  - [ ] 5.9 Write tests for ProfileManager component
  - [ ] 5.10 Test profile update operations with different roles

I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed.
