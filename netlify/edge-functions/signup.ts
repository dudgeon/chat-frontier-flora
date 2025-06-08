import type { Context, Config } from "@netlify/edge-functions";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  ageVerification: boolean;
  developmentConsent: boolean;
  role?: 'primary' | 'child';
}

interface SignUpResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    profile: {
      id: string;
      full_name: string;
      user_role: string;
      age_verification: boolean;
      development_consent: boolean;
      consent_timestamp: string;
    };
  };
  error?: string;
  details?: any;
}

export default async (req: Request, context: Context): Promise<Response> => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse request body
    const body: SignUpRequest = await req.json();
    const { email, password, fullName, ageVerification, developmentConsent, role = 'primary' } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: email, password, fullName'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate PRD requirements
    if (!ageVerification || !developmentConsent) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Age verification and development consent are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Netlify.env.get('EXPO_PUBLIC_SUPABASE_URL');
    const supabaseServiceKey = Netlify.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(JSON.stringify({
        success: false,
        error: 'Server configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🔐 Starting atomic signup process for:', email);

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        full_name: fullName,
        user_role: role,
      }
    });

    if (authError) {
      console.error('❌ Auth user creation failed:', authError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to create user account',
        details: authError.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!authData.user?.id) {
      console.error('❌ No user ID returned from auth creation');
      return new Response(JSON.stringify({
        success: false,
        error: 'User creation failed - no user ID'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Step 2: Create user profile with all PRD fields
    const profileData = {
      id: authData.user.id,
      full_name: fullName,
      user_role: role,
      age_verification: ageVerification,
      development_consent: developmentConsent,
      consent_timestamp: new Date().toISOString(),
    };

    const { data: profileResult, error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);

      // Rollback: Delete the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
        console.log('🔄 Rolled back auth user creation');
      } catch (rollbackError) {
        console.error('❌ Rollback failed:', rollbackError);
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to create user profile',
        details: profileError.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ User profile created successfully');

    // Step 3: Return complete user data
    const response: SignUpResponse = {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        profile: profileResult
      }
    };

    console.log('🎉 Atomic signup completed successfully for:', email);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Unexpected error in signup function:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config: Config = {
  path: "/api/signup"
};
