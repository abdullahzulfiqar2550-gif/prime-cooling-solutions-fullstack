import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.warn("Supabase URL or Service Key is missing. Check your .env file.");
}

export const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
