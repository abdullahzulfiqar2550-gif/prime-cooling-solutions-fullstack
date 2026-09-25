import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { generateBookingId } from '../utils/id-generator.js';
import { sendBookingConfirmation, sendBookingStatusUpdate } from '../services/email.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog } from '../services/audit.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { service_id, customer_name, customer_phone, customer_address } = req.body;
    if (!service_id || !customer_name || !customer_phone || !customer_address) {
      res.status(400).json({ success: false, message: 'Missing fields' });
      return;
    }
    const booking_id = await generateBookingId();
    const { data, error } = await supabase
      .from('bookings')
      .insert({ booking_id, service_id, customer_name, customer_phone, customer_address, status: 'pending' })
      .select()
      .single();

    if (error) throw error;
    
    await sendBookingConfirmation(data);
    res.status(201).json({ success: true, data, message: 'Booking created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/track', async (req: Request, res: Response) => {
  const { id, phone } = req.query;
  let query = supabase.from('bookings').select('*, services(title)');
  if (id) query = query.eq('booking_id', id);
  if (phone) query = query.eq('customer_phone', phone);
  
  const { data, error } = await query;
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to track booking' });
    return;
  }
  res.json({ success: true, data, message: 'Bookings retrieved' });
});

router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const { status } = req.query;
  let query = supabase.from('bookings').select('*, services(title)').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  
  const { data, error } = await query;
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    return;
  }
  res.json({ success: true, data, message: 'Bookings fetched' });
});

router.get('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('bookings').select('*, services(*)').eq('id', req.params.id).single();
  if (error || !data) {
    res.status(404).json({ success: false, message: 'Booking not found' });
    return;
  }
  res.json({ success: true, data, message: 'Booking fetched' });
});

router.patch('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, message: 'Status required' });
    return;
  }
  const { data: existing, error: fetchError } = await supabase.from('bookings').select('*').eq('id', req.params.id).single();
  if (fetchError || !existing) {
    res.status(404).json({ success: false, message: 'Booking not found' });
    return;
  }
  
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', req.params.id).select().single();
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
    return;
  }
  
  await sendBookingStatusUpdate(data, existing.status, status);
  if (req.user) await createAuditLog(req.user.id, 'UPDATE_BOOKING_STATUS', { old: existing.status, new: status }, 'bookings', req.params.id);
  
  res.json({ success: true, data, message: 'Status updated' });
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const updates = req.body;
  const { data, error } = await supabase.from('bookings').update(updates).eq('id', req.params.id).select().single();
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking' });
    return;
  }
  if (req.user) await createAuditLog(req.user.id, 'UPDATE_BOOKING', updates, 'bookings', req.params.id);
  res.json({ success: true, data, message: 'Booking updated' });
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { error } = await supabase.from('bookings').delete().eq('id', req.params.id);
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
    return;
  }
  if (req.user) await createAuditLog(req.user.id, 'DELETE_BOOKING', { id: req.params.id }, 'bookings', req.params.id);
  res.json({ success: true, message: 'Booking deleted' });
});

export default router;
