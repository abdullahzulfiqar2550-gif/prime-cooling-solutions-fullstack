'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { SERVICES, AC_TYPES, TIME_SLOTS, REGIONS, PROPERTY_TYPES } from '@/lib/constants';

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
  const [formData, setFormData] = useState({
    serviceId: initialService,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call
    alert(`Success! Booking created. Reference ID: PCS-Mock123`);
    router.push('/track');
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Book Service Online</h1>
          <p className="text-slate-600 dark:text-slate-400">Schedule your professional HVAC service in 4 easy steps.</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 z-0 rounded"></div>
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= num ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {num}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            
            {/* Step 1: Equipment Details */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">1. Equipment & Service</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Required *</label>
                  <select required name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">-- Select a Service --</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                
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

            {/* Step 2: Schedule */}
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

            {/* Step 3: Location */}
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

            {/* Step 4: Contact & Confirm */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">4. Your Details</h2>
                
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

                <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500"/> Booking Summary</h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    <li><strong>Service:</strong> {SERVICES.find(s => s.id === formData.serviceId)?.title || '-'} ({formData.units} Unit/s)</li>
                    <li><strong>Date & Time:</strong> {formData.scheduledDate || '-'} | {TIME_SLOTS.find(t => t.value === formData.timeSlot)?.label || '-'}</li>
                    <li><strong>Area:</strong> {REGIONS.find(r => r.value === formData.region)?.label || '-'}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={prevStep} disabled={step === 1} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              
              <button type="submit" className="flex items-center px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md shadow-sm transition-colors">
                {step === 4 ? 'Confirm Booking' : 'Next Step'} {step < 4 && <ChevronRight className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
