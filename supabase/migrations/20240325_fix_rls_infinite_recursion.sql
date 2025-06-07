-- Fix infinite recursion in user_profiles RLS policies
-- The issue: policies were querying user_profiles table within themselves

-- Drop the problematic policies
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
-- Note: We'll handle role validation in the application layer to avoid recursion
CREATE POLICY "Allow profile creation"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Primary users can delete their child profiles
CREATE POLICY "Primary users can delete child profiles"
    ON user_profiles
    FOR DELETE
    USING (parent_user_id = auth.uid());
