import Link from 'next/link';
import type { Exam } from '@/types/database';

interface PopularExamsProps {
  exams: Exam[];
}

// Emblems mapping initials & theme colors for clean recognizable badges
const ORG_EMBLEMS: Record<string, { initials: string; bg: string }> = {
  'tnpsc': { initials: 'TN', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'upsc': { initials: 'UP', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  'ssc': { initials: 'SSC', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  'ibps': { initials: 'IBPS', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'rrb': { initials: 'RRB', bg: 'bg-red-50 text-red-700 border-red-200' },
  'sbi': { initials: 'SBI', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  'nta': { initials: 'NTA', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  'afcat': { initials: 'IAF', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
};

function getEmblem(slug: string, org: string) {
  const key = Object.keys(ORG_EMBLEMS).find(k => slug.toLowerCase().includes(k) || org.toLowerCase().includes(k));
  if (key) return ORG_EMBLEMS[key];
  return {
    initials: org.slice(0, 3).toUpperCase(),
    bg: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  };
}

export function PopularExams({ exams }: PopularExamsProps) {
  return (
    <section id="exams" className="py-14 md:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
              Popular Exams
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Quick access to frequently used exams and verified guidelines.
            </p>
          </div>
          <Link
            href="/#exams"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span>View all exams</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Grid of Clean Compact Cards matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {exams.map((exam) => {
            const emblem = getEmblem(exam.slug, exam.organization);
            return (
              <Link
                key={exam.id || exam.slug}
                href={`/${exam.slug}`}
                className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-sm transition-all text-center"
              >
                {/* Emblem / Logo Badge */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xs font-bold border mb-2.5 transition-transform group-hover:scale-105 ${emblem.bg}`}
                >
                  {emblem.initials}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-neutral-950 truncate w-full group-hover:text-neutral-700">
                  {exam.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 truncate w-full mt-0.5 leading-tight">
                  {exam.organization}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
