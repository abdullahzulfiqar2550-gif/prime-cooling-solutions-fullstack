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
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Premium 3D HVAC visual with floating glass cards
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden min-h-[600px] lg:min-h-[680px]">
        {/* Layer 1: Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Prime Cooling Solutions HVAC engineering team at a modern commercial building"
            fill
            className="object-cover object-center"
            priority
            quality={85}
          />
          {/* Left-to-right gradient overlay — dark left for text contrast, visible right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(3,20,40,0.94) 0%, rgba(3,25,48,0.85) 30%, rgba(3,25,48,0.50) 60%, rgba(3,25,48,0.20) 100%)',
            }}
          />
          {/* Subtle cyan atmospheric glow on right */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* Floating snowflake particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <Snowflake className="absolute top-[12%] left-[8%] w-4 h-4 text-cyan-400/15 animate-float" />
          <Snowflake className="absolute top-[22%] right-[18%] w-3 h-3 text-cyan-300/10 animate-float-slow" />
          <Snowflake className="absolute bottom-[25%] left-[22%] w-5 h-5 text-teal-400/8 animate-float-reverse" />
          <Snowflake className="absolute top-[45%] right-[38%] w-3 h-3 text-cyan-400/10 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-4 py-16 lg:py-20">

          {/* ── LEFT: Hero Content ── */}
          <div className="lg:w-[52%] w-full text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(80,210,255,0.45)] text-[13px] font-medium tracking-wide mb-8"
              style={{ background: 'rgba(5,30,55,0.55)', backdropFilter: 'blur(12px)' }}>
              <Shield className="w-4 h-4 text-[#08D9E8]" aria-hidden="true" />
              <span className="text-[#08D9E8]">ENGINEERING-LED HVAC SERVICE • LAHORE</span>
            </div>

            {/* Heading */}
            <h1 className="text-[42px] md:text-[56px] lg:text-[66px] font-extrabold leading-[1.0] tracking-tight mb-6">
              Professional AC<br />
              Service<br />
              <span className="text-[#08D9E8]">&amp; HVAC Solutions</span>
            </h1>

            {/* Description */}
            <p className="text-[17px] md:text-[18px] text-[#D7E5F2] mb-8 max-w-[540px] leading-relaxed mx-auto lg:mx-0">
              Reliable installation, repair &amp; maintenance for homes and businesses across Lahore.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              <button
                onClick={scrollToBooking}
                aria-label="Book a service"
                className="group px-8 py-4 rounded-xl font-bold text-[17px] text-[#061B32] flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                style={{ background: 'linear-gradient(135deg, #08D9E8, #00D4E6)' }}
              >
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
                Book Service
              </button>
              <a
                href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
                aria-label={`Call us at ${COMPANY.phone}`}
                className="group px-7 py-4 rounded-xl font-semibold text-[17px] text-white flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#08D9E8]"
                style={{
                  background: 'rgba(5,30,55,0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(100,200,255,0.5)',
                }}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call Now
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-[15px] font-medium text-[#D7E5F2]/80 justify-center lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-[18px] h-[18px] text-[#08D9E8]" aria-hidden="true" />
                Professional
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-[18px] h-[18px] text-[#08D9E8]" aria-hidden="true" />
                Fast Response
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-[18px] h-[18px] text-[#08D9E8]" aria-hidden="true" />
                Reliable Service
              </span>
            </div>
          </div>

          {/* ── RIGHT: 3D AC Visual + Floating Cards ── */}
          <div className="lg:w-[48%] w-full max-w-[520px] relative hidden md:block" style={{ perspective: '1200px' }}>
            {/* Cyan atmospheric glow behind AC */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 bg-[#08D9E8]/8 rounded-full blur-[80px] animate-glow-pulse" />
            </div>

            {/* 3D AC Unit */}
            <div className="relative mx-auto w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 animate-float" style={{ animationDuration: '5s' }}>
              {/* AC outer frame — glass panel */}
              <div className="absolute inset-0 rounded-2xl border border-[rgba(80,210,255,0.4)] shadow-[0_0_30px_rgba(8,217,232,0.15)]"
                style={{ background: 'rgba(5,30,55,0.45)', backdropFilter: 'blur(15px)' }}>

                {/* AC inner body */}
                <div className="absolute inset-4 bg-gradient-to-b from-slate-600/70 to-slate-700/70 rounded-xl border border-slate-500/30">
                  {/* Vents */}
                  <div className="absolute top-5 left-5 right-5 space-y-2.5">
                    {[0.4, 0.3, 0.4, 0.3, 0.2].map((opacity, i) => (
                      <div key={i} className="h-[3px] rounded-full" style={{ background: `rgba(148,163,184,${opacity})` }} />
                    ))}
                  </div>

                  {/* Snowflake logo center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(8,217,232,0.1)' }}>
                      <Snowflake className="w-7 h-7 text-[#08D9E8]/50 animate-spin-slow" />
                    </div>
                  </div>

                  {/* PCS logo inside AC */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4">
                    <Image src="/logo.png" alt="Prime Cooling Solutions" width={28} height={28} className="opacity-40" />
                  </div>
                </div>

                {/* Bottom dashboard panel */}
                <div className="absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl px-4 py-2 flex items-center justify-between"
                  style={{ background: 'rgba(5,25,50,0.7)', borderTop: '1px solid rgba(80,210,255,0.25)' }}>
                  {/* Temperature */}
                  <div>
                    <div className="text-2xl font-bold text-[#08D9E8] font-mono leading-none">22°C</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Set Temp</div>
                  </div>
                  {/* Status */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
                      <span className="text-[10px] text-slate-300 font-medium">COOLING</span>
                    </div>
                    <div className="text-[10px] text-[#08D9E8]/60 font-bold tracking-widest mt-1">PRIME COOLING</div>
                  </div>
                </div>
              </div>

              {/* Airflow particles rising from AC */}
              {[
                { left: '25%', delay: '0s', dur: '3s' },
                { left: '35%', delay: '0.5s', dur: '4s' },
                { left: '45%', delay: '1s', dur: '3.5s' },
                { left: '60%', delay: '1.5s', dur: '4.5s' },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-[#08D9E8]/30"
                  style={{ left: p.left, animation: `particle-drift ${p.dur} ease-in-out infinite ${p.delay}` }}
                />
              ))}
            </div>

            {/* ── Floating Glass Card: AC SERVICE (top-right) ── */}
            <div className="absolute -top-4 right-0 lg:-right-8 animate-float-slow z-20" style={{ animationDelay: '0.5s' }}>
              <div className="rounded-xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                style={{
                  background: 'rgba(5,30,55,0.55)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(80,210,255,0.45)',
                }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(8,217,232,0.15)' }}>
                    <Snowflake className="w-4.5 h-4.5 text-[#08D9E8]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-white">AC SERVICE</div>
                    <div className="text-[10px] text-[#D7E5F2]/60">Professional Cooling Care</div>
                  </div>
                </div>
                <button onClick={scrollToBooking} className="mt-2 text-[11px] text-[#08D9E8] font-semibold flex items-center gap-1 hover:text-cyan-300 transition-colors">
                  Book Now <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ── Floating Glass Card: MAINTENANCE (mid-right) ── */}
            <div className="absolute top-[55%] -right-6 lg:-right-12 animate-float z-20 hidden lg:block" style={{ animationDelay: '1.5s' }}>
              <div className="rounded-xl px-3.5 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                style={{
                  background: 'rgba(5,30,55,0.55)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(80,210,255,0.45)',
                }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(8,217,232,0.15)' }}>
                    <Wrench className="w-4 h-4 text-[#08D9E8]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">MAINTENANCE</div>
                    <div className="text-[9px] text-[#D7E5F2]/60">AMC Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Floating Glass Card: FAST RESPONSE (bottom-center) ── */}
            <div className="absolute -bottom-8 left-[15%] animate-float-reverse z-20" style={{ animationDelay: '1s' }}>
              <div className="rounded-xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                style={{
                  background: 'rgba(5,30,55,0.55)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(80,210,255,0.45)',
                }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                    <Zap className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-white">FAST RESPONSE</div>
                    <div className="text-[10px] text-[#D7E5F2]/60">Lahore-Wide Service</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Brand watermark (subtle) ── */}
            <div className="absolute top-[10%] right-[5%] pointer-events-none opacity-10 hidden lg:block">
              <Image src="/logo.png" alt="" width={90} height={90} className="opacity-60" />
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
