// Import the Supabase client library, which handles all DB + Realtime communication
import { createClient } from '@supabase/supabase-js'

// These values come from the .env file at the project root
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crash immediately if env vars are missing (avoids confusing errors later)
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

// Single supabase instance shared across the entire app
export const supabase = createClient(supabaseUrl, supabaseKey)
