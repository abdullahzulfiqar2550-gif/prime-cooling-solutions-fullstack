'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, CalendarCheck, ChevronDown } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

const NAV_LINKS = [
  { label: 'Home', href: '/', active: true },
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'AMC', href: '/amc' },
  { label: 'About', href: '/about' },
  { label: 'Track Booking', href: '/track' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Prime Cooling Solutions" width={42} height={42} className="rounded-md" priority />
              <div className="leading-tight">
                <span className="font-extrabold text-[17px] text-[#061A2F] tracking-tight block">PRIME COOLING</span>
                <span className="font-bold text-[10px] text-[#00D4E8] tracking-[0.2em] block">SOLUTIONS</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[14px] font-medium transition-colors relative pb-1 flex items-center gap-1 ${
                  item.active
                    ? 'text-[#00D4E8] border-b-2 border-[#00D4E8]'
                    : 'text-[#061A2F]/70 hover:text-[#00D4E8]'
                }`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
              className="flex items-center gap-2 text-[14px] font-semibold text-[#061A2F] hover:text-[#00D4E8] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#00D4E8]" />
              {COMPANY.phone}
            </a>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D4E8] hover:bg-[#00bdd0] text-[#061A2F] font-bold text-[14px] rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Online
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="p-2 text-[#00D4E8]" aria-label="Call us">
              <Phone className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[#061A2F] hover:bg-slate-100"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                  item.active
                    ? 'text-[#00D4E8] bg-cyan-50'
                    : 'text-[#061A2F] hover:bg-slate-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="block w-full text-center mt-3 px-4 py-3 bg-[#00D4E8] text-[#061A2F] font-bold rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Book Online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
