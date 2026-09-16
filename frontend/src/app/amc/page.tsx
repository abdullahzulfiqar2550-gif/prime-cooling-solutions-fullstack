import React from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, FileCheck, ShieldAlert } from 'lucide-react';
import { AMC_DETAILS } from '@/lib/constants';

export default function AMCPage() {
  const inclusions = [
    'Cleaning of indoor unit filters, coils, and blower.',
    'Cleaning of outdoor unit condenser coil.',
    'Checking of refrigerant pressure and top-up (if required).',
    'Inspection of electrical connections and components.',
    'Checking and unblocking of drainage pipes.',
    'Performance testing (cooling efficiency, thermostat calibration).',
    'Priority scheduling for breakdown response.',
  ];

  const exclusions = [
    'Cost of spare parts (compressor, fan motor, PCB, etc.).',
    'Cost of full gas charging due to major leaks.',
    'Copper piping replacements or major ductwork.',
    'New installations or shifting of units.',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-brand-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Annual Maintenance Contract</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Protect your investment with year-round expert care.</p>
          <div className="inline-flex items-baseline gap-2 bg-slate-800/80 px-6 py-3 rounded-xl border border-slate-700">
            <span className="text-4xl font-extrabold text-cyan-400">{AMC_DETAILS.price.split(' ')[0]} {AMC_DETAILS.price.split(' ')[1]}</span>
            <span className="text-slate-300 font-medium">/ AC / Year</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <FileCheck className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{AMC_DETAILS.pmVisits}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Preventive Maintenance Visits</div>
            </div>
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{AMC_DETAILS.breakdownVisits}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Breakdown Responses</div>
            </div>
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <CheckCircle2 className="w-10 h-10 text-teal-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{AMC_DETAILS.totalVisits}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Visits Included</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="text-teal-500" /> Contract Inclusions
              </h3>
              <ul className="space-y-4">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <XCircle className="text-red-500" /> Contract Exclusions
              </h3>
              <ul className="space-y-4">
                {exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  <strong>Note:</strong> Eligibility is restricted to AC systems up to 2 TR capacity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md transition-colors text-lg">
              Request AMC Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
