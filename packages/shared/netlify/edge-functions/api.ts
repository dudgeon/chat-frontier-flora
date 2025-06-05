import { Context } from "https://edge.netlify.com";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import OpenAI from "https://esm.sh/openai@4.28.0";

declare global {
  interface Context {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      OPENAI_API_KEY: string;
    };
  }
}

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_ANON_KEY') || ''
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

export default async (request: Request, context: Context) => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', // In production, replace with actual origin
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Get user session from request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers,
      });
    }

    // Verify session with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers,
      });
    }

    // Route handling
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/', '');

    switch (path) {
      case 'chat': {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers,
          });
        }

        const body = await request.json();

        // Store message in Supabase
        const { error: dbError } = await supabase
          .from('messages')
          .insert({
            user_id: user.id,
            content: body.message,
            role: 'user',
          });

        if (dbError) {
          console.error('Database error:', dbError);
          return new Response(JSON.stringify({ error: 'Database error' }), {
            status: 500,
            headers,
          });
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: body.message }],
          model: 'gpt-3.5-turbo',
        });

        // Store AI response
        await supabase
          .from('messages')
          .insert({
            user_id: user.id,
            content: completion.choices[0].message.content,
            role: 'assistant',
          });

        return new Response(
          JSON.stringify({
            message: completion.choices[0].message.content,
          }),
          { headers }
        );
      }

      default:
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers,
        });
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
