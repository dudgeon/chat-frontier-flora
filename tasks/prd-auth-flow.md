# Authentication Flow PRD

## Introduction/Overview
This document outlines the authentication system for the chat application, focusing on primary user account creation and management. The system will provide a straightforward email/password-based authentication flow with persistent sessions and basic password requirements.

## Goals
1. Enable users to create primary accounts without invitation
2. Provide secure but user-friendly authentication
3. Implement persistent authentication across browser sessions
4. Collect necessary user information and consent during signup
5. Lay groundwork for future child account management features

## User Stories
- As a new user, I want to create an account with my email and password so that I can access the chat application
- As a returning user, I want to log in to my existing account and remain logged in across browser sessions
- As a logged-in user, I want to view and edit my profile information
- As a primary user, I want my account to be ready for managing child accounts in future versions

## Functional Requirements

### Account Creation
1. System must provide a signup form collecting:
   - Email address
   - Password (with real-time validation and rule display)
   - Full name
   - Checkbox attestation for age verification (18+) - **REQUIRED**
   - Checkbox attestation for terms of service and data usage consent - **REQUIRED**

2. Password requirements:
   - Minimum 8 characters
   - At least one number
   - At least one letter
   - No maximum length restriction

3. Password validation and display:
   - System must validate password requirements in real-time as user types
   - System must display password rules via tooltip, inline text, or similar affordance when password is invalid
   - System must provide clear visual feedback (colors, icons) for met/unmet requirements
   - Password field should show validation state (valid/invalid) clearly

4. Form submission controls:
   - Submit button must be disabled until ALL required fields are complete and valid
   - Submit button must appear visually disabled (grayed out, different styling) when disabled
   - Submit button must only become enabled when:
     - Email is valid format
     - Password meets all requirements
     - Full name is provided
     - Age verification checkbox is checked
     - Terms and data usage consent checkbox is checked

5. System must validate:
   - Email format
   - Password meets requirements
   - All required fields are completed
   - Both attestation checkboxes are checked

6. Age verification requirement:
   - User must explicitly attest they are 18 years of age or older
   - This attestation is required before account creation
   - Checkbox must be clearly labeled with age requirement

7. Terms of service and data usage consent:
   - User must agree to terms of service and privacy policy
   - Terms must include clear warning that:
     - All user data is available to the developer for the purpose of improving the app
     - User data may be used for development and analysis purposes
     - Users have the right to request deletion of their data
   - Consent checkbox must be checked before account creation

### Authentication
1. System must provide a login form with:
   - Email field
   - Password field
   - "Log In" button

2. System must:
   - Create and store secure session tokens
   - Maintain session persistence across browser sessions
   - Allow users to manually log out

### Profile Management
1. System must allow users to:
   - View their profile information
   - Update their name
   - Change their password
   - View their account type (primary)

### Error Handling
1. System must display clear error messages for:
   - Invalid email format
   - Password requirement failures
   - Missing required fields
   - Failed login attempts
   - Account already exists

## Non-Goals (Out of Scope)
- Social login integration (Google, GitHub, etc.)
- Email verification
- Password strength indicators (beyond basic requirements)
- Rate limiting and bot protection
- Automatic session timeout
- Multi-factor authentication
- Password recovery/reset functionality
- Child account management features
- Payment integration

## Design Considerations
- Use clear, minimal forms with straightforward layout
- Show password requirements inline during signup with real-time validation feedback
- Display validation errors next to relevant fields
- Provide visual confirmation of successful actions
- Use consistent styling with the main application
- Ensure mobile-friendly layout
- Submit button should have clear disabled/enabled states
- Password validation should be helpful, not punitive (show progress toward meeting requirements)
- Terms and data usage information should be clear and prominent

## Technical Considerations
1. Authentication Implementation:
   - Use Supabase Auth for authentication management
   - Implement secure session storage
   - Use proper password hashing (handled by Supabase)

2. Data Storage:
   - Store user profiles in Supabase
   - Include fields for future child account management
   - Implement proper RLS policies
   - Store consent timestamps for compliance

3. State Management:
   - Maintain auth state across the application
   - Handle session persistence
   - Manage loading states during auth operations
   - Track form validation state for submit button control

4. Form Validation:
   - Implement real-time password validation
   - Manage form state to control submit button
   - Provide immediate feedback on field validation

## Success Metrics
1. User Acquisition:
   - Successfully created accounts
   - Completed signup-to-login journey

2. User Experience:
   - Login success rate
   - Session maintenance reliability
   - Profile update success rate
   - Form completion rate (users who start vs complete signup)

3. Technical Performance:
   - Authentication response times
   - Session token validity
   - Error rate in auth operations

## Open Questions
1. Should we implement a maximum number of stored sessions per user?
2. What should be the exact wording for the development/analysis consent?
3. Should we add any additional profile fields in preparation for future features?
4. What should be the specific error messages for each failure case?
5. Should password validation show all rules at once, or only failed rules?
6. What specific styling should be used for disabled vs enabled submit button?

## Database Schema

```sql
-- Create enum for user roles
create type user_role as enum ('primary', 'child');

-- Users table (extends Supabase auth.users)
create table public.user_profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  role user_role not null default 'primary',
  parent_user_id uuid references public.user_profiles(id),
  development_consent boolean not null,
  age_verification boolean not null,
  consent_timestamp timestamptz not null default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Add constraint to ensure child users have a parent
  constraint valid_parent_user check (
    (role = 'child' AND parent_user_id IS NOT NULL) OR
    (role = 'primary' AND parent_user_id IS NULL)
  )
);

-- RLS Policies will be defined to ensure:
-- 1. Users can only read/update their own profiles
-- 2. Primary users can later manage their child accounts
-- 3. System admins can access all profiles
```
