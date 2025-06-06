-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('primary', 'child');

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_role user_role NOT NULL DEFAULT 'primary',
    display_name TEXT,
    parent_user_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_parent_relationship CHECK (
        (user_role = 'child' AND parent_user_id IS NOT NULL) OR
        (user_role = 'primary' AND parent_user_id IS NULL)
    )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Primary users can read profiles of their child users
CREATE POLICY "Primary users can read child profiles"
    ON user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND user_role = 'primary'
            AND id = user_profiles.parent_user_id
        )
    );

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Primary users can update their child profiles
CREATE POLICY "Primary users can update child profiles"
    ON user_profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND user_role = 'primary'
            AND id = user_profiles.parent_user_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND user_role = 'primary'
            AND id = user_profiles.parent_user_id
        )
    );

-- Policy: Only primary users can create new profiles
CREATE POLICY "Only primary users can create profiles"
    ON user_profiles
    FOR INSERT
    WITH CHECK (
        (NEW.user_role = 'primary' AND NEW.parent_user_id IS NULL) OR
        (NEW.user_role = 'child' AND
            EXISTS (
                SELECT 1 FROM user_profiles
                WHERE id = auth.uid()
                AND user_role = 'primary'
                AND id = NEW.parent_user_id
            )
        )
    );

-- Policy: Primary users can delete their child profiles
CREATE POLICY "Primary users can delete child profiles"
    ON user_profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND user_role = 'primary'
            AND id = user_profiles.parent_user_id
        )
    );

-- Create indexes
CREATE INDEX idx_user_profiles_parent_user_id ON user_profiles(parent_user_id);
CREATE INDEX idx_user_profiles_user_role ON user_profiles(user_role);

-- Migration applied via GitHub Actions for Task 1.7
