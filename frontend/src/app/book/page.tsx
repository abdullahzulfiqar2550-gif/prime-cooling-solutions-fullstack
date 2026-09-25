'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ChevronLeft, Receipt, Trash2, Loader2, Search } from 'lucide-react';
import { SERVICES, AC_TYPES, TIME_SLOTS, REGIONS, PROPERTY_TYPES, COMPANY } from '@/lib/constants';
import { supabase, generateBookingId } from '@/lib/supabase';

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="text-slate-500">Loading...</div></div>}>
      <BookPageContent />
    </Suspense>
  );
}

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams?.get('service') || '';

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialService ? [initialService] : []
  );
  const [invoiceData, setInvoiceData] = useState<{
    id: string;
    services: { title: string; price: string; amount: number }[];
    total: number;
    hasQuoteBased: boolean;
    customerName: string;
    customerPhone: string;
    date: string;
    timeSlot: string;
    region: string;
    address: string;
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

  // Calculate invoice items
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Build invoice
      setInvoiceData({
        id,
        services: invoiceItems.map(item => ({ title: item.title, price: item.price, amount: item.amount })),
        total: fixedTotal,
        hasQuoteBased,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        date: formData.scheduledDate,
        timeSlot: TIME_SLOTS.find(t => t.value === formData.timeSlot)?.label || formData.timeSlot,
        region: REGIONS.find(r => r.value === formData.region)?.label || formData.region,
        address: formData.fullAddress,
      });
      setStep(5); // Invoice step
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error creating booking: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && selectedServices.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const stepLabels = ['Services', 'Schedule', 'Location', 'Details'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Book Service Online</h1>
          <p className="text-slate-600 dark:text-slate-400">Schedule your professional HVAC service in 4 easy steps.</p>
        </div>

        {/* ── INVOICE VIEW (Step 5) ── */}
        {step === 5 && invoiceData ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-10 h-10" />
                  <div>
                    <h2 className="text-2xl font-bold">Booking Invoice</h2>
                    <p className="text-cyan-100 text-sm">{COMPANY.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xl">{invoiceData.id}</div>
                  <div className="text-cyan-100 text-sm">{invoiceData.date}</div>
                </div>
              </div>
            </div>

            {/* Customer + Booking Info */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill To</div>
                <div className="font-bold text-slate-900 dark:text-white">{invoiceData.customerName}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{invoiceData.customerPhone}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service Details</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">{invoiceData.timeSlot}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{invoiceData.region} — {invoiceData.address}</div>
              </div>
            </div>

            {/* Service Items Table */}
            <div className="px-6 py-5">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="pb-3">#</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3 text-right">Rate</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.services.map((svc, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 text-sm text-slate-500 dark:text-slate-400">{i + 1}</td>
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

            {/* Total + Payment */}
            <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  Rs. {invoiceData.total.toLocaleString()}
                  {invoiceData.hasQuoteBased && ' + Quote'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-bold text-xs">
                  💰 CASH ON DELIVERY
                </span>
                <span className="text-slate-500 dark:text-slate-400">— Pay when service is completed</span>
              </div>
              {invoiceData.hasQuoteBased && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  * Quote-based services will be assessed on-site. Final price confirmed before work begins.
                </p>
              )}
            </div>

            {/* Company Footer */}
            <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
              {COMPANY.name} • {COMPANY.phone} • {COMPANY.address}
            </div>

            {/* Actions */}
            <div className="px-6 py-5 flex flex-col sm:flex-row gap-3">
              <Link href="/track" className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-md transition-colors text-center inline-flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Track Booking
              </Link>
              <button onClick={() => { setStep(1); setSelectedServices([]); setFormData({ acType: '', units: 1, problemDescription: '', scheduledDate: '', timeSlot: '', region: '', propertyType: '', fullAddress: '', customerName: '', customerPhone: '', customerEmail: '' }); setInvoiceData(null); }} className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center">
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stepper */}
            <div className="mb-8 flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 z-0 rounded"></div>
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= num ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  <span className={`mt-1 text-[10px] font-medium ${step >= num ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`}>
                    {stepLabels[num - 1]}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 md:p-8">
              <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

                {/* ═══ Step 1: Services + Equipment ═══ */}
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">1. Select Services &amp; Equipment</h2>

                    {/* Multi-select services */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Select Services * <span className="text-xs text-slate-500">(Select one or more)</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto p-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950">
                        {SERVICES.map(svc => (
                          <label
                            key={svc.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedServices.includes(svc.id)
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-1 ring-cyan-500'
                                : 'border-transparent hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-white dark:hover:bg-slate-900'
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

                    {/* Live invoice preview */}
                    {selectedServices.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-lg border border-cyan-200 dark:border-cyan-800 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Receipt className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Invoice Preview</h4>
                          <span className="text-xs text-slate-500 ml-auto">{selectedServices.length} service(s)</span>
                        </div>
                        <div className="space-y-2">
                          {invoiceItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700 dark:text-slate-300 truncate flex-1">{item.title}</span>
                              <div className="flex items-center gap-2 ml-2">
                                <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                                  {item.isQuoteBased ? 'Quote' : `Rs. ${item.amount.toLocaleString()}`}
                                </span>
                                <button type="button" onClick={() => toggleService(selectedServices[i])} className="text-red-400 hover:text-red-500">
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
                        <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          Payment: Cash on Delivery
                        </div>
                      </div>
                    )}

                    {/* AC Type + Units */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AC Type *</label>
                        <select required name="acType" value={formData.acType} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                          <option value="">-- Select Type --</option>
                          {AC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Units *</label>
                        <input type="number" required min="1" max="20" name="units" value={formData.units} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Problem Description</label>
                      <textarea name="problemDescription" value={formData.problemDescription} onChange={handleChange} rows={3} placeholder="Briefly describe the issue (optional)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"></textarea>
                    </div>
                  </div>
                )}

                {/* ═══ Step 2: Schedule ═══ */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">2. Schedule</h2>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Date *</label>
                      <input type="date" required name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Time Slot *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TIME_SLOTS.map(slot => (
                          <label key={slot.value} className={`border rounded-md px-4 py-3 cursor-pointer flex items-center transition-colors ${formData.timeSlot === slot.value ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name="timeSlot" value={slot.value} checked={formData.timeSlot === slot.value} onChange={handleChange} className="sr-only" required />
                            <span className={`text-sm font-medium ${formData.timeSlot === slot.value ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'}`}>{slot.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ Step 3: Location ═══ */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">3. Location Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Area / Region *</label>
                        <select required name="region" value={formData.region} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                          <option value="">-- Select Area --</option>
                          {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Type *</label>
                        <select required name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                          <option value="">-- Select Type --</option>
                          {PROPERTY_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Address *</label>
                      <textarea name="fullAddress" required value={formData.fullAddress} onChange={handleChange} rows={3} placeholder="Street, House/Office No, Nearby Landmark" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"></textarea>
                    </div>
                  </div>
                )}

                {/* ═══ Step 4: Contact + Summary ═══ */}
                {step === 4 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">4. Your Details &amp; Confirm</h2>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                      <input type="text" required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                        <input type="tel" required name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="03XXXXXXXXX" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address (Optional)</label>
                        <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                      </div>
                    </div>

                    {/* Booking Summary with Invoice Preview */}
                    <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-4 py-3 bg-cyan-50 dark:bg-cyan-900/20 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Booking Summary &amp; Invoice</h4>
                      </div>
                      <div className="p-4 space-y-3 text-sm">
                        {/* Services list */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Services</div>
                          {invoiceItems.map((item, i) => (
                            <div key={i} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                              <span className="text-slate-700 dark:text-slate-300">{item.title}</span>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {item.isQuoteBased ? 'Quote' : `Rs. ${item.amount.toLocaleString()}`}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Total */}
                        <div className="flex justify-between pt-2 border-t-2 border-slate-300 dark:border-slate-600">
                          <span className="font-bold text-slate-900 dark:text-white">Total</span>
                          <span className="font-bold text-lg text-cyan-600 dark:text-cyan-400">
                            Rs. {fixedTotal.toLocaleString()}{hasQuoteBased ? ' + Quote' : ''}
                          </span>
                        </div>
                        {/* Other details */}
                        <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                          <div><strong>Date:</strong> {formData.scheduledDate || '-'}</div>
                          <div><strong>Time:</strong> {TIME_SLOTS.find(t => t.value === formData.timeSlot)?.label || '-'}</div>
                          <div><strong>Area:</strong> {REGIONS.find(r => r.value === formData.region)?.label || '-'}</div>
                          <div><strong>Units:</strong> {formData.units}</div>
                        </div>
                        {/* Payment */}
                        <div className="flex items-center gap-2 pt-2">
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-bold">
                            💰 CASH ON DELIVERY
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={prevStep} disabled={step === 1} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </button>

                  <button type="submit" disabled={submitting || (step === 1 && selectedServices.length === 0)} className="flex items-center px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md shadow-sm transition-colors disabled:opacity-50">
                    {step === 4 ? (
                      submitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                      ) : (
                        <>Confirm Booking — Rs. {fixedTotal.toLocaleString()}{hasQuoteBased ? ' + Quote' : ''}</>
                      )
                    ) : (
                      <>Next Step <ChevronRight className="w-4 h-4 ml-1" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
