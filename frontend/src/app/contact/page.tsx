'use client';

import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Emergency Hotline & Inquiries</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We are here to help you with your HVAC needs. Reach out to us via any channel.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Phone Hotline</h3>
                <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline block mb-1">{COMPANY.phone}</a>
                <p className="text-xs text-slate-500">Available Mon-Sat, 9AM-7PM</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">WhatsApp</h3>
                <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-medium hover:underline block mb-1">+{COMPANY.whatsapp}</a>
                <p className="text-xs text-slate-500">For instant messaging & photos</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Workshop / HQ</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{COMPANY.address}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
              {submitted ? (
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-400 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-medium underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                      <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                      <input type="tel" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <input type="text" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                    <textarea rows={5} required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"></textarea>
                  </div>
                  <button type="submit" className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md transition-colors w-full md:w-auto">
                    Submit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
