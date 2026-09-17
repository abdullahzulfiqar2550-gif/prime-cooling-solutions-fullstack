'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BOOKING_STATUSES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface BookingRow {
  id: string;
  customer_name: string;
  service_package: string;
  scheduled_date: string;
  time_slot: string;
  region: string;
  status: string;
  [key: string]: unknown;
}

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState('ALL');
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (data) setBookings(data as BookingRow[]);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    fetchBookings();
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Bookings</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none flex-grow sm:flex-grow-0"
          >
            <option value="ALL">All Statuses</option>
            {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">ID</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Customer</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Service</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Scheduled</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Location</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{booking.id}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{booking.customer_name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{booking.service_package}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{booking.scheduled_date} {booking.time_slot}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{booking.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={booking.status || 'NEW'} /></td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <select 
                      value={booking.status || 'NEW'} 
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className="text-xs border border-slate-300 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
