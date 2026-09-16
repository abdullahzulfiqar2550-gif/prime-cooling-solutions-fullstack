import React from 'react';
import { COMPANY } from '@/lib/constants';

export function EmergencyBanner() {
  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white text-xs sm:text-sm py-2 px-4 w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-slate-300 hidden md:inline">Licensed Mechanical Engineer • Documented Service</span>
          <span className="text-slate-300 md:hidden">Professional HVAC Service</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 hidden sm:inline">{COMPANY.workingHours}</span>
          <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            {COMPANY.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
