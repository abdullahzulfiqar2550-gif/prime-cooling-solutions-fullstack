import React from 'react';
import { Shield, Clock, Phone } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function EmergencyBanner() {
  return (
    <div
      className="w-full text-white text-[13px] sm:text-[14px] relative z-[100]"
      style={{ height: '49px', background: 'linear-gradient(90deg, #02192d, #062c49, #02192d)' }}
    >
      <div className="h-full flex items-center justify-between px-[4.5%]">
        {/* Left — Credentials */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00d9ff]" aria-hidden="true" />
            <span className="hidden sm:inline">Licensed Mechanical Engineer</span>
          </div>
          <span className="hidden md:inline text-[#00d9ff] text-[8px]">●</span>
          <span className="hidden md:inline">Documented Service</span>
          <span className="hidden lg:inline text-[#00d9ff] text-[8px]">●</span>
          <span className="hidden lg:inline">100% Genuine Parts</span>
        </div>
        {/* Right — Hours + Phone */}
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00d9ff]" aria-hidden="true" />
            <span>Mon – Sat 9AM – 7PM</span>
          </div>
          <div className="hidden sm:block h-[22px] w-px bg-white/30" />
          <a
            href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
            className="flex items-center gap-1.5 font-bold text-[#00d9ff] hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            {COMPANY.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
