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

  // â”€â”€ Promo config (easily toggled) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const PROMO = { enabled: true, discount: '30%', label: 'ON AMC PACKAGES', note: 'Limited Time Offer' };

  // â”€â”€ Stats (configurable business data) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const STATS = [
    { value: '500+', label: 'Happy Customers', icon: 'ðŸ˜Š' },
    { value: '4.9/5', label: 'Customer Rating', icon: 'â­' },
    { value: '5+ Years', label: 'Of Experience', icon: 'ðŸ†' },
    { value: 'Lahore', label: 'Service Area', icon: 'ðŸ“' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO â€” Exact recreation of reference design
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative text-white overflow-hidden min-h-[92vh]">
        {/* â”€â”€ Background: building scene with lighter gradient â”€â”€ */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Prime Cooling Solutions â€“ commercial building, service van, HVAC technicians"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient: strong left for text, transparent center so building/AC/van visible, slight darkening right for form contrast */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(95deg, rgba(4,18,36,0.93) 0%, rgba(4,18,36,0.82) 28%, rgba(4,18,36,0.25) 48%, rgba(4,18,36,0.08) 62%, rgba(4,18,36,0.35) 85%, rgba(4,18,36,0.55) 100%)',
          }} />
        </div>

        {/* â”€â”€ Hero Grid: 3 zones â”€â”€ */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col lg:flex-row min-h-[75vh] pt-8 pb-4 lg:pt-10 lg:pb-0">

            {/* â•â•â• ZONE 1: Left Content (text, features, CTAs) â•â•â• */}
            <div className="lg:w-[42%] w-full flex flex-col justify-center z-10 pb-6 lg:pb-0">

              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full w-fit mb-5"
                style={{ background: 'rgba(0,212,232,0.08)', border: '1px solid rgba(0,212,232,0.4)', backdropFilter: 'blur(8px)' }}>
                <Snowflake className="w-4 h-4 text-[#00D4E8]" />
                <span className="text-[13px] font-medium tracking-wide">
                  <span className="text-[#00D4E8]">Your Comfort</span>
                  <span className="text-white/30 mx-1.5">â€¢</span>
                  <span className="text-white/80">Our Priority</span>
                </span>
              </div>

              {/* MAIN HEADLINE â€” BIG & BOLD */}
              <h1 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[72px] xl:text-[80px] font-black leading-[0.95] tracking-tight mb-5">
                Professional AC<br />
                Service &amp;<br />
                <span className="text-[#00D4E8]">HVAC Solutions</span>
              </h1>

              {/* Supporting paragraph */}
              <p className="text-[14px] md:text-[15px] text-white/65 mb-7 max-w-[440px] leading-relaxed">
                Stay cool, stay comfortable! We provide expert AC installation,
                repair and maintenance for homes and businesses across Lahore.
                Fast, reliable and affordable service â€” always.
              </p>

              {/* â”€â”€ Service Features: SINGLE ROW with separators â”€â”€ */}
              <div className="flex items-center gap-0 mb-7 overflow-x-auto">
                {[
                  { icon: <Hammer className="w-4 h-4" />, title: 'AC Installation', sub: '(All Brands)' },
                  { icon: <Wrench className="w-4 h-4" />, title: 'AC Repair', sub: '(All Types)' },
                  { icon: <ShieldCheck className="w-4 h-4" />, title: 'AMC Service', sub: '(Annual Maintenance)' },
                  { icon: <Building2 className="w-4 h-4" />, title: 'Commercial &', sub: 'Residential' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex items-center gap-2 px-3 flex-shrink-0">
                      <div className="w-9 h-9 rounded-full border border-[#00D4E8]/40 bg-[#00D4E8]/10 flex items-center justify-center text-[#00D4E8] flex-shrink-0">
                        {feat.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white whitespace-nowrap">{feat.title}</div>
                        <div className="text-[9px] text-white/40 whitespace-nowrap">{feat.sub}</div>
                      </div>
                    </div>
                    {i < 3 && <div className="w-px h-7 bg-white/15 flex-shrink-0" />}
                  </div>
                ))}
              </div>

              {/* â”€â”€ CTA Buttons â”€â”€ */}
              <div className="flex flex-wrap gap-3 mb-5">
                <button
                  onClick={scrollToBooking}
                  className="group px-6 py-3 rounded-lg font-bold text-[14px] text-[#061A2F] flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-400/30"
                  style={{ background: 'linear-gradient(135deg, #00D4E8, #00C4D6)' }}
                >
                  <CalendarCheck className="w-4 h-4" /> Book Service Now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
                  className="px-6 py-3 rounded-lg font-semibold text-[14px] text-white flex items-center gap-2 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'rgba(6,26,47,0.5)', border: '1px solid rgba(0,212,232,0.4)', backdropFilter: 'blur(8px)' }}
                >
                  <Phone className="w-4 h-4 text-[#00D4E8]" /> Call Now
                </a>
              </div>

              {/* Trust Points â€” single row */}
              <div className="flex flex-wrap gap-4 text-[11px] text-white/50">
                {['Experienced Technicians', 'Genuine Parts', 'On-Time Service', 'Affordable Rates'].map((pt, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00D4E8]/70" /> {pt}
                  </span>
                ))}
              </div>
            </div>

            {/* â•â•â• ZONE 2: Center â€” scene shows through, floating cards only â•â•â• */}
            <div className="hidden lg:flex lg:w-[33%] relative items-end justify-center pb-16">

              {/* Floating Card: 22Â°C */}
              <div className="absolute top-[22%] left-[8%] animate-float-slow z-10" style={{ animationDuration: '5s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-lg"
                  style={{ background: 'rgba(4,18,36,0.80)', border: '1px solid rgba(0,212,232,0.35)', backdropFilter: 'blur(14px)' }}>
                  <div className="w-8 h-8 rounded-full bg-[#00D4E8]/15 flex items-center justify-center">
                    <Snowflake className="w-4 h-4 text-[#00D4E8]" />
                  </div>
                  <div>
                    <div className="text-[20px] font-extrabold text-white leading-none">22Â°C</div>
                    <div className="text-[9px] text-white/50 font-medium">Perfect Cooling</div>
                  </div>
                </div>
              </div>

              {/* Floating Card: AMC */}
              <div className="absolute top-[18%] right-[-5%] animate-float z-10" style={{ animationDuration: '5.5s', animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-lg"
                  style={{ background: 'rgba(4,18,36,0.80)', border: '1px solid rgba(0,212,232,0.35)', backdropFilter: 'blur(14px)' }}>
                  <div className="w-8 h-8 rounded-full bg-[#00D4E8]/15 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#00D4E8]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">AMC Available</div>
                    <div className="text-[9px] text-white/50">Stay Worry Free</div>
                  </div>
                </div>
              </div>

              {/* Floating Card: Fast Response */}
              <div className="absolute bottom-[30%] right-[-10%] animate-float-reverse z-10" style={{ animationDuration: '4.5s', animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-lg"
                  style={{ background: 'rgba(4,18,36,0.80)', border: '1px solid rgba(0,212,232,0.35)', backdropFilter: 'blur(14px)' }}>
                  <div className="w-8 h-8 rounded-full bg-[#00D4E8]/15 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#00D4E8]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">Fast Response</div>
                    <div className="text-[9px] text-white/50">Within 24 Hours</div>
                  </div>
                </div>
              </div>

              {/* Decorative handwritten text */}
              <div className="absolute bottom-[12%] left-[15%] z-10 pointer-events-none select-none">
                <p className="text-white/15 text-[26px] leading-tight italic" style={{ fontFamily: "'Georgia', serif" }}>
                  &ldquo;Cooler Spaces<br />Better Lives&rdquo;
                </p>
              </div>
            </div>

            {/* â•â•â• ZONE 3: Right â€” Promo Badge + Quick Booking Form â•â•â• */}
            <div className="lg:w-[25%] w-full flex flex-col items-end justify-start pt-0 lg:pt-4 z-20">

              {/* Promo Badge */}
              {PROMO.enabled && (
                <div className="hidden md:block mb-4 self-end">
                  <div className="flex gap-0">
                    <div className="bg-[#00D4E8] text-[#061A2F] px-4 py-3 rounded-l-xl text-center">
                      <div className="text-[9px] font-bold uppercase tracking-widest">UP TO</div>
                      <div className="text-[34px] font-black leading-none -mt-0.5">
                        {PROMO.discount}<span className="text-[14px] align-top font-extrabold">OFF</span>
                      </div>
                    </div>
                    <div className="bg-[#061A2F] text-white px-3 py-3 rounded-r-xl border border-l-0 border-white/10 flex flex-col justify-center">
                      <div className="text-[9px] font-bold uppercase tracking-wider">{PROMO.label}</div>
                      <div className="text-[8px] text-white/50 italic mt-0.5">{PROMO.note}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Service Booking Card */}
              <div className="w-full max-w-[300px] bg-white rounded-2xl shadow-2xl shadow-black/20 p-5 lg:ml-auto">
                {quickSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-[16px] font-bold text-[#061A2F] mb-1">Booking Confirmed!</h4>
                    <p className="text-[12px] text-slate-500 mb-2">Ref: <span className="font-mono font-bold">{quickSuccess}</span></p>
                    <button onClick={() => setQuickSuccess('')} className="text-[12px] text-[#00D4E8] font-semibold hover:underline">Book Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleQuickBooking}>
                    <h3 className="text-[15px] font-bold text-[#061A2F] mb-0.5">Quick Service Booking</h3>
                    <p className="text-[10px] text-slate-400 mb-4">Fill in your details and we&apos;ll get back to you</p>
                    <div className="space-y-2.5">
                      <input type="text" required placeholder="Full Name" value={quickName} onChange={e => setQuickName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-[#061A2F] placeholder-slate-400 focus:ring-2 focus:ring-[#00D4E8] focus:border-transparent focus:outline-none" />
                      <input type="tel" required placeholder="Phone Number" value={quickPhone} onChange={e => setQuickPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-[#061A2F] placeholder-slate-400 focus:ring-2 focus:ring-[#00D4E8] focus:border-transparent focus:outline-none" />
                      <select required value={quickService} onChange={e => setQuickService(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-[#061A2F] focus:ring-2 focus:ring-[#00D4E8] focus:border-transparent focus:outline-none">
                        <option value="">Service Required</option>
                        {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </select>
                      <textarea placeholder="Your Message (Optional)" value={quickMessage} onChange={e => setQuickMessage(e.target.value)}
                        rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-[#061A2F] placeholder-slate-400 focus:ring-2 focus:ring-[#00D4E8] focus:border-transparent focus:outline-none resize-none" />
                      <button type="submit" disabled={quickSubmitting}
                        className="w-full py-2.5 bg-[#00D4E8] hover:bg-[#00bdd0] text-[#061A2F] font-bold text-[13px] rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 disabled:opacity-50">
                        {quickSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : <>Book Now <ArrowRight className="w-3.5 h-3.5" /></>}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-slate-300" /> We respect your privacy
                    </p>
                  </form>
                )}
              </div>

              {/* WhatsApp Card */}
              <div className="hidden lg:flex items-center gap-2.5 mt-4 self-end bg-white rounded-xl px-4 py-2.5 shadow-lg">
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <a href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Hello Prime Cooling Solutions! I need AC service support.')}`}
                  target="_blank" rel="noopener noreferrer" className="leading-tight">
                  <div className="text-[12px] font-bold text-[#061A2F]">Chat on WhatsApp</div>
                  <div className="text-[10px] text-slate-400">Quick Support</div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* â”€â”€ Bottom Statistics Bar â”€â”€ */}
        <div className="relative z-10 border-t border-white/10" style={{ background: 'rgba(4,18,36,0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 lg:gap-4">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-default">
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                  <div>
                    <div className="text-[24px] font-black text-white group-hover:text-[#00D4E8] transition-colors duration-300">{stat.value}</div>
                    <div className="text-[11px] text-white/45 font-medium">{stat.label}</div>
                  </div>
                  {i < STATS.length - 1 && <div className="hidden lg:block w-px h-10 bg-white/8 ml-8" />}
                </div>
              ))}
            </div>
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
