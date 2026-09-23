'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Phone,
  CheckCircle2,
  Award,
  CheckCircle,
  ArrowRight,
  PhoneCall,
  CalendarCheck,
  Snowflake,
  ArrowDown,
  Loader2,
  Search,
  Wrench,
  Hammer,
  PackageMinus,
  Droplets,
  Settings,
  Gauge,
  Pipette,
  Zap,
  ShieldCheck,
  FileCheck,
  GlassWater,
  Refrigerator,
  Building2,
  GraduationCap,
  Store,
  Scissors,
  Users,
  Briefcase,
  ClipboardList,
  Activity,
  MessageSquare,
  FileText,
  HardHat,
  Target,
  Eye,
} from 'lucide-react';
import { COMPANY, SERVICES, WHY_CHOOSE_US, SERVICE_METHODOLOGY, CLIENT_SEGMENTS, AMC_DETAILS, AC_TYPES, TIME_SLOTS, REGIONS, PROPERTY_TYPES } from '@/lib/constants';
import { supabase, generateBookingId } from '@/lib/supabase';

/* ─── Icon map for dynamic icon rendering (avoids import *) ──────────── */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Wrench,
  Hammer,
  PackageMinus,
  Droplets,
  Settings,
  Gauge,
  Pipette,
  Zap,
  ShieldCheck,
  FileCheck,
  GlassWater,
  Refrigerator,
  Building2,
  GraduationCap,
  Store,
  Scissors,
  Users,
  Briefcase,
  PhoneCall,
  ClipboardList,
  Activity,
  MessageSquare,
  CheckCircle,
  FileText,
  HardHat,
  Award,
  Target,
  Eye,
  Check: CheckCircle,
};

function DIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className={className} /> : <CheckCircle className={className} />;
}

