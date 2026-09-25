import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { verifyPassword, generateToken, generateRefreshToken, verifyToken } from '../utils/security.js';
import { authenticateToken } from '../middleware/auth.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    res.json({
      success: true,
      data: { user: { id: user.id, email: user.email, role: user.role }, token, refreshToken },
      message: 'Login successful'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/refresh', (req: Request, res: Response): void => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' });
      return;
    }
    const payload = verifyToken(refreshToken);
    const token = generateToken({ userId: payload.userId, role: payload.role });
    res.json({ success: true, data: { token }, message: 'Token refreshed' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

router.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  res.json({ success: true, data: req.user, message: 'User fetched' });
});

export default router;
