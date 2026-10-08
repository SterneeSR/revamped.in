'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'Is my image uploaded to your server?',
    a: 'No. All image processing (cropping, resizing, compression, and overlays) happens entirely within your web browser using HTML5 Canvas APIs. Your files never leave your device.',
  },
  {
    q: 'Which file format is supported?',
    a: 'We accept JPEG, PNG, and WebP input. The exported files are converted to official JPG/JPEG or PNG as mandated by the chosen examination requirements.',
  },
  {
    q: 'What if my file size is not within the limit?',
    a: 'Our smart compression engine iteratively adjusts image quality via a binary search algorithm to hit the required exact kilobyte range (e.g. 20–50 KB) without excessive artifacting.',
  },
  {
    q: 'Are these files officially accepted?',
    a: 'Files prepared with revamped.in match the exact pixel dimensions, aspect ratio, file size range, and name/date format prescribed in official exam notifications.',
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Quick answers to common questions about requirements and privacy.
            </p>
          </div>
          <Link
            href="/about"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span>View all FAQs</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Compact Horizontal Accordion Grid matching Reference image_0 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="border border-neutral-200 rounded-xl bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 text-left flex items-start justify-between gap-2 hover:bg-neutral-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900 leading-snug">
                    {faq.q}
                  </span>
                  <span className="text-neutral-400 font-bold text-base leading-none shrink-0 ml-1">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
