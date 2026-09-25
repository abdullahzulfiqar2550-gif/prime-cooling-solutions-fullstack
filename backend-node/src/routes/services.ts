import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog } from '../services/audit.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
    return;
  }
  res.json({ success: true, data, message: 'Services fetched' });
});

router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).single();
  if (error || !data) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }
  res.json({ success: true, data, message: 'Service fetched' });
});

// Admin routes for services (using the same path, just protected)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { title, slug, price, icon } = req.body;
  if (!title || !slug || !price || !icon) {
    res.status(400).json({ success: false, message: 'Missing fields' });
    return;
  }
  const { data, error } = await supabase.from('services').insert({ title, slug, price, icon }).select().single();
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to create service' });
    return;
  }
  if (req.user) await createAuditLog(req.user.id, 'CREATE_SERVICE', { slug }, 'services', data.id);
  res.status(201).json({ success: true, data, message: 'Service created' });
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to update service' });
    return;
  }
  if (req.user) await createAuditLog(req.user.id, 'UPDATE_SERVICE', updates, 'services', id);
  res.json({ success: true, data, message: 'Service updated' });
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service' });
    return;
  }
  if (req.user) await createAuditLog(req.user.id, 'DELETE_SERVICE', { id }, 'services', id);
  res.json({ success: true, message: 'Service deleted' });
});

export default router;
