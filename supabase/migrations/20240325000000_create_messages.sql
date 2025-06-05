-- Migration: Create messages table for chat application
-- Created: 2024-03-25
-- Description: Sets up the initial messages table with RLS policies

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users"
    ON messages FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert access to all authenticated users
CREATE POLICY "Allow insert access to all authenticated users"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX messages_created_at_idx ON messages(created_at);
CREATE INDEX messages_role_idx ON messages(role);
