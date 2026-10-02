import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClientInstance } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: 'noindex, nofollow',
};

export default async function AdminDashboard() {
  const supabase = createServerClientInstance();
  
  const [
    { count: totalExams },
    { count: activeExams },
    { count: activeApplications },
    { data: recentChanges },
    { data: recentAudits },
  ] = await Promise.all([
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('applications').select('*', { count: 'exact', head: true }).in('status', ['active', 'upcoming']),
    supabase
      .from('exams')
      .select('id, name, slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase
      .from('audit_logs')
      .select('id, action, entity_type, entity_id, created_at, admin_user_id')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900 mb-2">Admin Dashboard</h1>
        <p className="text-charcoal-600">Manage exams, applications, and requirements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-500 uppercase tracking-wider">Total Exams</p>
              <p className="text-3xl font-bold text-charcoal-900 mt-1">{totalExams || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-charcoal-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-500 uppercase tracking-wider">Active Exams</p>
              <p className="text-3xl font-bold text-charcoal-900 mt-1">{activeExams || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-500 uppercase tracking-wider">Active Applications</p>
              <p className="text-3xl font-bold text-charcoal-900 mt-1">{activeApplications || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/exams/new">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Exam
            </Button>
          </Link>
          <Link href="/admin/exams">
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Manage Exams
            </Button>
          </Link>
          <Link href="/admin/audit">
            <Button variant="ghost">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Audit Log
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Changes & Audit Log */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Exam Changes */}
        <div className="card">
          <div className="p-4 border-b border-charcoal-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal-900">Recently Updated Exams</h2>
            <Link href="/admin/exams" className="text-sm text-charcoal-500 hover:text-charcoal-900">View all →</Link>
          </div>
          <div className="divide-y divide-charcoal-200">
            {recentChanges?.length ? (
              recentChanges.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/admin/exams/${exam.slug}`}
                  className="p-4 hover:bg-charcoal-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-charcoal-900">{exam.name}</p>
                    <p className="text-sm text-charcoal-500">{exam.slug}</p>
                  </div>
                  <time className="text-sm text-charcoal-400" dateTime={exam.updated_at}>
                    {new Date(exam.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-charcoal-500">
                <GeometricAccent variant="empty" className="mb-3" />
                <p>No exams yet. Create your first exam.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Actions */}
        <div className="card">
          <div className="p-4 border-b border-charcoal-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal-900">Recent Audit Log</h2>
            <Link href="/admin/audit" className="text-sm text-charcoal-500 hover:text-charcoal-900">View all →</Link>
          </div>
          <div className="divide-y divide-charcoal-200">
            {recentAudits?.length ? (
              recentAudits.map((audit) => (
                <div key={audit.id} className="p-4 hover:bg-charcoal-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          audit.action === 'create' ? 'bg-green-50 text-green-700' :
                          audit.action === 'update' ? 'bg-blue-50 text-blue-700' :
                          audit.action === 'delete' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {audit.action}
                        </span>
                        <span className="font-medium text-charcoal-900">{audit.entity_type}</span>
                        <span className="text-charcoal-400">#{audit.entity_id.slice(0, 8)}</span>
                      </div>
                      <p className="text-xs text-charcoal-500">
                        {new Date(audit.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-charcoal-500">
                <GeometricAccent variant="empty" className="mb-3" />
                <p>No audit entries yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}