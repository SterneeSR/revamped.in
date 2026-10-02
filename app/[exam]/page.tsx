import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamWithApplications } from '@/lib/supabase/queries';
import { Logo } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import { AdSlotExamPage } from '@/components/ads/AdSlot';
import { Button } from '@/components/ui/Button';

interface ExamPageProps {
  params: Promise<{ exam: string }>;
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { exam } = await params;
  return {
    title: exam.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: `Photo and signature requirements for ${exam.replace(/-/g, ' ')}. Resize and prepare your exam application files.`,
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { exam: examSlug } = await params;
  const examData = await getExamWithApplications(examSlug);
  
  if (!examData) {
    notFound();
  }

  const currentApp = examData.applications.find(app => app.is_current);
  const activeApps = examData.applications.filter(app => app.status === 'active' || app.status === 'closed');

  return (
    <div className="relative min-h-screen">
      <GeometricAccent variant="hero" className="absolute top-0 left-0 right-0 h-64 -z-10" />
      
      {/* Hero */}
      <header className="relative py-16 md:py-24" aria-labelledby="exam-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Logo size="lg" />
            <span className="text-sm font-medium text-charcoal-500 uppercase tracking-wider">
              {examData.organization}
            </span>
          </div>
          <h1 id="exam-title" className="text-3xl md:text-5xl font-bold text-charcoal-900 mb-4 text-balance">
            {examData.name}
          </h1>
          {examData.description && (
            <p className="text-lg text-charcoal-600 max-w-2xl mb-6">
              {examData.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
            {currentApp && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></span>
                Current: {currentApp.name}
              </span>
            )}
            {examData.official_website && (
              <Link
                href={examData.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-charcoal-900 transition-colors underline underline-offset-2"
              >
                Official website →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Ad Slot */}
      <section className="py-6 border-y border-charcoal-200" aria-label="Advertisement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlotExamPage />
        </div>
      </section>

      {/* Applications */}
      <main className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-4">
              Application Cycles
            </h2>
            <p className="text-charcoal-600 max-w-2xl">
              Select the application cycle to view exact requirements and access the preparation tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {examData.applications.map((app) => (
              <Link
                key={app.id}
                href={`/${examSlug}/${app.slug}`}
                className={`card p-6 relative overflow-hidden ${app.is_current ? 'ring-2 ring-green-500' : ''}`}
              >
                {app.is_current && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-10" aria-hidden="true" />
                )}
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal-900 mb-1">
                        {app.name}
                      </h3>
                      {app.notification_cycle && (
                        <p className="text-sm text-charcoal-500">
                          Notification: {app.notification_cycle}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${
                      app.status === 'active' ? 'bg-green-50 text-green-700' :
                      app.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                      app.status === 'closed' ? 'bg-charcoal-100 text-charcoal-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  {app.effective_date && (
                    <p className="text-sm text-charcoal-500 mb-4">
                      Effective: {new Date(app.effective_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  
                  {app.verified_at && (
                    <p className="text-xs text-charcoal-400 mb-4">
                      Last verified: {new Date(app.verified_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium text-charcoal-700 bg-charcoal-100 rounded-full">
                      Photo
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium text-charcoal-700 bg-charcoal-100 rounded-full">
                      Signature
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {examData.applications.length === 0 && (
            <div className="text-center py-16">
              <GeometricAccent variant="empty" className="mb-6" />
              <h3 className="text-lg font-medium text-charcoal-900 mb-2">No application cycles yet</h3>
              <p className="text-charcoal-600">Application cycles will appear here when available.</p>
            </div>
          )}
        </div>
      </main>

      {/* Privacy Note */}
      <section className="py-12 bg-charcoal-50 border-t border-charcoal-200" aria-labelledby="privacy-note">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="privacy-note" className="text-lg font-semibold text-charcoal-900 mb-2">Privacy</h2>
          <p className="text-charcoal-600 text-sm">
            Your images are processed in your browser and are not uploaded to our servers.
          </p>
        </div>
      </section>
    </div>
  );
}