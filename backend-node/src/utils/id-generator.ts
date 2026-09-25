import { supabase } from '../supabase.js';

export const generateBookingId = async (): Promise<string> => {
  let isUnique = false;
  let newId = '';
  
  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    newId = `PCS-${randomNum}`;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_id', newId)
      .single();
      
    if (error && error.code === 'PGRST116') {
      isUnique = true; // No record found, so it's unique
    } else if (!data) {
      isUnique = true;
    }
  }
  
  return newId;
};
