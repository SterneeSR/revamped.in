'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoWithText } from '@/components/branding/Logo';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2 select-none group" aria-label="revamped.in">
            <LogoWithText size="md" />
          </Link>

          {/* Center Navigation: Desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <Link
              href="/#exams"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Exams
            </Link>
            <Link
              href="/#tools"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Navigation CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#exams"
              className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="Search exams"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/#exams"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <span>Choose an Exam</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/#exams"
              className="p-2 text-neutral-600 hover:text-neutral-900"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-neutral-100 space-y-2">
            <Link
              href="/#exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Exams
            </Link>
            <Link
              href="/#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Tools
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              About
            </Link>
            <div className="pt-2 px-3">
              <Link
                href="/#exams"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 text-white"
              >
                <span>Choose an Exam</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
