import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
// Note: In a real environment, these are populated via secure environment variables.
// For the demo structure, we check if they exist.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
    return !!(supabaseUrl && supabaseKey);
};

// To prevent the "supabaseUrl is required" error when keys are not set (Demo Mode),
// we provide fallback values. The app logic guards against using the client 
// via isSupabaseConfigured() in AuthContext and other services.
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseKey || 'placeholder-key';

export const supabase = createClient(url, key);