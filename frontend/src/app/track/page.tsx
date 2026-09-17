'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, User, Phone, CheckCircle2 } from 'lucide-react';
import { BOOKING_STATUSES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface BookingResult {
  id: string;
  customer_name: string;
  service_package: string;
  scheduled_date: string;
  time_slot: string;
  region: string;
  address: string;
  status: string;
  assigned_technician: string | null;
  [key: string]: unknown;
}

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<BookingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setHasSearched(true);
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const { data, error: sbError } = await supabase
        .from('bookings')
        .select('*')
        .or(`id.eq.${query},phone.eq.${query}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sbError) throw sbError;
      if (!data) {
        setError('No booking found with that Reference ID or Phone Number.');
      } else {
        setBooking(data as BookingResult);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error fetching booking: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Track Your Booking</h1>
          <p className="text-slate-600 dark:text-slate-400">Enter your Booking Reference ID or Phone Number to check real-time status.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g. PCS-8823 or 03XXXXXXXXX"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md transition-colors"
            >
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>
        </div>

        {hasSearched && loading && (
           <div className="text-center py-12"><div className="text-slate-500">Searching for booking...</div></div>
        )}

        {hasSearched && error && (
           <div className="text-center py-12"><div className="text-red-500 font-medium">{error}</div></div>
        )}

        {hasSearched && !loading && !error && booking && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Booking #{booking.id}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{booking.customer_name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border animate-pulse ${
                booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 
                'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {(booking.status || 'NEW').replace('_', ' ')}
              </span>
            </div>

            {/* Stepper */}
            <div className="mb-10 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 rounded"></div>
              <div className="flex justify-between relative z-10">
                {BOOKING_STATUSES.filter(s => s !== 'CANCELLED').map((status, index) => {
                  const currentIndex = BOOKING_STATUSES.indexOf(booking.status || 'NEW');
                  const isCompleted = index < currentIndex;
                  const isActive = index === currentIndex;

                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 mb-2 transition-colors ${
                        isCompleted ? 'bg-teal-500 border-teal-500 text-white' : 
                        isActive ? 'bg-cyan-500 border-cyan-500 text-brand-navy' : 
                        'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-medium text-center hidden sm:block ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}>
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Search className="w-4 h-4" /></div>
                  <div><p className="text-slate-500 text-xs">Service</p><p className="font-medium">{booking.service_package}</p></div>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Calendar className="w-4 h-4" /></div>
                  <div><p className="text-slate-500 text-xs">Scheduled</p><p className="font-medium">{booking.scheduled_date} • {booking.time_slot}</p></div>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><MapPin className="w-4 h-4" /></div>
                  <div><p className="text-slate-500 text-xs">Location</p><p className="font-medium">{booking.address}</p></div>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400"><User className="w-4 h-4" /></div>
                  <div><p className="text-slate-500 text-xs">Assigned Technician</p><p className="font-medium">{booking.assigned_technician || 'Not Assigned Yet'}</p></div>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400"><Phone className="w-4 h-4" /></div>
                  <div><p className="text-slate-500 text-xs">Technician Contact</p><p className="font-medium">{booking.assigned_technician ? 'Provided on arrival' : '-'}</p></div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <a href={`tel:03371768618`} className="inline-flex items-center justify-center w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Call Dispatcher
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
