import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { COMPANY, NAV_ITEMS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Logo & Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Prime Cooling Solutions Logo" width={40} height={40} className="rounded-md bg-white p-0.5" />
              <span className="font-bold text-xl text-white tracking-tight">PRIME COOLING</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">{COMPANY.tagline}</p>
            <p className="text-sm text-slate-400">{COMPANY.experience} • Engineering-Led</p>
          </div>

          {/* Col 2: Coverage */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide">SERVICE COVERAGE</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>Headquarters: <br />{COMPANY.address}</span>
              </li>
              <li className="text-slate-400 mt-2 pl-6">
                Coverage: {COMPANY.coverage}
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & CTA */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide">CONTACT US</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500" />
                <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="hover:text-cyan-400 transition-colors">{COMPANY.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-cyan-400 transition-colors break-all">{COMPANY.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>{COMPANY.workingHours}</span>
              </li>
            </ul>
            <Link
              href="/book"
              className="inline-block px-5 py-2.5 bg-transparent border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors text-sm font-medium"
            >
              Schedule Inspection
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 {COMPANY.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
