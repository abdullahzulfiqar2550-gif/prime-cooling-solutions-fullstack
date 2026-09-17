'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: total }, 
          { count: pending }, 
          { count: inProgress }, 
          { count: completed }
        ] = await Promise.all([
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['NEW', 'CONTACTED']),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['CONFIRMED', 'IN_PROGRESS']),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED'),
        ]);

        setCounts({
          total: total || 0,
          pending: pending || 0,
          inProgress: inProgress || 0,
          completed: completed || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard counts', err);
      }
    };
    fetchCounts();
  }, []);

  const metrics = [
    { title: 'Total Bookings', value: counts.total.toString(), icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Pending', value: counts.pending.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { title: 'In Progress', value: counts.inProgress.toString(), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { title: 'Completed', value: counts.completed.toString(), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${m.bg} ${m.color}`}>
              <m.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{m.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-96 flex items-center justify-center">
        <p className="text-slate-500">Dashboard charts will be rendered here.</p>
      </div>
    </div>
  );
}
