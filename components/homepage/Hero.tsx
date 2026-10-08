'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import type { Exam } from '@/types/database';

interface HeroProps {
  exams: Exam[];
}

const POPULAR_CHIPS = [
  { label: 'TNPSC', slug: 'tnpsc-group-ii' },
  { label: 'UPSC', slug: 'upsc-civil-services' },
  { label: 'SSC', slug: 'ssc-cgl' },
  { label: 'IBPS', slug: 'ibps-po' },
  { label: 'RRB', slug: 'rrb-ntpc' },
  { label: 'SBI', slug: 'ibps-po' },
  { label: 'NTA', slug: 'ssc-cgl' },
  { label: 'AFCAT', slug: 'afcat' },
];

export function Hero({ exams }: HeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const matched = exams.find(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.organization.toLowerCase().includes(q) ||
        ex.slug.toLowerCase().includes(q)
    );
    if (matched) {
      router.push(`/${matched.slug}`);
    } else {
      // scroll to popular exams section with query
      const target = document.getElementById('exams');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-neutral-200 overflow-hidden bg-white">
      {/* Subtle Geometric Tessellation in Top Right (Exact Reference Match) */}
      <div className="absolute -top-12 -right-16 w-80 h-80 md:w-[480px] md:h-[480px] pointer-events-none opacity-90 z-0">
        <GeometricAccent variant="hero" className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
              <span>Exam Photos & Signatures Made Simple</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08] text-balance">
              Prepare your <br />
              <span className="text-neutral-900">exam files.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed text-balance">
              Resize photographs and signatures to the dimensions, format and file-size requirements specified for your application.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="relative flex items-center p-1.5 rounded-2xl border-2 border-neutral-300 bg-white shadow-sm focus-within:border-neutral-950 transition-colors">
                <div className="pl-3.5 pr-2 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for an exam (e.g. TNPSC, UPSC, SSC...)"
                  className="w-full bg-transparent text-sm md:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs md:text-sm font-semibold hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <span>Search</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Popular Exam Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-neutral-500 mr-1">Popular:</span>
              {POPULAR_CHIPS.map((chip) => (
                <Link
                  key={chip.label}
                  href={`/${chip.slug}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Specification Mockups (Faithful to Reference image_0) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center pt-4 lg:pt-0">
            {/* Top Photo Mockup */}
            <div className="relative">
              {/* Width indicator */}
              <div className="absolute -top-5 left-0 right-0 flex items-center justify-center text-[10px] font-mono text-neutral-500">
                <span className="border-b border-dashed border-neutral-400 w-full absolute top-1/2" />
                <span className="bg-white px-2 relative z-10 font-medium">125 px</span>
              </div>
              {/* Height indicator */}
              <div className="absolute -left-6 top-0 bottom-0 flex items-center justify-center text-[10px] font-mono text-neutral-500">
                <span className="border-l border-dashed border-neutral-400 h-full absolute left-1/2" />
                <span className="bg-white py-1 relative z-10 font-medium -rotate-90">165 px</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Photo Card with Name/Date Banner */}
                <div className="w-36 h-48 sm:w-40 sm:h-52 bg-white rounded-lg border-2 border-neutral-900 shadow-md flex flex-col overflow-hidden relative">
                  {/* Portrait Placeholder Avatar */}
                  <div className="flex-1 bg-gradient-to-b from-neutral-100 to-neutral-200 flex items-center justify-center relative">
                    <svg className="w-20 h-20 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {/* Name and Date Bottom Banner */}
                  <div className="bg-white border-t border-neutral-200 py-1 px-2 text-center select-none">
                    <div className="text-[10px] font-bold text-neutral-900 tracking-wider">RAHUL KUMAR</div>
                    <div className="text-[8px] font-mono text-neutral-600">15 / 03 / 2026</div>
                  </div>
                </div>

                {/* Photo Badge Specs */}
                <div className="bg-neutral-900 text-white rounded-xl p-3 shadow-lg space-y-1.5 text-xs font-mono min-w-[130px]">
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-semibold">
                    <span>✓</span>
                    <span>165 × 125 px</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400">
                    <span>✓</span>
                    <span>30 – 40 KB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400">
                    <span>✓</span>
                    <span>JPEG</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400">
                    <span>✓</span>
                    <span>Name & Date</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Signature Mockup */}
            <div className="relative mt-6 ml-12 sm:ml-16">
              {/* Width indicator */}
              <div className="absolute -top-4 left-0 right-0 flex items-center justify-center text-[10px] font-mono text-neutral-500">
                <span className="border-b border-dashed border-neutral-400 w-full absolute top-1/2" />
                <span className="bg-white px-2 relative z-10 font-medium">125 px</span>
              </div>
              {/* Height indicator */}
              <div className="absolute -left-6 top-0 bottom-0 flex items-center justify-center text-[10px] font-mono text-neutral-500">
                <span className="border-l border-dashed border-neutral-400 h-full absolute left-1/2" />
                <span className="bg-white py-1 relative z-10 font-medium -rotate-90">80 px</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Signature Box */}
                <div className="w-36 h-20 sm:w-40 sm:h-24 bg-white rounded-lg border-2 border-neutral-900 shadow-md flex items-center justify-center p-2">
                  {/* Vector cursive signature preview */}
                  <svg className="w-24 h-12 text-neutral-900 stroke-current" fill="none" viewBox="0 0 100 40">
                    <path
                      d="M10 25 C 20 10, 30 5, 40 25 C 45 35, 50 15, 60 20 C 70 25, 75 10, 90 28"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Signature Badge Specs */}
                <div className="bg-neutral-900 text-white rounded-xl p-3 shadow-lg space-y-1.5 text-xs font-mono min-w-[130px]">
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-semibold">
                    <span>✓</span>
                    <span>80 × 125 px</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400">
                    <span>✓</span>
                    <span>20 – 30 KB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400">
                    <span>✓</span>
                    <span>JPEG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
