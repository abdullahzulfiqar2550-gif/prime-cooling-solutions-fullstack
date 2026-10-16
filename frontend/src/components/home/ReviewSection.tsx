'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, ThumbsUp, Quote } from 'lucide-react';
import { REVIEWS, REVIEW_SUMMARY, REVIEWS_ARE_DEMO, type Review } from '@/data/homepage-content';

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 50;

function getPerView(width: number) {
  if (width < 768) return 1;
  if (width < 1200) return 2;
  return 3;
}

function Stars({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={`${size} transition-[filter] duration-300 ${
            n <= rating ? 'fill-[#00d8f3] text-[#00d8f3]' : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

  return (
    <article className="group relative h-full flex flex-col bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(3,27,49,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_36px_rgba(3,27,49,0.12)] hover:border-[#00d9ff]/40">
      <Quote className="absolute top-5 right-5 w-8 h-8 text-[#00d9ff]/10" aria-hidden="true" />

      <div className="group-hover:[&_svg]:drop-shadow-[0_0_6px_rgba(0,216,243,0.6)]">
        <Stars rating={review.rating} />
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-[#102c50]/80 flex-grow">&ldquo;{review.review}&rdquo;</p>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #078dc8, #00d8f3)' }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="font-bold text-[#102c50] text-[15px] truncate">{review.name}</h3>
          <p className="flex items-center gap-1 text-[13px] text-slate-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#00b8d9] flex-shrink-0 group-hover:animate-pulse" aria-hidden="true" />
            {review.location}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#078dc8] bg-[#00d9ff]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
          {review.service}
        </span>
      </div>
    </article>
  );
}

export function ReviewSection() {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const maxIndex = Math.max(0, REVIEWS.length - perView);

  // Responsive cards-per-view
  useEffect(() => {
    const update = () => setPerView(getPerView(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keep index valid when perView changes
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const next = useCallback(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);
  const prev = useCallback(() => setIndex((i) => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);

  // Autoplay (paused on hover/focus, disabled for reduced-motion users)
  useEffect(() => {
    if (paused || maxIndex === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, next, maxIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (delta <= -SWIPE_THRESHOLD) next();
      else if (delta >= SWIPE_THRESHOLD) prev();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-20 bg-[#031b31] text-white scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00d9ff]/10 text-[#078dc8] text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" aria-hidden="true" /> Trusted by customers across Lahore
          </span>
          <h2 id="reviews-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            From residential AC repair to commercial HVAC maintenance, our customers trust Prime Cooling Solutions for
            professional, reliable and timely cooling services.
          </p>
        </div>

        {/* Summary */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 mb-12">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#031b31] text-white border border-[#00d8f3]/30 shadow-lg">
            <div className="w-12 h-12 rounded-full border border-[#00d8f3] flex items-center justify-center text-[#00d8f3]">
              <Star className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-2xl">{REVIEW_SUMMARY.rating}</strong>
                <Stars rating={Math.round(REVIEW_SUMMARY.ratingValue)} size="w-3.5 h-3.5" />
              </div>
              <span className="text-white/70 text-sm">{REVIEW_SUMMARY.ratingLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#031b31] text-white border border-[#00d8f3]/30 shadow-lg">
            <div className="w-12 h-12 rounded-full border border-[#00d8f3] flex items-center justify-center text-[#00d8f3]">
              <ThumbsUp className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <strong className="text-2xl block">{REVIEW_SUMMARY.customers}</strong>
              <span className="text-white/70 text-sm">{REVIEW_SUMMARY.customersLabel}</span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d9ff] rounded-2xl"
        >
          <div className="overflow-hidden -mx-3" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <ul
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${(index * 100) / perView}%)` }}
            >
              {REVIEWS.map((review, i) => {
                const visible = i >= index && i < index + perView;
                return (
                  <li
                    key={`${review.name}-${i}`}
                    className="flex-shrink-0 px-3 py-3"
                    style={{ width: `${100 / perView}%` }}
                    aria-roledescription="slide"
                    aria-label={`Review ${i + 1} of ${REVIEWS.length}`}
                    aria-hidden={!visible}
                  >
                    <ReviewCard review={review} />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Controls */}
          {maxIndex > 0 && (
            <div className="mt-8 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reviews"
                className="w-11 h-11 rounded-full border border-[#00b8d9]/40 bg-white text-[#078dc8] flex items-center justify-center shadow-sm transition-all hover:bg-[#00d8f3] hover:text-[#031b31] hover:border-[#00d8f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d9ff] focus-visible:ring-offset-2"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to review set ${i + 1}`}
                    aria-current={i === index}
                    className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d9ff] ${
                      i === index ? 'w-7 bg-[#00d8f3]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="w-11 h-11 rounded-full border border-[#00b8d9]/40 bg-white text-[#078dc8] flex items-center justify-center shadow-sm transition-all hover:bg-[#00d8f3] hover:text-[#031b31] hover:border-[#00d8f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d9ff] focus-visible:ring-offset-2"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {REVIEWS_ARE_DEMO && (
          <p className="mt-6 text-center text-xs text-slate-400">
            Sample reviews shown for illustration purposes.
          </p>
        )}
      </div>
    </section>
  );
}
