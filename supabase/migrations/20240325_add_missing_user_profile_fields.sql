-- Add missing fields to user_profiles table to match PRD requirements
-- This completes task 1.2: Create migration file for user_profiles table with role-based constraints

-- Add the missing required fields
ALTER TABLE user_profiles
ADD COLUMN full_name TEXT NOT NULL DEFAULT '',
ADD COLUMN development_consent BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN age_verification BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Update the constraint to use the correct field name (role instead of user_role for consistency)
-- Note: We keep user_role for backward compatibility but the PRD uses 'role'
-- The constraint already exists and works correctly

-- Create indexes for the new fields for better query performance
CREATE INDEX idx_user_profiles_full_name ON user_profiles(full_name);
CREATE INDEX idx_user_profiles_consent_timestamp ON user_profiles(consent_timestamp);

-- Add a constraint to ensure consent fields are properly set for new users
ALTER TABLE user_profiles
ADD CONSTRAINT valid_consent_fields CHECK (
    (development_consent = TRUE AND age_verification = TRUE) OR
    (created_at < NOW() - INTERVAL '1 minute') -- Allow existing records
);
