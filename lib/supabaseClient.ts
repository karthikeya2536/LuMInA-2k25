import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars on import.meta.env, but TypeScript may not have the type for env.
const env = (import.meta as any).env ?? {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // It's okay in dev to continue, but log a helpful message.
  // Keep creating the client with empty strings to avoid runtime crashes during dev build.
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Supabase client will not work until these are configured.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');