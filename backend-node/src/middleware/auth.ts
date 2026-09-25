import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/security.js';
import { supabase } from '../supabase.js';
import { AuthRequest } from '../types/index.js';

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const payload = verifyToken(token);
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, message: 'User not found or token invalid' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return;
  }
  next();
};
