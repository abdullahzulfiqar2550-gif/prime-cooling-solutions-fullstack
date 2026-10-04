// ─────────────────────────────────────────────────────────────
// Homepage content: Customer Reviews + Areas We Serve
// Edit this single file to update reviews, summary figures and areas.
// ─────────────────────────────────────────────────────────────

export interface Review {
  name: string;
  location: string;
  rating: number; // 1–5
  service: string;
  review: string;
}

export interface ServiceArea {
  name: string;
  city: string;
  slug: string;
  seoTitle: string;
  description: string;
  services: string[];
}

// REPLACE THESE DEMO REVIEWS WITH VERIFIED CUSTOMER REVIEWS
// These are placeholder examples only — they are NOT real customer testimonials.
// Set REVIEWS_ARE_DEMO to false once every entry below is a verified review.
export const REVIEWS_ARE_DEMO = true;

export const REVIEWS: Review[] = [
  {
    name: 'Muhammad Usman',
    location: 'Model Town, Lahore',
    rating: 5,
    service: 'AC Repair',
    review:
      'Excellent AC service. The technician arrived on time, properly checked the AC and fixed the cooling problem. Very professional service.',
  },
  {
    name: 'Ali Raza',
    location: 'Johar Town, Lahore',
    rating: 5,
    service: 'AC Maintenance',
    review:
      'Very satisfied with the AC maintenance service. The team was professional and explained everything clearly. My AC is working much better now.',
  },
  {
    name: 'Hamza Ahmed',
    location: 'Gulberg, Lahore',
    rating: 4,
    service: 'AC Repair',
    review:
      'I booked AC repair service and received a quick response. The technician diagnosed the issue and completed the work efficiently.',
  },
  {
    name: 'Ayesha Khan',
    location: 'Faisal Town, Lahore',
    rating: 5,
    service: 'AC Maintenance',
    review:
      'Good service and reasonable charges. The technician arrived at the scheduled time and completed the maintenance professionally.',
  },
  {
    name: 'Bilal Hassan',
    location: 'Kot Lakhpat, Lahore',
    rating: 5,
    service: 'AC Repair',
    review:
      'I contacted Prime Cooling Solutions for AC repair and was impressed with the response time and service quality.',
  },
  {
    name: 'Omar Farooq',
    location: 'CBD, Lahore',
    rating: 5,
    service: 'HVAC Service',
    review: 'Professional team and good communication throughout the service. Very satisfied with the service.',
  },
];

// PLACEHOLDER FIGURES — replace with verified business numbers.
export const REVIEW_SUMMARY = {
  rating: '4.9/5',
  ratingValue: 4.9,
  ratingLabel: 'Customer Rating',
  customers: '500+',
  customersLabel: 'Happy Customers',
};

// Service areas — keep in sync with REGIONS in lib/constants.ts.
export const SERVICE_AREAS: ServiceArea[] = [
  {
    name: 'Model Town',
    city: 'Lahore',
    slug: 'model_town',
    seoTitle: 'AC Repair in Model Town Lahore',
    description: 'AC repair, installation and maintenance services.',
    services: ['AC Repair', 'AC Installation', 'Maintenance'],
  },
  {
    name: 'Johar Town',
    city: 'Lahore',
    slug: 'johar_town',
    seoTitle: 'AC Service in Johar Town Lahore',
    description: 'Fast residential AC repair and maintenance.',
    services: ['AC Repair', 'Maintenance'],
  },
  {
    name: 'Gulberg',
    city: 'Lahore',
    slug: 'gulberg',
    seoTitle: 'AC Repair in Gulberg Lahore',
    description: 'Residential and commercial HVAC solutions.',
    services: ['AC Repair', 'HVAC', 'AMC'],
  },
  {
    name: 'Faisal Town',
    city: 'Lahore',
    slug: 'faisal_town',
    seoTitle: 'AC Service in Faisal Town Lahore',
    description: 'AC installation, repair and maintenance.',
    services: ['AC Installation', 'AC Repair', 'Maintenance'],
  },
  {
    name: 'Kot Lakhpat',
    city: 'Lahore',
    slug: 'kot_lakhpat',
    seoTitle: 'AC Repair in Kot Lakhpat Lahore',
    description: 'Professional AC repair and maintenance — home of our workshop.',
    services: ['AC Repair', 'Maintenance', 'AMC'],
  },
  {
    name: 'CBD Lahore',
    city: 'Lahore',
    slug: 'cbd',
    seoTitle: 'HVAC Services in CBD Lahore',
    description: 'Commercial HVAC and maintenance solutions.',
    services: ['Commercial HVAC', 'AMC', 'Maintenance'],
  },
  {
    name: 'DHA',
    city: 'Lahore',
    slug: 'dha',
    seoTitle: 'AC Service in DHA Lahore',
    description: 'AC servicing, repair and preventive maintenance.',
    services: ['AC Service', 'AC Repair', 'Maintenance'],
  },
];
