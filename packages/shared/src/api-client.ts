import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export class ApiClient {
  private supabase;
  private openai;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    openaiKey: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    });
    this.openai = new OpenAI({ apiKey: openaiKey });

    // Sign in anonymously if no session exists
    this.ensureSession();
  }

  private async ensureSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    if (!session) {
      await this.supabase.auth.signInWithPassword({
        email: 'anonymous@example.com',
        password: 'anonymous'
      }).catch(() => {
        // If sign in fails, try to sign up
        return this.supabase.auth.signUp({
          email: 'anonymous@example.com',
          password: 'anonymous'
        });
      });
    }
  }

  async getMessages() {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async sendMessage(content: string) {
    const { data: message, error: messageError } = await this.supabase
      .from('messages')
      .insert([{ content, role: 'user' }])
      .select()
      .single();

    if (messageError) throw messageError;

    // Get AI response
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error('No AI response received');

    const { error: aiMessageError } = await this.supabase
      .from('messages')
      .insert([{ content: aiResponse, role: 'assistant' }]);

    if (aiMessageError) throw aiMessageError;

    return { userMessage: message, aiResponse };
  }
}
