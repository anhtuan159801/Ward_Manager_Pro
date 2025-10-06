import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in the .env file.');
  throw new Error('Supabase URL and Anon Key must be provided in the .env file.');
}

console.log('Supabase URL:', supabaseUrl); // Add this line for debugging

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
