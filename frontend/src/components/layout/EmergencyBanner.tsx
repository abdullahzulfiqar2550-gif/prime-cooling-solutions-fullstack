import React from 'react';
import { Shield, Clock, Phone } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function EmergencyBanner() {
  return (
    <div className="bg-[#061A2F] text-white text-xs py-2.5 px-4 w-full border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left — Credentials */}
        <div className="flex items-center gap-3 text-white/80">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00D4E8]" aria-hidden="true" />
            <span className="hidden sm:inline">Licensed Mechanical Engineer</span>
          </div>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline">Documented Service</span>
          <span className="hidden lg:inline text-white/30">•</span>
          <span className="hidden lg:inline">100% Genuine Parts</span>
        </div>
        {/* Right — Hours + Phone */}
        <div className="flex items-center gap-4 text-white/80">
          <div className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00D4E8]" aria-hidden="true" />
            <span>Mon – Sat 9AM – 7PM</span>
          </div>
          <a
            href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
            className="flex items-center gap-1.5 font-semibold text-[#00D4E8] hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            {COMPANY.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
