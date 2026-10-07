'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/branding/Logo';
import type { Exam } from '@/types/database';

interface ExamSearchSectionProps {
  exams: Exam[];
}

export function ExamSearchSection({ exams }: ExamSearchSectionProps) {
  const [query, setQuery] = useState('');

  const filteredExams = useMemo(() => {
    if (!query.trim()) return exams;
    const q = query.toLowerCase().trim();
    return exams.filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.organization.toLowerCase().includes(q) ||
      e.slug.toLowerCase().includes(q) ||
      (e.category && e.category.toLowerCase().includes(q))
    );
  }, [exams, query]);

  return (
    <section id="exams" className="py-20 md:py-28" aria-labelledby="exams-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="exams-heading" className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Find your exam
          </h2>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Search for your examination or select an option below. Each page specifies exact dimensions, file sizes, and provides the preparation tool.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              id="exam-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams: TNPSC, UPSC, SSC, IBPS, RRB, AFCAT..."
              className="input-field pl-12 pr-4 text-base"
              aria-label="Search exams"
            />
          </div>
          <p className="mt-2 text-xs text-charcoal-500 text-center">
            {query.trim()
              ? `Showing ${filteredExams.length} ${filteredExams.length === 1 ? 'exam' : 'exams'}`
              : 'Search by exam name, organization, or category'}
          </p>
        </div>

        {/* Exams Grid */}
        <div id="all-exams">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {filteredExams.map((exam) => (
              <Link
                key={exam.id || exam.slug}
                href={`/${exam.slug}`}
                className="card-hover p-5 flex items-center gap-4 group"
                role="listitem"
              >
                <div className="w-12 h-12 rounded-xl bg-charcoal-100 flex items-center justify-center group-hover:bg-charcoal-200 transition-colors shrink-0">
                  <Logo size="md" className="text-charcoal-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-charcoal-900 group-hover:text-charcoal-700 transition-colors truncate">
                    {exam.name}
                  </h4>
                  <p className="text-xs text-charcoal-500 truncate">{exam.organization}</p>
                </div>
                <div className="flex flex-wrap gap-1 shrink-0">
                  <span className="px-2 py-0.5 text-[11px] font-medium text-charcoal-700 bg-charcoal-100 rounded-full">
                    Photo
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-medium text-charcoal-700 bg-charcoal-100 rounded-full">
                    Sign
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12 text-charcoal-500">
              No examinations matching &quot;{query}&quot;. Try searching for another board or exam.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