export default function HomePage() {
  const primaryServices = SERVICES.slice(0, 6);

  // ── Booking form state ──────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [formData, setFormData] = useState({
    serviceId: '',
    acType: '',
    units: 1,
    problemDescription: '',
    scheduledDate: '',
    timeSlot: '',
    region: '',
    propertyType: '',
    fullAddress: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const id = await generateBookingId();
      const serviceTitle = SERVICES.find(s => s.id === formData.serviceId)?.title || formData.serviceId;
      const { error } = await supabase.from('bookings').insert({
        id,
        service_package: serviceTitle,
        appliance: formData.acType,
        unit_count: Number(formData.units),
        symptoms_notes: formData.problemDescription,
        scheduled_date: formData.scheduledDate,
        time_slot: formData.timeSlot,
        region: formData.region,
        property_type: formData.propertyType,
        address: formData.fullAddress,
        customer_name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
      });
      if (error) throw error;
      setBookingSuccess(id);
      setFormData({ serviceId: '', acType: '', units: 1, problemDescription: '', scheduledDate: '', timeSlot: '', region: '', propertyType: '', fullAddress: '', customerName: '', customerPhone: '', customerEmail: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error creating booking: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToBooking = () => {
    document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          Section 1: HERO — Modern industrial look with HVAC background
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden py-20 lg:py-32">
        {/* Background image + dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=2000"
            alt="Professional HVAC engineer servicing an air conditioning unit"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/60 to-brand-cyan/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-3/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-cyan-400 mb-6">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Engineering-Led HVAC Service • Kot Lakhpat, Lahore
            </div>

            {/* PCS Logo */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <Image
                src="/logo.png"
                alt="Prime Cooling Solutions logo"
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Professional HVAC Solutions<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Built for Reliability.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Engineering-led air conditioning installation, maintenance &amp; repair services for commercial &amp; residential premises across Lahore.
            </p>

            {/* 3 CTAs */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <button
                onClick={scrollToBooking}
                aria-label="Book a service — scroll to booking form"
                className="px-8 py-4 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-bold text-lg shadow-glow-cyan transition-all flex items-center gap-3"
              >
                <CalendarCheck className="w-6 h-6" aria-hidden="true" />
                Book Service
              </button>
              <a
                href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
                aria-label={`Call us at ${COMPANY.phone}`}
                className="px-6 py-4 rounded-md bg-transparent border-2 border-slate-700 hover:border-cyan-500 text-white font-semibold transition-all text-center flex items-center gap-2"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="px-6 py-4 rounded-md bg-green-600 hover:bg-green-500 border-2 border-green-600 hover:border-green-500 text-white font-semibold transition-all text-center flex items-center gap-2"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                WhatsApp
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-400 justify-center lg:justify-start">
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-400 w-5 h-5" aria-hidden="true" /> 4+ Years Experience</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-400 w-5 h-5" aria-hidden="true" /> Engineering-Led</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-400 w-5 h-5" aria-hidden="true" /> Documented Service</span>
            </div>
          </div>

          {/* Hero right side — Stats card */}
          <div className="lg:w-2/5 w-full max-w-md">
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                <Snowflake className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Need AC Service?</h3>
              <p className="text-slate-400 mb-6">Schedule a professional inspection in under 2 minutes</p>

              {/* Trust stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-cyan-400">4+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Years</div>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-teal-400">500+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Jobs</div>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-400">13</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Services</div>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-cyan-400">10</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">AMC Visits/Yr</div>
                </div>
              </div>
              <button
                onClick={scrollToBooking}
                aria-label="Scroll down to book a service"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-5 h-5" aria-hidden="true" />
                Book Service Below
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 2: SERVICES OVERVIEW
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Professional HVAC Services</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Expert care for your cooling systems, backed by engineering standards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {primaryServices.map((service) => (
              <div key={service.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col h-full group">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <DIcon name={service.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{service.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{service.priceText}</span>
                  <button onClick={scrollToBooking} aria-label={`Book ${service.title}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1">
                    Book Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              View All Services <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 3: WHY CHOOSE US
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Prime Cooling Solutions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our commitment to engineering excellence sets us apart.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE_US.map((reason, i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-500">
                    <DIcon name={reason.icon} className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{reason.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 4: AMC HIGHLIGHT
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6 w-fit">
                  <Award className="w-4 h-4" aria-hidden="true" /> Highly Recommended for Businesses
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Annual Maintenance Contract</h2>
                <p className="text-slate-300 mb-8 text-lg">Year-round peace of mind. We take full responsibility for your cooling infrastructure.</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-extrabold text-cyan-400">Rs. 9,999</span>
                  <span className="text-slate-400 font-medium">/ AC / Year</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-teal-400 w-5 h-5" aria-hidden="true" /> {AMC_DETAILS.pmVisits} Preventive Maintenance Visits</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-teal-400 w-5 h-5" aria-hidden="true" /> Up to {AMC_DETAILS.breakdownVisits} Breakdown Response Visits</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-teal-400 w-5 h-5" aria-hidden="true" /> Documented Service Reports</li>
                </ul>
                <div>
                  <Link href="/amc" aria-label="Learn more about Annual Maintenance Contract" className="inline-flex items-center gap-2 bg-white text-brand-navy px-6 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors">
                    Learn More About AMC <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative bg-slate-800/50">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 5: SERVICE METHODOLOGY
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Service Methodology</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">A systematic, documented approach to every job.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-2 relative z-10">
              {SERVICE_METHODOLOGY.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold mb-3 shadow-sm relative z-10">
                    {step.step}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h4>
                  <DIcon name={step.icon} className="w-4 h-4 text-slate-400 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 6: CLIENT SEGMENTS (Industries We Serve)
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Industries We Serve</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CLIENT_SEGMENTS.map((segment, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl text-center border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-colors">
                <DIcon name={segment.icon} className="w-8 h-8 mx-auto text-teal-500 mb-4" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{segment.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 7: BOOKING FORM — Full inline booking
          (Placed AFTER Services/Projects/Clients so customer trusts first)
         ═══════════════════════════════════════════════════════════ */}
      <section id="book-now" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-medium mb-4">
              <CalendarCheck className="w-4 h-4" aria-hidden="true" /> Online Booking
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Book Your Service</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Fill the form below to schedule professional HVAC service. We&apos;ll confirm your booking within 30 minutes.
            </p>
          </div>

          {bookingSuccess ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Booking Confirmed!</h3>
              <p className="text-green-700 dark:text-green-400 mb-4">Your Reference ID: <span className="font-mono font-bold text-lg">{bookingSuccess}</span></p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">We&apos;ll contact you shortly on WhatsApp to confirm details.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/track`} aria-label="Track your booking status" className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-md transition-colors inline-flex items-center gap-2">
                  <Search className="w-4 h-4" aria-hidden="true" /> Track Booking
                </Link>
                <button onClick={() => setBookingSuccess('')} aria-label="Book another service" className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Book Another Service
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6">
              {/* Row 1: Service + AC Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="serviceId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Required *</label>
                  <select required id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select a Service --</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title} — {s.priceText}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="acType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AC Type *</label>
                  <select required id="acType" name="acType" value={formData.acType} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Type --</option>
                    {AC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Units + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="units" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Units *</label>
                  <input type="number" required min="1" max="20" id="units" name="units" value={formData.units} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Date *</label>
                  <input type="date" required id="scheduledDate" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
              </div>

              {/* Row 3: Time Slot + Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="timeSlot" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time Slot *</label>
                  <select required id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Time --</option>
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Area / Region *</label>
                  <select required id="region" name="region" value={formData.region} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Area --</option>
                    {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 4: Property Type + Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Type *</label>
                  <select required id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Type --</option>
                    {PROPERTY_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="fullAddress" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Address *</label>
                  <input type="text" required id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} placeholder="Street, House/Office No, Landmark" className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
              </div>

              {/* Row 5: Name + Phone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input type="text" required id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                  <input type="tel" required id="customerPhone" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="03XXXXXXXXX" className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Optional)</label>
                  <input type="email" id="customerEmail" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label htmlFor="problemDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Problem Description (Optional)</label>
                <textarea id="problemDescription" name="problemDescription" value={formData.problemDescription} onChange={handleChange} rows={3} placeholder="Briefly describe the issue..." className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                aria-label={submitting ? 'Submitting your booking' : 'Confirm your booking'}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-bold text-lg rounded-md shadow-glow-cyan transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Submitting...</>
                ) : (
                  <><CalendarCheck className="w-5 h-5" aria-hidden="true" /> Confirm Booking</>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                By booking, you agree to be contacted via WhatsApp/Phone. Working hours: Mon–Sat 9AM–7PM.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 8: CTA BANNER
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-navy" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Schedule an Inspection?</h2>
          <p className="text-xl text-slate-300 mb-10">Experience the difference of an engineering-led service team.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={scrollToBooking} aria-label="Book an online service now" className="w-full sm:w-auto px-8 py-4 rounded-md bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold text-lg shadow-glow-cyan transition-all">
              Book Online Now
            </button>
            <span className="text-slate-400 font-medium">or</span>
            <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} aria-label={`Call us at ${COMPANY.phone}`} className="w-full sm:w-auto px-8 py-4 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition-colors border border-slate-700 flex items-center justify-center gap-2">
              <PhoneCall className="w-5 h-5" aria-hidden="true" /> {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
