export const COMPANY = {
  name: 'Prime Cooling Solutions',
  tagline: 'Engineered Service. Professional Standards.',
  phone: '0337-1768618',
  email: 'primecoolingsolutions.pk@gmail.com',
  address: 'Shop No. 7, Abdul Sattar Park, Dogar Market, Kot Lakhpat, Lahore',
  ceo: 'Zubair Akeel, BS Mechanical Engineering, HVAC Specialist',
  workingHours: 'Mon–Sat 9AM–7PM',
  whatsapp: '923371768618',
  experience: '4+ years experience',
  coverage: 'Selected areas of Lahore',
};

export const COLORS = {
  primaryNavy: '#0F172A',
  arcticCyan: '#06B6D4',
  teal: '#14B8A6',
  amber: '#F59E0B',
};

export const SERVICES = [
  { id: '1', slug: 'service-visit', title: 'Service Visit / Inspection', category: 'General', icon: 'Search', description: 'Initial diagnostic visit and inspection of your AC unit.', tier: 'Basic', priceText: 'Rs. 700', priceNumeric: 700, status: 'ACTIVE' },
  { id: '2', slug: 'general-ac-service', title: 'General AC Service', category: 'Maintenance', icon: 'Wrench', description: 'Standard cleaning and maintenance for optimal cooling.', tier: 'Standard', priceText: 'Rs. 2,000 – 2,500', priceNumeric: 2000, status: 'ACTIVE' },
  { id: '3', slug: 'ac-installation', title: 'AC Installation', category: 'Installation', icon: 'Hammer', description: 'Professional installation of new AC units.', tier: 'Standard', priceText: 'Rs. 3,000', priceNumeric: 3000, status: 'ACTIVE' },
  { id: '4', slug: 'ac-uninstallation', title: 'AC Uninstallation', category: 'Installation', icon: 'PackageMinus', description: 'Safe removal and packing of existing AC units.', tier: 'Basic', priceText: 'Rs. 1,500', priceNumeric: 1500, status: 'ACTIVE' },
  { id: '5', slug: 'pressure-wash', title: 'Pressure Wash', category: 'Maintenance', icon: 'Droplets', description: 'Deep cleaning using high-pressure water jets.', tier: 'Premium', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '6', slug: 'repair-troubleshooting', title: 'Repair & Troubleshooting', category: 'Repair', icon: 'Settings', description: 'Expert diagnosis and repair of AC faults.', tier: 'Standard', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '7', slug: 'refrigerant-services', title: 'Refrigerant Services', category: 'Repair', icon: 'Gauge', description: 'Gas top-up and complete leak fixing.', tier: 'Premium', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '8', slug: 'copper-piping', title: 'Copper Piping & Drainage', category: 'Installation', icon: 'Pipette', description: 'High-quality copper piping and drainage solutions.', tier: 'Premium', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '9', slug: 'electrical-troubleshooting', title: 'Electrical Troubleshooting', category: 'Repair', icon: 'Zap', description: 'Fixing electrical issues related to your HVAC system.', tier: 'Standard', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '10', slug: 'preventive-maintenance', title: 'Preventive Maintenance', category: 'Maintenance', icon: 'ShieldCheck', description: 'Scheduled maintenance to prevent future breakdowns.', tier: 'Premium', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '11', slug: 'amc', title: 'Annual Maintenance Contract', category: 'Contract', icon: 'FileCheck', description: 'Year-round peace of mind with our AMC packages.', tier: 'Premium', priceText: 'Rs. 9,999 / AC / Year', priceNumeric: 9999, status: 'ACTIVE' },
  { id: '12', slug: 'water-dispenser', title: 'Water Dispenser Service', category: 'Appliance', icon: 'GlassWater', description: 'Service and repair for water dispensers.', tier: 'Standard', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
  { id: '13', slug: 'refrigerator-service', title: 'Refrigerator Service', category: 'Appliance', icon: 'Refrigerator', description: 'Professional refrigerator repair and maintenance.', tier: 'Standard', priceText: 'Quote-based', priceNumeric: 0, status: 'ACTIVE' },
];

export const AMC_DETAILS = {
  price: 'Rs. 9,999 / AC / Year',
  pmVisits: 4,
  breakdownVisits: 6,
  totalVisits: 10,
  eligibility: 'AC systems up to 2 TR',
};

export const CLIENT_SEGMENTS = [
  { title: 'Offices', icon: 'Building2', description: 'Reliable cooling for productive workspaces.' },
  { title: 'Schools & Academies', icon: 'GraduationCap', description: 'Comfortable environments for learning.' },
  { title: 'Shops & Retail', icon: 'Store', description: 'Inviting atmosphere for your customers.' },
  { title: 'Salons', icon: 'Scissors', description: 'Pristine cooling for client comfort.' },
  { title: 'Community & Wedding Halls', icon: 'Users', description: 'Heavy-duty cooling for large gatherings.' },
  { title: 'Small Commercial Premises', icon: 'Briefcase', description: 'Custom HVAC solutions for your business.' },
];

export const SERVICE_METHODOLOGY = [
  { step: 1, title: 'Service Request', icon: 'PhoneCall' },
  { step: 2, title: 'Initial Assessment', icon: 'ClipboardList' },
  { step: 3, title: 'Inspection', icon: 'Search' },
  { step: 4, title: 'Diagnosis', icon: 'Activity' },
  { step: 5, title: 'Recommendation', icon: 'MessageSquare' },
  { step: 6, title: 'Client Approval', icon: 'CheckCircle' },
  { step: 7, title: 'Service & Testing', icon: 'Wrench' },
  { step: 8, title: 'Service Report', icon: 'FileText' },
];

export const WHY_CHOOSE_US = [
  { title: 'Engineering-Led Approach', icon: 'HardHat', description: 'Managed by a qualified Mechanical Engineer.' },
  { title: '4+ Years Experience', icon: 'Award', description: 'Proven track record in HVAC services.' },
  { title: 'Business-Focused Service', icon: 'Target', description: 'Tailored solutions for commercial clients.' },
  { title: 'Preventive Maintenance', icon: 'ShieldCheck', description: 'Proactive care to minimize downtime.' },
  { title: 'Transparent Recommendations', icon: 'Eye', description: 'Honest advice with no hidden costs.' },
  { title: 'Documented Service', icon: 'FileCheck', description: 'Detailed reports for every job completed.' },
];

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'AMC', href: '/amc' },
  { label: 'About', href: '/about' },
  { label: 'Track Booking', href: '/track' },
  { label: 'Contact', href: '/contact' },
];

