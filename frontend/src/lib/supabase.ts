import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or Anon Key missing. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Generate a booking ID in PCS-XXXX format.
 * Checks for collisions against the bookings table.
 */
export async function generateBookingId(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const id = `PCS-${num}`;
    const { data } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (!data) return id;
    attempts++;
  }
  // Fallback with timestamp
  return `PCS-${Date.now().toString().slice(-6)}`;
}
