import React from 'react';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICE_AREAS, type ServiceArea } from '@/data/homepage-content';

function ServiceAreaCard({ area }: { area: ServiceArea }) {
  return (
    <article className="group relative h-full flex flex-col rounded-2xl p-6 bg-[#02192d]/80 border border-[#00d9ff]/25 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00d9ff]/70 hover:shadow-[0_12px_36px_rgba(0,217,255,0.15)]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#00d9ff]/40 bg-[#00d9ff]/10 text-[#00d9ff] transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(0,217,255,0.35)]">
          <MapPin className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-white">{area.name}</h3>
          <p className="text-[13px] text-[#00d8f3]/90 font-medium">{area.seoTitle}</p>
        </div>
      </div>

      <p className="mt-4 text-slate-300 text-[15px] leading-relaxed">{area.description}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Services available in ${area.name}`}>
        {area.services.map((s) => (
          <li key={s} className="inline-flex items-center gap-1 text-[12px] text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-[#00d8f3]" aria-hidden="true" /> {s}
          </li>
        ))}
      </ul>

      <a
        href="#book-now"
        aria-label={`Book AC service in ${area.name}, ${area.city}`}
        className="mt-6 pt-5 border-t border-white/10 inline-flex items-center gap-2 text-[#00d8f3] font-semibold text-sm transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d9ff] rounded-sm w-fit"
      >
        Book Service <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </article>
  );
}

export function ServiceAreas() {
  return (
    <section
      id="areas"
      aria-labelledby="areas-heading"
      className="relative py-20 scroll-mt-24 overflow-hidden text-white"
      style={{ background: 'linear-gradient(180deg, #031b31 0%, #02192d 100%)' }}
    >
      {/* Subtle cyan ambient glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,217,255,0.10), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00d9ff]/40 bg-[#00d9ff]/10 text-[#00d9ff] text-sm font-semibold mb-4">
            <MapPin className="w-4 h-4" aria-hidden="true" /> Areas We Serve
          </span>
          <h2 id="areas-heading" className="text-3xl md:text-4xl font-bold mb-4">
            AC &amp; HVAC Services Across Lahore
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Professional cooling solutions for homes, offices and businesses across Lahore.
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-6">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <ServiceAreaCard area={area} />
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-slate-400 text-sm">
          Don&apos;t see your area? Other parts of Lahore are covered subject to availability —{' '}
          <a href="#book-now" className="text-[#00d8f3] font-semibold hover:underline">send us a request</a>.
        </p>
      </div>
    </section>
  );
}
