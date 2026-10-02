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
  Star,
  MapPin,
  ThumbsUp,
} from 'lucide-react';
import { COMPANY, SERVICES, WHY_CHOOSE_US, SERVICE_METHODOLOGY, CLIENT_SEGMENTS, AMC_DETAILS, AC_TYPES, TIME_SLOTS, REGIONS, PROPERTY_TYPES } from '@/lib/constants';
import { supabase, generateBookingId } from '@/lib/supabase';

/* â”€â”€â”€ Icon map for dynamic icon rendering (avoids import *) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  // â”€â”€ Booking form state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Quick booking form (hero sidebar) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Stats (configurable business data) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const STATS = [
    { value: '500+', label: 'Happy Customers', icon: <ThumbsUp className="w-5 h-5" /> },
    { value: '4.9/5', label: 'Customer Rating', icon: <Star className="w-5 h-5" /> },
    { value: '5+ Years', label: 'Of Experience', icon: <Award className="w-5 h-5" /> },
    { value: 'Lahore', label: 'Service Area', icon: <MapPin className="w-5 h-5" /> },
  ];

  // â”€â”€ Promo config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const PROMO = { enabled: true, discount: '30%', label: 'ON AMC PACKAGES', note: 'Limited Time Offer' };

  return (
    <div className="flex flex-col min-h-screen">

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO SECTION â€” Matching reference design exactly
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: 'calc(100vh - 134px)' }}>

        {/* â”€â”€ Background Image with subtle zoom animation â”€â”€ */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Prime Cooling Solutions building with service van and HVAC technicians"
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="100vw"
            style={{ animation: 'backgroundMove 12s ease-in-out infinite alternate' }}
          />
          {/* Light gradient: dark left for text, transparent center/right so building/board/van/plants clearly visible */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, rgba(0,18,36,0.25) 0%, rgba(0,18,36,0) 30%, rgba(0,18,36,0) 70%, rgba(0,18,36,0.05) 100%)',
          }} />
        </div>

        {/* â”€â”€ Hero Content â”€â”€ */}
        <div className="absolute left-0 top-0 w-full h-full z-[10]" style={{ padding: '0 4.5%' }}>

          {/* LEFT CONTENT â€” positioned top-left */}
          <div className="absolute left-[4.5%] top-[6.5%] w-full max-w-[560px] z-[10]">

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-[22px] py-[10px] rounded-full mb-[22px] font-semibold text-[#00d9ff]"
              style={{ border: '1px solid #00d9ff', background: 'rgba(0,23,43,0.4)', backdropFilter: 'blur(8px)', animation: 'badgeGlow 3s ease-in-out infinite' }}>
              <Snowflake className="w-5 h-5" />
              <span>Your Comfort</span>
              <b className="text-white/70">â€¢</b>
              <span>Our Priority</span>
            </div>

            {/* Heading */}
            <h1 className="font-black leading-[0.98] tracking-tight mb-0" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)', letterSpacing: '-3px', textShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
              Professional AC<br />
              Service &amp;<br />
              <span className="text-[#00d8f3]" style={{ textShadow: '0 0 25px rgba(0,218,255,0.15)' }}>HVAC Solutions</span>
            </h1>

            {/* Description */}
            <p className="mt-[22px] text-[16px] leading-[1.55] max-w-[555px] text-white/95" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Stay cool, stay comfortable! We provide expert AC installation,
              repair and maintenance for homes and businesses across Lahore.
              Fast, reliable and affordable service â€” always.
            </p>

            {/* Service Features Row */}
            <div className="flex flex-wrap lg:flex-nowrap mt-[25px]">
              {[
                { icon: <Snowflake className="w-[22px] h-[22px]" />, title: 'AC Installation', sub: '(All Brands)' },
                { icon: <Wrench className="w-[22px] h-[22px]" />, title: 'AC Repair', sub: '(All Types)' },
                { icon: <ShieldCheck className="w-[22px] h-[22px]" />, title: 'AMC Service', sub: '(Annual Maintenance)' },
                { icon: <Building2 className="w-[22px] h-[22px]" />, title: 'Commercial &', sub: 'Residential' },
              ].map((feat, i) => (
                <div key={i} className={`flex flex-col gap-[7px] text-[13px] font-semibold min-w-[115px] pr-[22px] mr-[22px] ${i < 3 ? 'border-r border-white/65' : ''}`}>
                  <div className="w-[47px] h-[47px] rounded-full flex items-center justify-center text-[#00d9ff]"
                    style={{ border: '1px solid #00d9ff', background: 'rgba(0,30,55,0.55)', boxShadow: 'inset 0 0 15px rgba(0,210,255,0.12)' }}>
                    {feat.icon}
                  </div>
                  <span className="text-white">{feat.title}</span>
                  <small className="text-white/75 text-[11px] -mt-1">{feat.sub}</small>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-[22px] mt-[27px]">
              <button
                onClick={scrollToBooking}
                className="h-[58px] px-7 rounded-xl flex items-center gap-3.5 text-[16px] font-bold text-[#031e34] transition-all hover:-translate-y-1 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #00d8f3, #05c7e6)', boxShadow: '0 12px 35px rgba(0,208,239,0.25)' }}
              >
                <CalendarCheck className="w-5 h-5" />
                Book Service Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
                className="h-[58px] px-7 rounded-xl flex items-center gap-3.5 text-[16px] font-bold text-white transition-all hover:-translate-y-1"
                style={{ border: '1px solid #00d8f3', background: 'rgba(0,22,40,0.45)', backdropFilter: 'blur(8px)' }}
              >
                <Phone className="w-5 h-5 text-[#00d9ff]" />
                Call Now
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-[25px] mt-[24px] text-[12px]">
              {['Experienced Technicians', 'Genuine Parts', 'On-Time Service', 'Affordable Rates'].map((pt, i) => (
                <span key={i} className="flex items-center gap-[7px]">
                  <CheckCircle2 className="w-4 h-4 text-[#00d8f3]" /> {pt}
                </span>
              ))}
            </div>
          </div>


          {/* 3D AC UNIT (desktop only) — real hero-ac.png asset */}
          <div className="hidden lg:block absolute z-[6]"
            style={{ right: '14%', top: '12%', width: '520px', animation: 'acFloat 5s ease-in-out infinite' }}>
            {/* Atmospheric cyan glow behind/below the AC */}
            <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[380px] h-[180px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,217,255,0.12) 0%, rgba(0,180,255,0.05) 40%, transparent 70%)',
                filter: 'blur(25px)',
                animation: 'acGlow 3s ease-in-out infinite',
              }} />
            {/* Realistic 3D AC Image */}
            <Image
              src="/hero-ac.png"
              alt="Premium 3D split AC unit with cold air flow"
              width={520}
              height={360}
              className="w-full h-auto relative z-[2]"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.35)) drop-shadow(0 8px 20px rgba(0,180,255,0.12))',
              }}
              priority
            />
          </div>

          {/* â”€â”€ FLOATING CARDS â”€â”€ */}
          {/* 22Â°C */}
          <div className="hidden lg:flex absolute z-[15] items-center gap-3 px-5 py-3 rounded-[35px]"
            style={{ right: '34%', top: '20%', background: 'rgba(4,31,54,0.65)', border: '1px solid rgba(0,219,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', animation: 'cardFloat 4s ease-in-out infinite' }}>
            <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center text-[#00d9ff]">
              <Snowflake className="w-[22px] h-[22px]" />
            </div>
            <div>
              <strong className="text-[17px] block">22Â°C</strong>
              <small className="text-white/75 text-[11px] block mt-0.5">Perfect Cooling</small>
            </div>
          </div>

          {/* AMC */}
          <div className="hidden lg:flex absolute z-[15] items-center gap-3 px-5 py-3 rounded-[35px]"
            style={{ right: '19%', top: '20%', background: 'rgba(4,31,54,0.65)', border: '1px solid rgba(0,219,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', animation: 'cardFloat 4s ease-in-out infinite 1s' }}>
            <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center text-[#00d9ff]">
              <Shield className="w-[22px] h-[22px]" />
            </div>
            <div>
              <strong className="text-[17px] block">AMC Available</strong>
              <small className="text-white/75 text-[11px] block mt-0.5">Stay Worry Free</small>
            </div>
          </div>

          {/* Fast Response */}
          <div className="hidden lg:flex absolute z-[15] items-center gap-3 px-5 py-3 rounded-[35px]"
            style={{ right: '19%', top: '62%', background: 'rgba(4,31,54,0.65)', border: '1px solid rgba(0,219,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', animation: 'cardFloat 4s ease-in-out infinite 2s' }}>
            <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center text-[#00d9ff]">
              <Zap className="w-[22px] h-[22px]" />
            </div>
            <div>
              <strong className="text-[17px] block">Fast Response</strong>
              <small className="text-white/75 text-[11px] block mt-0.5">Within 24 Hours</small>
            </div>
          </div>

          {/* Decorative text */}
          <div className="hidden lg:block absolute z-[5] pointer-events-none select-none" style={{ right: '28%', top: '55%' }}>
            <p className="text-white/20 text-[28px] leading-tight italic" style={{ fontFamily: "'Georgia', serif" }}>
              Cooler Spaces<br />Better Lives
            </p>
          </div>

          {/* â”€â”€ OFFER BADGE â”€â”€ */}
          {PROMO.enabled && (
            <div className="hidden lg:flex absolute z-[15] items-center" style={{ right: '3%', top: '7%' }}>
              <div className="text-white text-center px-5 py-2.5"
                style={{ background: 'linear-gradient(135deg, #05dff3, #00a9d0)', clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}>
                <span className="block text-[10px] uppercase font-bold">UP TO</span>
                <strong className="text-[28px] leading-none">{PROMO.discount}</strong>
                <span className="text-[10px] align-top font-bold ml-0.5">OFF</span>
              </div>
              <div className="flex flex-col px-7 py-3.5" style={{ background: 'rgba(2,28,49,0.9)', border: '1px solid rgba(0,214,243,0.35)' }}>
                <strong className="text-[14px]">{PROMO.label}</strong>
                <small className="text-[#00d9ff] mt-1">{PROMO.note}</small>
              </div>
            </div>
          )}

          {/* â”€â”€ BOOKING CARD (desktop) â”€â”€ */}
          <div className="hidden lg:block absolute z-[30]"
            style={{ right: '3%', top: '27%', width: '255px', animation: 'bookingFloat 5s ease-in-out infinite' }}>
            <div className="p-[17px] rounded-[17px] text-[#102c50]"
              style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>

              {quickSuccess ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <strong className="text-[14px] block text-[#102c50]">Booking Confirmed!</strong>
                  <p className="text-[11px] text-slate-500 mt-1">Ref: <span className="font-mono font-bold">{quickSuccess}</span></p>
                  <button onClick={() => setQuickSuccess('')} className="text-[11px] text-[#00d9ff] font-semibold mt-2 hover:underline">Book Another</button>
                </div>
              ) : (
                <form onSubmit={handleQuickBooking}>
                  <div className="flex items-start gap-2.5 mb-3.5">
                    <CalendarCheck className="w-5 h-5 text-[#00a9d5] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-[14px] block">Quick Service Booking</strong>
                      <small className="text-[9px] text-[#75869a] leading-snug block mt-0.5">Fill in your details and we&apos;ll get back to you</small>
                    </div>
                  </div>

                  <div className="h-[35px] border border-[#d7e2ec] rounded-[7px] flex items-center px-2.5 mb-[9px] bg-white">
                    <Eye className="w-3 h-3 text-[#2b81ae] mr-2 flex-shrink-0" />
                    <input type="text" required placeholder="Full Name" value={quickName} onChange={e => setQuickName(e.target.value)}
                      className="w-full border-none outline-none text-[10px] text-[#4c6780] bg-transparent" />
                  </div>
                  <div className="h-[35px] border border-[#d7e2ec] rounded-[7px] flex items-center px-2.5 mb-[9px] bg-white">
                    <Phone className="w-3 h-3 text-[#2b81ae] mr-2 flex-shrink-0" />
                    <input type="tel" required placeholder="Phone Number" value={quickPhone} onChange={e => setQuickPhone(e.target.value)}
                      className="w-full border-none outline-none text-[10px] text-[#4c6780] bg-transparent" />
                  </div>
                  <div className="h-[35px] border border-[#d7e2ec] rounded-[7px] flex items-center px-2.5 mb-[9px] bg-white">
                    <ShieldCheck className="w-3 h-3 text-[#2b81ae] mr-2 flex-shrink-0" />
                    <select required value={quickService} onChange={e => setQuickService(e.target.value)}
                      className="w-full border-none outline-none text-[10px] text-[#4c6780] bg-transparent">
                      <option value="">Service Required</option>
                      {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="h-[58px] border border-[#d7e2ec] rounded-[7px] flex items-start px-2.5 pt-2 mb-[9px] bg-white">
                    <MessageSquare className="w-3 h-3 text-[#2b81ae] mt-0.5 mr-2 flex-shrink-0" />
                    <textarea placeholder="Your Message (Optional)" value={quickMessage} onChange={e => setQuickMessage(e.target.value)}
                      rows={2} className="w-full border-none outline-none text-[10px] text-[#4c6780] bg-transparent resize-none h-[45px]" />
                  </div>

                  <button type="submit" disabled={quickSubmitting}
                    className="w-full h-[40px] rounded-lg flex items-center justify-center gap-2.5 font-extrabold text-[#05243a] text-[12px] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #00dff2, #00bddb)' }}>
                    {quickSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Booking...</> : <>Book Now <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>

                  <p className="text-center mt-2 text-[#506a7d] text-[8px] flex items-center justify-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-[#0a638e]" /> We respect your privacy
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* â”€â”€ Stats Bar â”€â”€ */}
        <div className="absolute bottom-0 left-0 right-0 z-[20] flex flex-wrap items-center justify-center"
          style={{ minHeight: '88px', background: 'rgba(2,25,45,0.92)', borderTop: '1px solid rgba(0,216,244,0.35)', backdropFilter: 'blur(8px)' }}>
          {STATS.map((stat, i) => (
            <div key={i} className={`h-[58px] px-4 lg:px-[35px] flex items-center gap-4 group cursor-default ${i < STATS.length - 1 ? 'border-r border-white/[0.28]' : ''}`}
              style={{ animation: `stat-slide-up 0.6s ease-out ${0.1 + i * 0.15}s both` }}>
              <div className="w-12 h-12 rounded-full border border-[#00d8f3] flex items-center justify-center text-[#00d8f3] group-hover:bg-[#00d8f3]/10 transition-all duration-300">
                {stat.icon}
              </div>
              <div>
                <strong className="text-[19px] block group-hover:text-[#00d8f3] transition-colors duration-300">{stat.value}</strong>
                <span className="text-white/75 text-[12px] block mt-0.5">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Booking Form */}
        <div className="lg:hidden relative z-10 px-5 pt-[420px] pb-6">
          <div className="bg-white rounded-2xl p-5 shadow-2xl text-[#102c50] max-w-sm mx-auto">
            {quickSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <strong className="block text-[#102c50]">Booking Confirmed!</strong>
                <p className="text-sm text-slate-500">Ref: {quickSuccess}</p>
                <button onClick={() => setQuickSuccess('')} className="text-[#00d9ff] text-sm font-bold mt-2">Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleQuickBooking} className="space-y-3">
                <h3 className="font-bold text-[16px]">Quick Service Booking</h3>
                <input type="text" required placeholder="Full Name" value={quickName} onChange={e => setQuickName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm bg-white text-[#102c50] outline-none focus:ring-2 focus:ring-[#00d9ff]" />
                <input type="tel" required placeholder="Phone Number" value={quickPhone} onChange={e => setQuickPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm bg-white text-[#102c50] outline-none focus:ring-2 focus:ring-[#00d9ff]" />
                <select required value={quickService} onChange={e => setQuickService(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm bg-white text-[#102c50] outline-none focus:ring-2 focus:ring-[#00d9ff]">
                  <option value="">Service Required</option>
                  {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <textarea placeholder="Your Message (Optional)" value={quickMessage} onChange={e => setQuickMessage(e.target.value)}
                  rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm bg-white text-[#102c50] outline-none focus:ring-2 focus:ring-[#00d9ff] resize-none" />
                <button type="submit" disabled={quickSubmitting}
                  className="w-full py-3 rounded-lg font-bold text-[#05243a] flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00dff2, #00bddb)' }}>
                  {quickSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : <>Book Now <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 2: SERVICES OVERVIEW
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 3: WHY CHOOSE US
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 4: AMC HIGHLIGHT
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 5: SERVICE METHODOLOGY
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 6: CLIENT SEGMENTS (Industries We Serve)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 7: BOOKING FORM â€” Full inline booking
          (Placed AFTER Services/Projects/Clients so customer trusts first)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
            /* â”€â”€ INVOICE / CONFIRMATION â”€â”€ */
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
                            <span className="text-xs text-slate-500">Ã—{formData.units}</span>
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
                  <><CalendarCheck className="w-5 h-5" aria-hidden="true" /> Confirm Booking{selectedServices.length > 0 && ` â€” Rs. ${fixedTotal.toLocaleString()}${hasQuoteBased ? ' + Quote' : ''}`}</>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                By booking, you agree to be contacted via WhatsApp/Phone. Payment: Cash on Delivery. Working hours: Monâ€“Sat 9AMâ€“7PM.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Section 8: CTA BANNER
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
