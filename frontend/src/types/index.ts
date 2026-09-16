export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  tier: string;
  priceText: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Booking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  acType: string;
  units: number;
  problemDescription: string;
  scheduledDate: string;
  timeSlot: string;
  region: string;
  propertyType: string;
  fullAddress: string;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  technicianName?: string;
  technicianPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingCreate = Omit<Booking, 'id' | 'bookingRef' | 'status' | 'technicianName' | 'technicianPhone' | 'notes' | 'createdAt' | 'updatedAt'>;

export interface Contact {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: string;
}

export type ContactCreate = Omit<Contact, 'id' | 'status' | 'createdAt'>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalBookings: number;
  pendingBookings: number;
  inProgressBookings: number;
  completedBookings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
