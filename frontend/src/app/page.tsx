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
  Trash2,
  Receipt,
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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [invoiceData, setInvoiceData] = useState<{
    id: string;
    services: { title: string; price: string; amount: number }[];
    total: number;
    hasQuoteBased: boolean;
    customerName: string;
    date: string;
  } | null>(null);

  const [formData, setFormData] = useState({
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

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Calculate invoice totals
  const getSelectedServiceDetails = () => {
    return selectedServices.map(id => {
      const svc = SERVICES.find(s => s.id === id);
      return svc ? {
        title: svc.title,
        price: svc.priceText,
        amount: svc.priceNumeric * Number(formData.units || 1),
        unitPrice: svc.priceNumeric,
        isQuoteBased: svc.priceNumeric === 0,
      } : null;
    }).filter(Boolean) as { title: string; price: string; amount: number; unitPrice: number; isQuoteBased: boolean }[];
  };

  const invoiceItems = getSelectedServiceDetails();
  const fixedTotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const hasQuoteBased = invoiceItems.some(item => item.isQuoteBased);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await generateBookingId();
      const serviceTitles = selectedServices.map(sid => SERVICES.find(s => s.id === sid)?.title || sid).join(' + ');
      const { error } = await supabase.from('bookings').insert({
        id,
        service_package: serviceTitles,
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
      // Build invoice data
      setInvoiceData({
        id,
        services: invoiceItems.map(item => ({ title: item.title, price: item.price, amount: item.amount })),
        total: fixedTotal,
        hasQuoteBased,
        customerName: formData.customerName,
        date: formData.scheduledDate,
      });
      setBookingSuccess(id);
      setSelectedServices([]);
      setFormData({ acType: '', units: 1, problemDescription: '', scheduledDate: '', timeSlot: '', region: '', propertyType: '', fullAddress: '', customerName: '', customerPhone: '', customerEmail: '' });
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

  // ── Quick booking form (hero sidebar) ─────────────────────
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickService, setQuickService] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState('');

  const handleQuickBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickSubmitting(true);
    try {
      const id = await generateBookingId();
      const serviceTitle = SERVICES.find(s => s.id === quickService)?.title || quickService;
      const { error } = await supabase.from('bookings').insert({
        id,
        service_package: serviceTitle,
        customer_name: quickName,
        phone: quickPhone,
        symptoms_notes: quickMessage || null,
        appliance: 'split',
        unit_count: 1,
        time_slot: 'morning',
        region: 'kot_lakhpat',
        address: 'To be confirmed',
      });
      if (error) throw error;
      setQuickSuccess(id);
      setQuickName(''); setQuickPhone(''); setQuickService(''); setQuickMessage('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error: ${message}`);
    } finally {
      setQuickSubmitting(false);
    }
  };

  // ── Promo config (easily toggled) ─────────────────────────
  const PROMO = { enabled: true, discount: '30%', label: 'ON AMC PACKAGES', note: 'Limited Time Offer' };

  // ── Stats (configurable business data) ────────────────────
  const STATS = [
    { value: '500+', label: 'Happy Customers', icon: '😊' },
    { value: '4.9/5', label: 'Customer Rating', icon: '⭐' },
    { value: '5+ Years', label: 'Of Experience', icon: '🏆' },
    { value: 'Lahore', label: 'Service Area', icon: '📍' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Premium HVAC Hero Section matching reference design
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Prime Cooling Solutions HVAC engineers at modern commercial building"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient overlay — dark left for text readability, lighter right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(100deg, rgba(6,26,47,0.92) 0%, rgba(6,26,47,0.80) 35%, rgba(6,26,47,0.45) 55%, rgba(6,26,47,0.25) 75%, rgba(6,26,47,0.40) 100%)',
            }}
          />
        </div>

        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">

            {/* ── LEFT COLUMN: Content ── */}
            <div className="lg:w-[55%] w-full">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: 'rgba(0,212,232,0.08)', border: '1px solid rgba(0,212,232,0.35)', backdropFilter: 'blur(8px)' }}>
                <Snowflake className="w-4 h-4 text-[#00D4E8]" />
                <span className="text-[13px] font-medium">
                  <span className="text-[#00D4E8]">Your Comfort</span>
                  <span className="text-white/40 mx-2">•</span>
                  <span className="text-white/90">Our Priority</span>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[38px] sm:text-[48px] md:text-[56px] lg:text-[62px] font-extrabold leading-[1.05] tracking-tight mb-5">
                Professional AC<br />
                Service &amp;<br />
                <span className="text-[#00D4E8]">HVAC Solutions</span>
              </h1>

              {/* Description */}
              <p className="text-[15px] md:text-[16px] text-white/75 mb-8 max-w-[500px] leading-relaxed">
                Stay cool, stay comfortable! We provide expert AC installation,
                repair and maintenance for homes and businesses across Lahore.
                Fast, reliable and affordable service — always.
              </p>

              {/* Service Features Row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { icon: <Hammer className="w-5 h-5" />, title: 'AC Installation', sub: '(All Brands)' },
                  { icon: <Wrench className="w-5 h-5" />, title: 'AC Repair', sub: '(All Types)' },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: 'AMC Service', sub: '(Annual Maintenance)' },
                  { icon: <Building2 className="w-5 h-5" />, title: 'Commercial &', sub: 'Residential' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00D4E8]/15 border border-[#00D4E8]/30 flex items-center justify-center text-[#00D4E8]">
                      {feat.icon}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{feat.title}</div>
                      <div className="text-[11px] text-white/50">{feat.sub}</div>
                    </div>
                    {i < 3 && <div className="hidden md:block w-px h-8 bg-white/10 ml-3" />}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={scrollToBooking}
                  aria-label="Book a service"
                  className="group px-7 py-3.5 rounded-lg font-bold text-[15px] text-[#061A2F] flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30"
                  style={{ background: 'linear-gradient(135deg, #00D4E8, #00C4D6)' }}
                >
                  <CalendarCheck className="w-4.5 h-4.5" /> Book Service Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
                  className="px-7 py-3.5 rounded-lg font-semibold text-[15px] text-white flex items-center gap-2 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'rgba(6,26,47,0.5)', border: '1px solid rgba(0,212,232,0.4)', backdropFilter: 'blur(8px)' }}
                >
                  <Phone className="w-4.5 h-4.5 text-[#00D4E8]" /> Call Now
                </a>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-5 text-[13px] text-white/60">
                {['Experienced Technicians', 'Genuine Parts', 'On-Time Service', 'Affordable Rates'].map((point, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00D4E8]" /> {point}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: AC Visual + Booking Form ── */}
            <div className="lg:w-[45%] w-full relative">
              {/* Promo Badge */}
              {PROMO.enabled && (
                <div className="absolute -top-2 right-0 lg:right-4 z-20 hidden md:block">
                  <div className="bg-[#00D4E8] text-[#061A2F] px-4 py-3 rounded-xl text-center shadow-lg shadow-cyan-500/20">
                    <div className="text-[11px] font-bold uppercase tracking-wider">UP TO</div>
                    <div className="text-[32px] font-black leading-none">
                      {PROMO.discount}<span className="text-[16px] align-top">OFF</span>
                    </div>
                  </div>
                  <div className="bg-[#061A2F] text-white px-3 py-2 rounded-b-lg text-center -mt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider">{PROMO.label}</div>
                    <div className="text-[9px] text-white/60 italic">{PROMO.note}</div>
                  </div>
                </div>
              )}

              {/* AC Image with Floating Cards */}
              <div className="relative hidden md:block mb-4">
                {/* AC Image */}
                <div className="relative animate-float" style={{ animationDuration: '6s' }}>
                  <Image
                    src="/hero-ac.png"
                    alt="Premium wall-mounted split AC unit with smart cooling display"
                    width={500}
                    height={400}
                    className="w-full max-w-[480px] h-auto drop-shadow-2xl mx-auto"
                    priority
                  />
                </div>

                {/* Floating Card: 22°C */}
                <div className="absolute top-[15%] left-[5%] animate-float-slow z-10"
                  style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                    style={{ background: 'rgba(6,26,47,0.75)', border: '1px solid rgba(0,212,232,0.3)', backdropFilter: 'blur(12px)' }}>
                    <div className="w-8 h-8 rounded-full bg-[#00D4E8]/20 flex items-center justify-center">
                      <Snowflake className="w-4 h-4 text-[#00D4E8]" />
                    </div>
                    <div>
                      <div className="text-[18px] font-bold text-white">22°C</div>
                      <div className="text-[10px] text-white/60">Perfect Cooling</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card: AMC */}
                <div className="absolute top-[10%] right-[2%] animate-float z-10"
                  style={{ animationDuration: '5.5s', animationDelay: '1s' }}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                    style={{ background: 'rgba(6,26,47,0.75)', border: '1px solid rgba(0,212,232,0.3)', backdropFilter: 'blur(12px)' }}>
                    <div className="w-8 h-8 rounded-full bg-[#00D4E8]/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#00D4E8]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-white">AMC Available</div>
                      <div className="text-[10px] text-white/60">Stay Worry Free</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card: Fast Response */}
                <div className="absolute bottom-[20%] right-[5%] animate-float-reverse z-10"
                  style={{ animationDuration: '4.5s', animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                    style={{ background: 'rgba(6,26,47,0.75)', border: '1px solid rgba(0,212,232,0.3)', backdropFilter: 'blur(12px)' }}>
                    <div className="w-8 h-8 rounded-full bg-[#00D4E8]/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[#00D4E8]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-white">Fast Response</div>
                      <div className="text-[10px] text-white/60">Within 24 Hours</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Message */}
                <div className="absolute bottom-[5%] left-[20%] z-10 pointer-events-none">
                  <p className="text-white/20 text-[22px] italic" style={{ fontFamily: "'Georgia', serif" }}>
                    &ldquo;Cooler Spaces<br />Better Lives&rdquo;
                  </p>
                </div>
              </div>

              {/* Quick Service Booking Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-5 lg:absolute lg:top-[8%] lg:right-0 lg:w-[280px] xl:w-[300px] z-20">
                {quickSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-[16px] font-bold text-[#061A2F] mb-1">Booking Confirmed!</h4>
                    <p className="text-[13px] text-slate-500 mb-2">Ref: <span className="font-mono font-bold">{quickSuccess}</span></p>
                    <button onClick={() => setQuickSuccess('')} className="text-[13px] text-[#00D4E8] font-semibold hover:underline">Book Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleQuickBooking}>
                    <h3 className="text-[16px] font-bold text-[#061A2F] mb-1">Quick Service Booking</h3>
                    <p className="text-[11px] text-slate-500 mb-4">Fill in your details and we&apos;ll get back to you</p>
                    <div className="space-y-3">
                      <input
                        type="text" required placeholder="Full Name" value={quickName} onChange={e => setQuickName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-[#061A2F] placeholder-slate-400 focus:ring-2 focus:ring-[#00D4E8] focus:outline-none"
                      />
                      <input
                        type="tel" required placeholder="Phone Number" value={quickPhone} onChange={e => setQuickPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-[#061A2F] placeholder-slate-400 focus:ring-2 focus:ring-[#00D4E8] focus:outline-none"
                      />
                      <select
                        required value={quickService} onChange={e => setQuickService(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-[#061A2F] focus:ring-2 focus:ring-[#00D4E8] focus:outline-none"
                      >
                        <option value="">Service Required</option>
                        {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </select>
                      <textarea
                        placeholder="Your Message (Optional)" value={quickMessage} onChange={e => setQuickMessage(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-[#061A2F] placeholder-slate-400 focus:ring-2 focus:ring-[#00D4E8] focus:outline-none resize-none"
                      />
                      <button
                        type="submit" disabled={quickSubmitting}
                        className="w-full py-3 bg-[#00D4E8] hover:bg-[#00bdd0] text-[#061A2F] font-bold text-[14px] rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {quickSubmitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                        ) : (
                          <>Book Now <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> We respect your privacy
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics Bar */}
        <div className="relative z-10 bg-[#061A2F]/90 border-t border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap justify-between items-center gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <div className="text-[22px] font-extrabold text-white">{stat.value}</div>
                    <div className="text-[12px] text-white/50">{stat.label}</div>
                  </div>
                  {i < STATS.length - 1 && <div className="hidden lg:block w-px h-10 bg-white/10 ml-6" />}
                </div>
              ))}
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

          {bookingSuccess && invoiceData ? (
            /* ── INVOICE / CONFIRMATION ── */
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-bold">Booking Invoice</h3>
                      <p className="text-cyan-100 text-sm">Prime Cooling Solutions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg">{invoiceData.id}</div>
                    <div className="text-cyan-100 text-sm">{invoiceData.date}</div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-sm text-slate-500 dark:text-slate-400">Bill To</div>
                <div className="font-semibold text-slate-900 dark:text-white">{invoiceData.customerName}</div>
              </div>

              {/* Service Items */}
              <div className="px-6 py-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2">Service</th>
                      <th className="pb-2 text-right">Rate</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.services.map((svc, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <td className="py-3 text-sm font-medium text-slate-900 dark:text-white">{svc.title}</td>
                        <td className="py-3 text-sm text-right text-slate-600 dark:text-slate-400">{svc.price}</td>
                        <td className="py-3 text-sm text-right font-semibold text-slate-900 dark:text-white">
                          {svc.amount > 0 ? `Rs. ${svc.amount.toLocaleString()}` : 'Quote-based'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    Rs. {invoiceData.total.toLocaleString()}
                    {invoiceData.hasQuoteBased && ' + Quote'}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  Payment Method: <span className="font-bold">Cash on Delivery</span>
                </div>
                {invoiceData.hasQuoteBased && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    * Quote-based services will be assessed on-site. Final price confirmed before work begins.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-5 flex flex-col sm:flex-row gap-3">
                <Link href="/track" className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-md transition-colors text-center inline-flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Track Booking
                </Link>
                <button onClick={() => { setBookingSuccess(''); setInvoiceData(null); }} className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center">
                  Book Another Service
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6">
              {/* Row 1: Multi-Select Services */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Services * <span className="text-xs text-slate-500">(Select multiple)</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                  {SERVICES.map(svc => (
                    <label
                      key={svc.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedServices.includes(svc.id)
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-1 ring-cyan-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(svc.id)}
                        onChange={() => toggleService(svc.id)}
                        className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{svc.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{svc.priceText}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live Invoice Preview */}
              {selectedServices.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-cyan-200 dark:border-cyan-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Invoice Preview</h4>
                    <span className="text-xs text-slate-500 ml-auto">{selectedServices.length} service(s)</span>
                  </div>
                  <div className="space-y-2">
                    {invoiceItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-slate-700 dark:text-slate-300 truncate">{item.title}</span>
                          {Number(formData.units) > 1 && !item.isQuoteBased && (
                            <span className="text-xs text-slate-500">×{formData.units}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                            {item.isQuoteBased ? 'Quote' : `Rs. ${item.amount.toLocaleString()}`}
                          </span>
                          <button type="button" onClick={() => toggleService(SERVICES[i]?.id || '')} className="text-red-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">Estimated Total</span>
                    <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                      Rs. {fixedTotal.toLocaleString()}{hasQuoteBased ? ' + Quote' : ''}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    Payment: Cash on Delivery
                  </div>
                </div>
              )}

              {/* Row 2: AC Type + Units */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="acType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AC Type *</label>
                  <select required id="acType" name="acType" value={formData.acType} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Type --</option>
                    {AC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="units" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Units *</label>
                  <input type="number" required min="1" max="20" id="units" name="units" value={formData.units} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
              </div>

              {/* Row 3: Date + Time Slot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Date *</label>
                  <input type="date" required id="scheduledDate" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="timeSlot" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time Slot *</label>
                  <select required id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Time --</option>
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 4: Region + Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Area / Region *</label>
                  <select required id="region" name="region" value={formData.region} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Area --</option>
                    {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Type *</label>
                  <select required id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select Type --</option>
                    {PROPERTY_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 5: Address */}
              <div>
                <label htmlFor="fullAddress" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Address *</label>
                <input type="text" required id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} placeholder="Street, House/Office No, Landmark" className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
              </div>

              {/* Row 6: Name + Phone + Email */}
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
                disabled={submitting || selectedServices.length === 0}
                aria-label={submitting ? 'Submitting your booking' : 'Confirm your booking'}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-bold text-lg rounded-md shadow-glow-cyan transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Submitting...</>
                ) : (
                  <><CalendarCheck className="w-5 h-5" aria-hidden="true" /> Confirm Booking{selectedServices.length > 0 && ` — Rs. ${fixedTotal.toLocaleString()}${hasQuoteBased ? ' + Quote' : ''}`}</>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                By booking, you agree to be contacted via WhatsApp/Phone. Payment: Cash on Delivery. Working hours: Mon–Sat 9AM–7PM.
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
