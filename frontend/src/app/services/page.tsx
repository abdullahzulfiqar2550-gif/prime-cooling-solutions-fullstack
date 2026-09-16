import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { SERVICES, AC_TYPES } from '@/lib/constants';

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Check className={className} />;
}

export default function ServicesPage() {
  const acServices = SERVICES.filter(s => s.category !== 'Appliance');
  const applianceServices = SERVICES.filter(s => s.category === 'Appliance');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero */}
      <div className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional HVAC Services</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">Comprehensive cooling solutions tailored to your requirements.</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white border-b pb-4 border-slate-100 dark:border-slate-800">Air Conditioning Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {acServices.map((service) => (
              <div key={service.id} className="p-6 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-cyan-500 transition-colors">
                <DynamicIcon name={service.icon} className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{service.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-semibold text-teal-600 dark:text-teal-400 text-sm">{service.priceText}</span>
                  <Link href={`/book?service=${service.id}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white border-b pb-4 border-slate-100 dark:border-slate-800">Appliance Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {applianceServices.map((service) => (
              <div key={service.id} className="p-6 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-cyan-500 transition-colors">
                <DynamicIcon name={service.icon} className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{service.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-semibold text-teal-600 dark:text-teal-400 text-sm">{service.priceText}</span>
                  <Link href={`/book?service=${service.id}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* AC Types */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <LucideIcons.Settings className="w-5 h-5 text-cyan-500" /> Equipment Scope
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">We service the following types of Air Conditioning units up to 4 TR capacity:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AC_TYPES.filter(t => t.value !== 'other').map(type => (
                <li key={type.value} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <LucideIcons.CheckCircle2 className="w-4 h-4 text-teal-500" /> {type.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mt-10">
            <Link href="/book" className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md transition-colors">
              Schedule Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
