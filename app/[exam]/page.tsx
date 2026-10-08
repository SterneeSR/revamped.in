import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamWithApplications } from '@/lib/supabase/queries';
import { AdSlotExamPage } from '@/components/ads/AdSlot';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';

interface ExamPageProps {
  params: Promise<{ exam: string }>;
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { exam } = await params;
  const examData = await getExamWithApplications(exam);
  if (!examData) {
    return { title: 'Exam Not Found | revamped.in' };
  }
  return {
    title: `${examData.name} Photo & Signature Resize Requirements`,
    description: `Official photo and signature dimensions, file size, and format specifications for ${examData.name} (${examData.organization}). Free online preparation utility.`,
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { exam: examSlug } = await params;
  const examData = await getExamWithApplications(examSlug);

  if (!examData) {
    notFound();
  }

  const currentApp = examData.applications.find((app) => app.is_current);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner / Breadcrumb Header */}
      <section className="relative border-b border-neutral-200 bg-neutral-50/50 py-10 md:py-14 overflow-hidden">
        {/* Subtle Geometric Tessellation top right */}
        <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-40">
          <GeometricAccent variant="hero" className="w-full h-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#exams" className="hover:text-neutral-900 transition-colors">Exams</Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">{examData.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
                  {examData.organization}
                </span>
                {currentApp && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    Current: {currentApp.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
                {examData.name}
              </h1>
              {examData.description && (
                <p className="text-sm md:text-base text-neutral-600 mt-2 max-w-2xl leading-relaxed">
                  {examData.description}
                </p>
              )}
            </div>

            {examData.official_website && (
              <div className="shrink-0">
                <Link
                  href={examData.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition-all shadow-sm"
                >
                  <span>Official Website</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ad slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdSlotExamPage />
      </div>

      {/* Application Cycles Grid */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
              Application Cycles & Notifications
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Select your application notification cycle to prepare compliant photographs and signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examData.applications.map((app) => (
              <Link
                key={app.id}
                href={`/${examSlug}/${app.slug}`}
                className={`group p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  app.is_current
                    ? 'border-neutral-900 ring-1 ring-neutral-900 bg-white shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        app.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'upcoming'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {app.status}
                    </span>
                    {app.is_current && (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors">
                    {app.name}
                  </h3>

                  {app.notification_cycle && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Cycle: {app.notification_cycle}
                    </p>
                  )}

                  {app.verified_at && (
                    <p className="text-[11px] text-neutral-400 mt-3">
                      Verified: {new Date(app.verified_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-neutral-100 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-700">Photo</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-700">Signature</span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Prepare Tools →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {examData.applications.length === 0 && (
            <div className="p-12 text-center border border-dashed border-neutral-300 rounded-2xl text-neutral-500">
              No application cycles configured for this exam yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}