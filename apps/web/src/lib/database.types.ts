export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_role: 'primary' | 'child';
          display_name: string | null;
          parent_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_role?: 'primary' | 'child';
          display_name?: string | null;
          parent_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_role?: 'primary' | 'child';
          display_name?: string | null;
          parent_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'primary' | 'child';
    };
  };
}
