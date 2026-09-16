import React from 'react';
import { CalendarDays, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const metrics = [
    { title: 'Total Bookings', value: '1,248', icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Pending', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { title: 'In Progress', value: '5', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { title: 'Completed', value: '1,231', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
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
