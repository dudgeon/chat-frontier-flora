import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Debug environment variables
console.log('Environment variables check:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));

// Use Expo environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create supabase client with fallback values for development
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables.');
    console.error('Available env vars:', Object.keys(process.env));

    // Use placeholder values to prevent app crash during development
    const placeholderUrl = 'https://placeholder.supabase.co';
    const placeholderKey = 'placeholder-key';

    return createClient<Database>(placeholderUrl, placeholderKey);
  } else {
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
};

export const supabase = createSupabaseClient();
