import { Metadata } from 'next';
import { createServerClientInstance } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/authorization/auth';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Audit Log',
  robots: 'noindex, nofollow',
};

export default async function AdminAuditPage() {
  await requireAdmin();
  const supabase = createServerClientInstance();

  const { data: auditLogs, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      admin_user:admin_users(email, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 mb-1">Audit Logs</h1>
          <p className="text-charcoal-600">Track all administrative changes, requirement updates, and entity modifications</p>
        </div>
        <Link href="/admin" className="btn-ghost text-sm">
          ← Dashboard
        </Link>
      </div>

      <div className="card overflow-hidden">
        {auditLogs && auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead className="bg-charcoal-50 border-b border-charcoal-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-charcoal-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-xs font-medium text-charcoal-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-xs font-medium text-charcoal-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-xs font-medium text-charcoal-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-3 text-xs font-medium text-charcoal-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-200">
                {auditLogs.map((log) => {
                  const adminEmail = (log.admin_user as any)?.email || 'Admin';
                  return (
                    <tr key={log.id} className="hover:bg-charcoal-50 transition-colors">
                      <td className="px-6 py-4 text-xs text-charcoal-500 font-mono whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-charcoal-900 whitespace-nowrap">
                        {adminEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          log.action === 'create' ? 'bg-green-50 text-green-700' :
                          log.action === 'update' ? 'bg-blue-50 text-blue-700' :
                          log.action === 'delete' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-700 whitespace-nowrap">
                        <span className="font-semibold">{log.entity_type}</span>
                        <span className="text-charcoal-400 font-mono text-xs ml-1.5">#{log.entity_id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-charcoal-600 max-w-md truncate">
                        {log.new_value ? (
                          <span>
                            {JSON.stringify(log.new_value).slice(0, 100)}...
                          </span>
                        ) : log.old_value ? (
                          <span className="text-charcoal-400">
                            (deleted) {JSON.stringify(log.old_value).slice(0, 80)}...
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-charcoal-500">
            No audit records found yet.
          </div>
        )}
      </div>
    </div>
  );
}
