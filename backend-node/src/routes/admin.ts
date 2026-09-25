import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const { data: bookings, error } = await supabase.from('bookings').select('status');
    if (error) throw error;
    
    const metrics = {
      total_bookings: bookings.length,
      pending_bookings: bookings.filter(b => b.status === 'pending').length,
      in_progress_bookings: bookings.filter(b => b.status === 'in_progress').length,
      completed_bookings: bookings.filter(b => b.status === 'completed').length,
    };
    
    res.json({ success: true, data: metrics, message: 'Dashboard metrics fetched' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
  }
});

router.get('/audit-logs', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('audit_logs').select('*, users(email)').order('created_at', { ascending: false }).limit(100);
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    return;
  }
  res.json({ success: true, data, message: 'Audit logs fetched' });
});

export default router;
