import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { sendNewContactNotification } from '../services/email.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog } from '../services/audit.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }
  const { data, error } = await supabase.from('contacts').insert({ name, email, phone, message, status: 'new' }).select().single();
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to submit contact' });
    return;
  }
  await sendNewContactNotification(data);
  res.status(201).json({ success: true, data, message: 'Contact submitted' });
});

router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
    return;
  }
  res.json({ success: true, data, message: 'Contacts fetched' });
});

router.patch('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, message: 'Status required' });
    return;
  }
  const { data, error } = await supabase.from('contacts').update({ status }).eq('id', req.params.id).select().single();
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to update contact status' });
    return;
  }
  if (req.user) await createAuditLog(req.user.id, 'UPDATE_CONTACT_STATUS', { status }, 'contacts', req.params.id);
  res.json({ success: true, data, message: 'Contact status updated' });
});

export default router;
