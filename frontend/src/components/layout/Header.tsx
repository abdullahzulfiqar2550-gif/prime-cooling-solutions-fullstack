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
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Areas We Serve', href: '/#areas' },
  { label: 'About', href: '/about' },
  { label: 'Track Booking', href: '/track' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white relative z-[100]" style={{ height: '85px' }}>
      <div className="h-full flex items-center justify-between px-[4.5%]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-[55px] h-[55px] rounded-full border-[5px] border-[#078dc8] flex items-center justify-center">
            <Image src="/logo.png" alt="Prime Cooling Solutions" width={38} height={38} className="rounded-full" priority />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00d9ff] rounded-full" />
          </div>
          <div className="leading-none">
            <h2 className="text-[#102c50] text-[25px] font-black tracking-tight" style={{ letterSpacing: '-0.8px' }}>
              PRIME COOLING
            </h2>
            <span className="text-[#00bce8] text-[17px] font-extrabold" style={{ letterSpacing: '2px' }}>
              SOLUTIONS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full" style={{ gap: '26px' }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`h-full flex items-center text-[16px] font-medium relative transition-colors ${
                item.active
                  ? 'text-[#00aee0] font-bold'
                  : 'text-[#102849] hover:text-[#00aee0]'
              }`}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-2.5 h-2.5 ml-2" />}
              {item.active && (
                <span className="absolute bottom-[17px] left-0 w-full h-[3px] bg-[#00d5f5]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center" style={{ gap: '28px' }}>
          <a
            href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
            className="flex items-center gap-3 text-[#112945]"
          >
            <Phone className="w-[19px] h-[19px] text-[#087ab5]" />
            <span className="font-semibold">{COMPANY.phone}</span>
          </a>
          <Link
            href="/book"
            className="flex items-center gap-3 px-6 py-3.5 rounded-[11px] font-bold text-[#06233d] transition-all hover:-translate-y-[3px]"
            style={{
              background: 'linear-gradient(135deg, #08d9f0, #00bddf)',
              boxShadow: '0 8px 25px rgba(0, 207, 240, 0.22)',
            }}
          >
            <CalendarCheck className="w-[18px] h-[18px]" />
            Book Online
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="p-2 text-[#00D4E8]" aria-label="Call us">
            <Phone className="w-5 h-5" />
          </a>
          <Link href="/book" className="px-3 py-2 bg-[#00D4E8] text-[#061A2F] text-xs font-bold rounded-lg">
            Book Online
          </Link>
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full left-0">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2.5 rounded-lg text-[15px] font-medium ${
                  item.active ? 'text-[#00D4E8] bg-cyan-50' : 'text-[#061A2F] hover:bg-slate-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
