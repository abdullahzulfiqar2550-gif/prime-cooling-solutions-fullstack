import React from 'react';
import { COMPANY, SERVICE_METHODOLOGY } from '@/lib/constants';
import { Target, Award, ShieldCheck, Zap, Cog, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-brand-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Prime Cooling Solutions</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">{COMPANY.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Engineering Excellence in HVAC</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Prime Cooling Solutions is not just another AC repair service. We are an engineering-led organization dedicated to bringing professional standards to the HVAC service industry in Lahore.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              With over 4 years of hands-on experience, our team focuses on technical precision, preventive care, and transparent service delivery. We cater primarily to commercial setups—offices, schools, salons, and retail spaces—that rely heavily on uninterrupted cooling.
            </p>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-l-4 border-cyan-500 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Leadership</h3>
              <p className="font-medium text-cyan-600 dark:text-cyan-400">{COMPANY.ceo}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Leading our technical teams with a rigorous engineering approach.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <Award className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
              <div className="font-bold text-2xl text-slate-900 dark:text-white mb-1">4+</div>
              <div className="text-sm text-slate-500">Years Experience</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <Target className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <div className="font-bold text-2xl text-slate-900 dark:text-white mb-1">B2B</div>
              <div className="text-sm text-slate-500">Focused Solutions</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 text-center col-span-2">
              <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <div className="font-bold text-lg text-slate-900 dark:text-white mb-1">Registered Entity</div>
              <div className="text-sm text-slate-500">Sole Proprietorship • Punjab EODB</div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Our Service Standards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Technical Diagnosis', desc: 'Root cause analysis before any repair.', icon: Cog },
              { title: 'Safety First', desc: 'Strict adherence to electrical & mechanical safety protocols.', icon: ShieldCheck },
              { title: 'Efficiency', desc: 'Optimizing systems for better energy consumption.', icon: Zap },
            ].map((std, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <std.icon className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{std.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">The Prime Cooling Workflow</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {SERVICE_METHODOLOGY.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {step.step}. {step.title}
                </div>
                {idx < SERVICE_METHODOLOGY.length - 1 && (
                  <ArrowRight className="w-5 h-5 mx-2 text-slate-300 dark:text-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
