import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  price: string;
  icon: string;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  service_id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  details: any;
  entity_type?: string;
  entity_id?: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_bookings: number;
  pending_bookings: number;
  in_progress_bookings: number;
  completed_bookings: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

export interface JWTPayload {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: User;
}
