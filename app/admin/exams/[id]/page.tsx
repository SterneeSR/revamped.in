import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClientInstance } from '@/lib/supabase/server';
import { ExamEditForm } from './ExamEditForm';
import { ApplicationsManager } from './ApplicationsManager';

export const metadata: Metadata = {
  title: 'Edit Exam',
  robots: 'noindex, nofollow',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminExamDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServerClientInstance();

  // Try fetching by ID first, then by slug if not UUID
  let query = supabase
    .from('exams')
    .select(`
      *,
      applications:applications(
        *,
        photo_requirement:photo_requirements(*),
        signature_requirement:signature_requirements(*)
      )
    `);

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUUID) {
    query = query.eq('id', id);
  } else {
    query = query.eq('slug', id);
  }

  const { data: exam, error } = await query.single();

  if (error || !exam) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/admin/exams" className="btn-ghost text-sm mb-2 inline-flex">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Exams
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-charcoal-900">{exam.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              exam.active ? 'bg-green-50 text-green-700' : 'bg-charcoal-100 text-charcoal-700'
            }`}>
              {exam.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-charcoal-500 mt-1">Slug: {exam.slug} • Organization: {exam.organization}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${exam.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            View Public Page ↗
          </Link>
        </div>
      </div>

      {/* Exam Edit Form */}
      <section aria-labelledby="exam-settings-heading">
        <h2 id="exam-settings-heading" className="text-xl font-bold text-charcoal-900 mb-4">Exam Configuration</h2>
        <ExamEditForm exam={exam} />
      </section>

      {/* Applications & Requirements Manager */}
      <section aria-labelledby="applications-heading" className="pt-4 border-t border-charcoal-200">
        <h2 id="applications-heading" className="text-xl font-bold text-charcoal-900 mb-4">Application Cycles & Requirements</h2>
        <ApplicationsManager examId={exam.id} initialApplications={exam.applications || []} />
      </section>
    </div>
  );
}
