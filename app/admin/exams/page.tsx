import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClientInstance } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';

export const metadata: Metadata = {
  title: 'Manage Exams',
  robots: 'noindex, nofollow',
};

export default async function AdminExamsPage() {
  const supabase = createServerClientInstance();
  
  const { data: exams, error } = await supabase
    .from('exams')
    .select(`
      *,
      applications:applications(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch exams');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 mb-1">Manage Exams</h1>
          <p className="text-charcoal-600">Create, edit, and organize examinations</p>
        </div>
        <Link href="/admin/exams/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Exam
          </Button>
        </Link>
      </div>

      {/* Exams Table */}
      <div className="card overflow-hidden">
        {exams && exams.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="bg-charcoal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 uppercase tracking-wider">Exam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 uppercase tracking-wider">Organization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-charcoal-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-200">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-charcoal-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/exams/${exam.id}`} className="font-medium text-charcoal-900 hover:text-charcoal-700">
                          {exam.name}
                        </Link>
                        <p className="text-sm text-charcoal-500">{exam.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-charcoal-700">{exam.organization}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-charcoal-100 text-charcoal-700 capitalize">
                          {exam.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-charcoal-700">
                        {exam.applications?.[0]?.count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exam.active ? 'bg-green-50 text-green-700' : 'bg-charcoal-100 text-charcoal-700'
                        }`}>
                          {exam.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-500">
                        {new Date(exam.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/exams/${exam.id}`} className="btn-ghost text-sm">
                            Edit
                          </Link>
                          <Link href={`/${exam.slug}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <GeometricAccent variant="empty" className="mb-4" />
            <h2 className="text-lg font-medium text-charcoal-900 mb-2">No exams yet</h2>
            <p className="text-charcoal-600 mb-6">Create your first exam to get started.</p>
            <Link href="/admin/exams/new">
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Exam
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}