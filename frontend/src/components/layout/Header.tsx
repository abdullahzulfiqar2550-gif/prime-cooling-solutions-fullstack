'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NAV_ITEMS, COMPANY } from '@/lib/constants';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Prime Cooling Solutions" width={40} height={40} className="rounded-md" priority />
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">PRIME COOLING</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <a
              href={`tel:${COMPANY.phone.replace(/-/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              aria-label="Call us"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Book Online
            </Link>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-300" onClick={() => setIsOpen(false)}>
              <Phone className="w-4 h-4" /> {COMPANY.phone}
            </a>
            <Link href="/book" className="block w-full text-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-500" onClick={() => setIsOpen(false)}>
              Book Online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
