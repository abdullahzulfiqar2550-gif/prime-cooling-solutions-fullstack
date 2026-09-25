import { supabase } from './supabase.js';
import { hashPassword } from './utils/security.js';
import { config } from './config.js';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
  console.log('Seeding database...');
  
  try {
    const password_hash = await hashPassword(config.adminPassword);
    
    const { data: existingUser } = await supabase.from('users').select('*').eq('email', config.adminEmail).single();
    
    if (!existingUser) {
      const { error: userError } = await supabase.from('users').insert({
        id: uuidv4(),
        email: config.adminEmail,
        password_hash,
        role: 'SUPER_ADMIN',
        full_name: config.adminName
      });
      if (userError) console.error('Error creating admin user:', userError);
      else console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    const services = [
      { title: 'Service Visit / Inspection', slug: 'service-visit', price: 'Rs. 700', icon: 'Search' },
      { title: 'General AC Service', slug: 'general-ac-service', price: 'Rs. 2,000 – 2,500', icon: 'Wrench' },
      { title: 'AC Installation', slug: 'ac-installation', price: 'Rs. 3,000', icon: 'Hammer' },
      { title: 'AC Uninstallation', slug: 'ac-uninstallation', price: 'Rs. 1,500', icon: 'PackageMinus' },
      { title: 'Pressure Wash', slug: 'pressure-wash', price: 'Quote-based', icon: 'Droplets' },
      { title: 'Repair & Troubleshooting', slug: 'repair-troubleshooting', price: 'Quote-based', icon: 'Settings' },
      { title: 'Refrigerant Services', slug: 'refrigerant-services', price: 'Quote-based', icon: 'Gauge' },
      { title: 'Copper Piping & Drainage', slug: 'copper-piping', price: 'Quote-based', icon: 'Pipette' },
      { title: 'Electrical Troubleshooting', slug: 'electrical-troubleshooting', price: 'Quote-based', icon: 'Zap' },
      { title: 'Preventive Maintenance', slug: 'preventive-maintenance', price: 'Quote-based', icon: 'ShieldCheck' },
      { title: 'Annual Maintenance Contract', slug: 'annual-maintenance', price: 'Rs. 9,999 / AC / Year', icon: 'FileCheck' },
      { title: 'Water Dispenser Service', slug: 'water-dispenser', price: 'Quote-based', icon: 'GlassWater' },
      { title: 'Refrigerator Service', slug: 'refrigerator-service', price: 'Quote-based', icon: 'Refrigerator' }
    ];

    for (const s of services) {
      const { error } = await supabase.from('services').upsert(s, { onConflict: 'slug' });
      if (error) console.error(`Error inserting ${s.title}:`, error);
    }
    console.log('Services seeded successfully');
    
  } catch (err) {
    console.error('Seeding failed', err);
  }
};

seed();
