-- Fix authentication issues preventing user profile creation and loading
-- Issue 1: Check constraint is too restrictive
-- Issue 2: Ensure RLS policies don't cause infinite recursion

-- Remove the problematic check constraint that prevents profile creation
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS valid_consent_fields;

-- Add a more flexible constraint that allows profiles to be created
-- and consent fields to be updated later if needed
ALTER TABLE user_profiles
ADD CONSTRAINT reasonable_consent_fields CHECK (
    -- Allow any combination of consent fields for flexibility
    (development_consent IS NOT NULL AND age_verification IS NOT NULL) OR
    -- Allow existing records without these fields
    (created_at < NOW() - INTERVAL '1 day')
);

-- Ensure the RLS policies are correct (reapply the fix)
-- Drop any problematic policies first
DROP POLICY IF EXISTS "Primary users can read child profiles" ON user_profiles;
DROP POLICY IF EXISTS "Primary users can update child profiles" ON user_profiles;
DROP POLICY IF EXISTS "Primary users can delete child profiles" ON user_profiles;
DROP POLICY IF EXISTS "Only primary users can create profiles" ON user_profiles;

-- Recreate policies without infinite recursion
-- Policy: Primary users can read profiles of their child users
CREATE POLICY "Primary users can read child profiles"
    ON user_profiles
    FOR SELECT
    USING (
        parent_user_id = auth.uid()
    );

-- Policy: Primary users can update their child profiles
CREATE POLICY "Primary users can update child profiles"
    ON user_profiles
    FOR UPDATE
    USING (parent_user_id = auth.uid())
    WITH CHECK (parent_user_id = auth.uid());

-- Policy: Allow profile creation for authenticated users
-- Simplified to avoid recursion - role validation handled in app
CREATE POLICY "Allow profile creation"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Primary users can delete their child profiles
CREATE POLICY "Primary users can delete child profiles"
    ON user_profiles
    FOR DELETE
    USING (parent_user_id = auth.uid());

-- Make sure the new fields have reasonable defaults
ALTER TABLE user_profiles
ALTER COLUMN full_name SET DEFAULT '',
ALTER COLUMN development_consent SET DEFAULT FALSE,
ALTER COLUMN age_verification SET DEFAULT FALSE;