export const BOOKING_STATUSES = ['NEW', 'CONTACTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export const TIME_SLOTS = [
  { label: 'Morning (9 AM - 12 PM)', value: 'morning' },
  { label: 'Afternoon (12 PM - 3 PM)', value: 'afternoon' },
  { label: 'Evening (3 PM - 7 PM)', value: 'evening' },
  { label: 'Emergency', value: 'emergency' },
];

export const AC_TYPES = [
  { label: 'Wall Mounted Split AC', value: 'split' },
  { label: 'Floor Standing Cabinet', value: 'floor_standing' },
  { label: 'Cassette AC', value: 'cassette' },
  { label: 'Other', value: 'other' },
];

export const REGIONS = [
  { label: 'Kot Lakhpat', value: 'kot_lakhpat' },
  { label: 'Model Town', value: 'model_town' },
  { label: 'Johar Town', value: 'johar_town' },
  { label: 'DHA', value: 'dha' },
  { label: 'Gulberg', value: 'gulberg' },
  { label: 'Other (Subject to availability)', value: 'other' },
];

export const PROPERTY_TYPES = [
  { label: 'Residential', value: 'residential' },
  { label: 'Office', value: 'office' },
  { label: 'Shop/Retail', value: 'retail' },
  { label: 'School/Academy', value: 'educational' },
  { label: 'Salon/Clinic', value: 'salon_clinic' },
  { label: 'Other Commercial', value: 'other_commercial' },
];
