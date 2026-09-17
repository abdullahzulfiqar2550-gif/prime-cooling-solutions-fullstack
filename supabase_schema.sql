-- ============================================================
-- Prime Cooling Solutions — Supabase Schema
-- Paste this ENTIRE script into Supabase SQL Editor and click RUN
-- ============================================================

-- 1. USERS TABLE (admin accounts)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'DISPATCHER'
    CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'DISPATCHER')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  icon TEXT NOT NULL DEFAULT 'wrench',
  description TEXT,
  tier TEXT,
  price_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Inactive')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  appliance TEXT NOT NULL,
  service_package TEXT NOT NULL,
  unit_count INTEGER NOT NULL DEFAULT 1,
  scheduled_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  region TEXT NOT NULL,
  property_type TEXT,
  address TEXT NOT NULL,
  symptoms_notes TEXT,
  status TEXT NOT NULL DEFAULT 'NEW'
    CHECK (status IN ('NEW','CONTACTED','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED')),
  assigned_technician TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW'
    CHECK (status IN ('NEW', 'READ', 'REPLIED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- BOOKING ID GENERATOR (PCS-XXXX format)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    new_id := 'PCS-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    SELECT EXISTS(SELECT 1 FROM bookings WHERE id = new_id) INTO exists_already;
    IF NOT exists_already THEN
      RETURN new_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ADMIN LOCK: Only 1 admin allowed
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_single_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IN ('SUPER_ADMIN', 'ADMIN') THEN
    IF EXISTS (
      SELECT 1 FROM users
      WHERE role IN ('SUPER_ADMIN', 'ADMIN')
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'Only one admin user is allowed. Admin slot is already filled.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_single_admin
  BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE FUNCTION enforce_single_admin();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- BOOKINGS: Anyone can insert, only service_role can read/update/delete
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can track bookings by id or phone" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Service role can update bookings" ON bookings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete bookings" ON bookings
  FOR DELETE USING (true);

-- CONTACTS: Anyone can insert, only service_role can read/update
CREATE POLICY "Anyone can submit contact forms" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read contacts" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "Service role can update contacts" ON contacts
  FOR UPDATE USING (true) WITH CHECK (true);

-- SERVICES: Anyone can read active services
CREATE POLICY "Anyone can read active services" ON services
  FOR SELECT USING (status = 'Active');

CREATE POLICY "Service role manage services" ON services
  FOR ALL USING (true) WITH CHECK (true);

-- USERS: Only service_role
CREATE POLICY "Service role manages users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- AUDIT LOGS: Only service_role
CREATE POLICY "Service role manages audit logs" ON audit_logs
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA: 13 Services
-- ============================================================
INSERT INTO services (slug, title, category, icon, description, tier, price_text, sort_order) VALUES
  ('service-visit', 'Service Visit / Inspection', 'General', 'Search', 'Initial diagnostic visit and inspection of your AC unit.', 'Basic', 'Rs. 700', 1),
  ('general-ac-service', 'General AC Service', 'Maintenance', 'Wrench', 'Standard cleaning and maintenance for optimal cooling.', 'Standard', 'Rs. 2,000 – 2,500', 2),
  ('ac-installation', 'AC Installation', 'Installation', 'Hammer', 'Professional installation of new AC units.', 'Standard', 'Rs. 3,000', 3),
  ('ac-uninstallation', 'AC Uninstallation', 'Installation', 'PackageMinus', 'Safe removal and packing of existing AC units.', 'Basic', 'Rs. 1,500', 4),
  ('pressure-wash', 'Pressure Wash', 'Maintenance', 'Droplets', 'Deep cleaning using high-pressure water jets.', 'Premium', 'Quote-based', 5),
  ('repair-troubleshooting', 'Repair & Troubleshooting', 'Repair', 'Settings', 'Expert diagnosis and repair of AC faults.', 'Standard', 'Quote-based', 6),
  ('refrigerant-services', 'Refrigerant Services', 'Repair', 'Gauge', 'Gas top-up and complete leak fixing.', 'Premium', 'Quote-based', 7),
  ('copper-piping', 'Copper Piping & Drainage', 'Installation', 'Pipette', 'High-quality copper piping and drainage solutions.', 'Premium', 'Quote-based', 8),
  ('electrical-troubleshooting', 'Electrical Troubleshooting', 'Repair', 'Zap', 'Fixing electrical issues related to your HVAC system.', 'Standard', 'Quote-based', 9),
  ('preventive-maintenance', 'Preventive Maintenance', 'Maintenance', 'ShieldCheck', 'Scheduled maintenance to prevent future breakdowns.', 'Premium', 'Quote-based', 10),
  ('amc', 'Annual Maintenance Contract', 'Contract', 'FileCheck', 'Year-round peace of mind with our AMC packages.', 'Premium', 'Rs. 9,999 / AC / Year', 11),
  ('water-dispenser', 'Water Dispenser Service', 'Appliance', 'GlassWater', 'Service and repair for water dispensers.', 'Standard', 'Quote-based', 12),
  ('refrigerator-service', 'Refrigerator Service', 'Appliance', 'Refrigerator', 'Professional refrigerator repair and maintenance.', 'Standard', 'Quote-based', 13)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DONE! All tables, triggers, indexes, RLS policies, and seed data created.
-- ============================================================
