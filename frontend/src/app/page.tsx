'use client';

import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { COMPANY, SERVICES, WHY_CHOOSE_US, SERVICE_METHODOLOGY, CLIENT_SEGMENTS, AMC_DETAILS } from '@/lib/constants';

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Check className={className} />;
}

export default function HomePage() {
  const primaryServices = SERVICES.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1: Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy to-brand-cyan/20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-3/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-cyan-400 mb-6">
              <LucideIcons.Shield className="w-4 h-4" />
              Engineering-Led HVAC Service • Kot Lakhpat, Lahore
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Engineered Service.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Professional Standards.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Professional AC service for business premises and homes in Lahore. We deliver documented, preventive care to keep your environment perfectly cooled.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/book" className="px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-semibold shadow-glow-cyan transition-all text-center">
                Book Online
              </Link>
              <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="px-6 py-3 rounded-md bg-transparent border-2 border-slate-700 hover:border-cyan-500 text-white font-semibold transition-all text-center flex items-center gap-2">
                <LucideIcons.Phone className="w-5 h-5" />
                Call / WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-2"><LucideIcons.CheckCircle2 className="text-teal-400 w-5 h-5" /> 4+ Years Experience</span>
              <span className="flex items-center gap-2"><LucideIcons.CheckCircle2 className="text-teal-400 w-5 h-5" /> Engineering-Led</span>
              <span className="flex items-center gap-2"><LucideIcons.CheckCircle2 className="text-teal-400 w-5 h-5" /> Documented Service</span>
            </div>
          </div>

          <div className="lg:w-2/5 w-full">
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-white">Quick Service Request</h3>
              <form className="space-y-4" action="/book">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">AC Type</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option>Wall Mounted Split AC</option>
                    <option>Floor Standing Cabinet</option>
                    <option>Cassette AC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Service Required</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    {primaryServices.map(s => <option key={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Area</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option>Kot Lakhpat</option>
                    <option>Model Town</option>
                    <option>Johar Town</option>
                    <option>DHA</option>
                    <option>Gulberg</option>
                  </select>
                </div>
                <button type="submit" className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-md transition-colors">
                  Proceed to Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Services Overview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Professional HVAC Services</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Expert care for your cooling systems, backed by engineering standards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {primaryServices.map((service) => (
              <div key={service.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col h-full group">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <DynamicIcon name={service.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{service.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{service.priceText}</span>
                  <Link href={`/book?service=${service.id}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1">
                    Book Now <LucideIcons.ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              View All Services <LucideIcons.ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Why Choose Us */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Prime Cooling Solutions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our commitment to engineering excellence sets us apart.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE_US.map((reason, i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-500">
                    <DynamicIcon name={reason.icon} className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{reason.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: AMC Highlight */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6 w-fit">
                  <LucideIcons.Award className="w-4 h-4" /> Highly Recommended for Businesses
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Annual Maintenance Contract</h2>
                <p className="text-slate-300 mb-8 text-lg">Year-round peace of mind. We take full responsibility for your cooling infrastructure.</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-extrabold text-cyan-400">Rs. 9,999</span>
                  <span className="text-slate-400 font-medium">/ AC / Year</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-300"><LucideIcons.CheckCircle className="text-teal-400 w-5 h-5" /> {AMC_DETAILS.pmVisits} Preventive Maintenance Visits</li>
                  <li className="flex items-center gap-3 text-slate-300"><LucideIcons.CheckCircle className="text-teal-400 w-5 h-5" /> Up to {AMC_DETAILS.breakdownVisits} Breakdown Response Visits</li>
                  <li className="flex items-center gap-3 text-slate-300"><LucideIcons.CheckCircle className="text-teal-400 w-5 h-5" /> Documented Service Reports</li>
                </ul>
                <div>
                  <Link href="/amc" className="inline-flex items-center gap-2 bg-white text-brand-navy px-6 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors">
                    Learn More About AMC <LucideIcons.ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative bg-slate-800/50">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Service Methodology */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Service Methodology</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">A systematic, documented approach to every job.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-2 relative z-10">
              {SERVICE_METHODOLOGY.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold mb-3 shadow-sm relative z-10">
                    {step.step}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h4>
                  <DynamicIcon name={step.icon} className="w-4 h-4 text-slate-400 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Client Segments */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Industries We Serve</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CLIENT_SEGMENTS.map((segment, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl text-center border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-colors">
                <DynamicIcon name={segment.icon} className="w-8 h-8 mx-auto text-teal-500 mb-4" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{segment.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: CTA Banner */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-navy" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Schedule an Inspection?</h2>
          <p className="text-xl text-slate-300 mb-10">Experience the difference of an engineering-led service team.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/book" className="w-full sm:w-auto px-8 py-4 rounded-md bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold text-lg shadow-glow-cyan transition-all">
              Book Online Now
            </Link>
            <span className="text-slate-400 font-medium">or</span>
            <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`} className="w-full sm:w-auto px-8 py-4 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition-colors border border-slate-700 flex items-center justify-center gap-2">
              <LucideIcons.PhoneCall className="w-5 h-5" /> {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
