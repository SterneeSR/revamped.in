'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface PhotoRequirement {
  id?: string;
  enabled: boolean;
  width: number;
  height: number;
  min_kb: number;
  max_kb: number;
  allowed_formats: string[];
  name_required: boolean;
  date_required: boolean;
  background_instructions?: string | null;
  additional_instructions?: string | null;
}

interface SignatureRequirement {
  id?: string;
  enabled: boolean;
  width: number;
  height: number;
  min_kb: number;
  max_kb: number;
  allowed_formats: string[];
  additional_instructions?: string | null;
}

interface ApplicationData {
  id: string;
  exam_id: string;
  name: string;
  slug: string;
  notification_cycle: string | null;
  effective_date: string | null;
  status: 'upcoming' | 'active' | 'closed' | 'archived';
  official_source_url: string | null;
  verified_at: string | null;
  is_current: boolean;
  photo_requirement?: PhotoRequirement[] | PhotoRequirement | null;
  signature_requirement?: SignatureRequirement[] | SignatureRequirement | null;
}

interface ApplicationsManagerProps {
  examId: string;
  initialApplications: ApplicationData[];
}

export function ApplicationsManager({ examId, initialApplications }: ApplicationsManagerProps) {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationData[]>(initialApplications);
  const [editingApp, setEditingApp] = useState<ApplicationData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [appForm, setAppForm] = useState({
    name: '',
    slug: '',
    notification_cycle: '',
    effective_date: '',
    status: 'active' as 'upcoming' | 'active' | 'closed' | 'archived',
    official_source_url: '',
    verified_at: new Date().toISOString().split('T')[0],
    is_current: false,
    // Photo requirements
    photo_width: 165,
    photo_height: 125,
    photo_min_kb: 30,
    photo_max_kb: 40,
    photo_name_required: false,
    photo_date_required: false,
    photo_background: '',
    photo_instructions: '',
    // Signature requirements
    sig_width: 80,
    sig_height: 125,
    sig_min_kb: 20,
    sig_max_kb: 30,
    sig_instructions: '',
  });

  const openNewForm = () => {
    setIsCreating(true);
    setEditingApp(null);
    setAppForm({
      name: '',
      slug: '',
      notification_cycle: new Date().getFullYear().toString(),
      effective_date: new Date().toISOString().split('T')[0],
      status: 'active',
      official_source_url: '',
      verified_at: new Date().toISOString().split('T')[0],
      is_current: applications.length === 0,
      photo_width: 165,
      photo_height: 125,
      photo_min_kb: 30,
      photo_max_kb: 40,
      photo_name_required: false,
      photo_date_required: false,
      photo_background: 'White or light colored background',
      photo_instructions: '',
      sig_width: 80,
      sig_height: 125,
      sig_min_kb: 20,
      sig_max_kb: 30,
      sig_instructions: 'Sign with black ink on white paper',
    });
    setError(null);
  };

  const openEditForm = (app: ApplicationData) => {
    setIsCreating(false);
    setEditingApp(app);

    const photoReq = Array.isArray(app.photo_requirement) ? app.photo_requirement[0] : app.photo_requirement;
    const sigReq = Array.isArray(app.signature_requirement) ? app.signature_requirement[0] : app.signature_requirement;

    setAppForm({
      name: app.name,
      slug: app.slug,
      notification_cycle: app.notification_cycle || '',
      effective_date: app.effective_date || '',
      status: app.status,
      official_source_url: app.official_source_url || '',
      verified_at: app.verified_at ? app.verified_at.split('T')[0] : '',
      is_current: app.is_current,
      photo_width: photoReq?.width || 165,
      photo_height: photoReq?.height || 125,
      photo_min_kb: photoReq?.min_kb || 30,
      photo_max_kb: photoReq?.max_kb || 40,
      photo_name_required: Boolean(photoReq?.name_required),
      photo_date_required: Boolean(photoReq?.date_required),
      photo_background: photoReq?.background_instructions || '',
      photo_instructions: photoReq?.additional_instructions || '',
      sig_width: sigReq?.width || 80,
      sig_height: sigReq?.height || 125,
      sig_min_kb: sigReq?.min_kb || 20,
      sig_max_kb: sigReq?.max_kb || 30,
      sig_instructions: sigReq?.additional_instructions || '',
    });
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      exam_id: examId,
      name: appForm.name,
      slug: appForm.slug,
      notification_cycle: appForm.notification_cycle || null,
      effective_date: appForm.effective_date || null,
      status: appForm.status,
      official_source_url: appForm.official_source_url || null,
      verified_at: appForm.verified_at || null,
      is_current: appForm.is_current,
      photo_requirement: {
        width: Number(appForm.photo_width),
        height: Number(appForm.photo_height),
        min_kb: Number(appForm.photo_min_kb),
        max_kb: Number(appForm.photo_max_kb),
        allowed_formats: ['jpg', 'jpeg'],
        name_required: appForm.photo_name_required,
        date_required: appForm.photo_date_required,
        background_instructions: appForm.photo_background || null,
        additional_instructions: appForm.photo_instructions || null,
      },
      signature_requirement: {
        width: Number(appForm.sig_width),
        height: Number(appForm.sig_height),
        min_kb: Number(appForm.sig_min_kb),
        max_kb: Number(appForm.sig_max_kb),
        allowed_formats: ['jpg', 'jpeg'],
        additional_instructions: appForm.sig_instructions || null,
      },
    };

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create application');
      } else if (editingApp) {
        const res = await fetch(`/api/admin/applications/${editingApp.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update application');
      }

      setIsCreating(false);
      setEditingApp(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving application');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appId: string, appName: string) => {
    if (!window.confirm(`Delete application cycle "${appName}"? This will also remove its photo/signature requirements.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      setApplications(prev => prev.filter(a => a.id !== appId));
      if (editingApp?.id === appId) {
        setEditingApp(null);
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete application');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-600">
          Manage different notification cycles (e.g. 2025 vs 2026) and their specific photo/signature constraints.
        </p>
        {!isCreating && !editingApp && (
          <Button onClick={openNewForm} size="sm">
            + Add Application Cycle
          </Button>
        )}
      </div>

      {/* Editor / Creator Form */}
      {(isCreating || editingApp) && (
        <form onSubmit={handleSave} className="card p-6 border-2 border-charcoal-900 bg-white space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200 pb-3">
            <h3 className="text-lg font-bold text-charcoal-900">
              {isCreating ? 'Create New Application Cycle' : `Edit ${editingApp?.name}`}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setIsCreating(false); setEditingApp(null); }}
            >
              Cancel
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">
                Cycle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={appForm.name}
                onChange={e => setAppForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Group II 2026"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={appForm.slug}
                onChange={e => setAppForm(p => ({ ...p, slug: e.target.value }))}
                placeholder="e.g. group-ii-2026"
                className="input-field"
                required
                pattern="^[a-z0-9-]+$"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Notification Cycle</label>
              <input
                type="text"
                value={appForm.notification_cycle}
                onChange={e => setAppForm(p => ({ ...p, notification_cycle: e.target.value }))}
                placeholder="e.g. 2026 or 01/2026"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Effective Date</label>
              <input
                type="date"
                value={appForm.effective_date}
                onChange={e => setAppForm(p => ({ ...p, effective_date: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Status</label>
              <select
                value={appForm.status}
                onChange={e => setAppForm(p => ({ ...p, status: e.target.value as any }))}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Official Source URL</label>
              <input
                type="url"
                value={appForm.official_source_url}
                onChange={e => setAppForm(p => ({ ...p, official_source_url: e.target.value }))}
                placeholder="https://official-board.gov.in/notification.pdf"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Verified Date</label>
              <input
                type="date"
                value={appForm.verified_at}
                onChange={e => setAppForm(p => ({ ...p, verified_at: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_current"
              checked={appForm.is_current}
              onChange={e => setAppForm(p => ({ ...p, is_current: e.target.checked }))}
              className="w-4 h-4 rounded border-charcoal-300 text-charcoal-900 focus:ring-charcoal-500"
            />
            <label htmlFor="is_current" className="text-sm font-medium text-charcoal-700 cursor-pointer">
              Set as current active cycle for this exam
            </label>
          </div>

          {/* Photo Requirements Fieldset */}
          <fieldset className="border border-charcoal-200 rounded-lg p-4 space-y-4">
            <legend className="text-sm font-bold text-charcoal-900 px-2">📷 Photo Requirements</legend>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={appForm.photo_width}
                  onChange={e => setAppForm(p => ({ ...p, photo_width: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={appForm.photo_height}
                  onChange={e => setAppForm(p => ({ ...p, photo_height: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Min KB</label>
                <input
                  type="number"
                  value={appForm.photo_min_kb}
                  onChange={e => setAppForm(p => ({ ...p, photo_min_kb: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Max KB</label>
                <input
                  type="number"
                  value={appForm.photo_max_kb}
                  onChange={e => setAppForm(p => ({ ...p, photo_max_kb: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm text-charcoal-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appForm.photo_name_required}
                  onChange={e => setAppForm(p => ({ ...p, photo_name_required: e.target.checked }))}
                  className="w-4 h-4 rounded border-charcoal-300 text-charcoal-900"
                />
                Name Overlay Required
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appForm.photo_date_required}
                  onChange={e => setAppForm(p => ({ ...p, photo_date_required: e.target.checked }))}
                  className="w-4 h-4 rounded border-charcoal-300 text-charcoal-900"
                />
                Date Overlay Required
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Background Instructions</label>
                <input
                  type="text"
                  value={appForm.photo_background}
                  onChange={e => setAppForm(p => ({ ...p, photo_background: e.target.value }))}
                  placeholder="e.g. Plain white or light background"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Additional Photo Instructions</label>
                <input
                  type="text"
                  value={appForm.photo_instructions}
                  onChange={e => setAppForm(p => ({ ...p, photo_instructions: e.target.value }))}
                  placeholder="e.g. Taken within the last 3 months"
                  className="input-field"
                />
              </div>
            </div>
          </fieldset>

          {/* Signature Requirements Fieldset */}
          <fieldset className="border border-charcoal-200 rounded-lg p-4 space-y-4">
            <legend className="text-sm font-bold text-charcoal-900 px-2">✍️ Signature Requirements</legend>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={appForm.sig_width}
                  onChange={e => setAppForm(p => ({ ...p, sig_width: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={appForm.sig_height}
                  onChange={e => setAppForm(p => ({ ...p, sig_height: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Min KB</label>
                <input
                  type="number"
                  value={appForm.sig_min_kb}
                  onChange={e => setAppForm(p => ({ ...p, sig_min_kb: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">Max KB</label>
                <input
                  type="number"
                  value={appForm.sig_max_kb}
                  onChange={e => setAppForm(p => ({ ...p, sig_max_kb: Number(e.target.value) }))}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">Additional Signature Instructions</label>
              <input
                type="text"
                value={appForm.sig_instructions}
                onChange={e => setAppForm(p => ({ ...p, sig_instructions: e.target.value }))}
                placeholder="e.g. Sign in black ink on white paper, no capitals"
                className="input-field"
              />
            </div>
          </fieldset>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}>
              {isCreating ? 'Create Application' : 'Save Application Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setIsCreating(false); setEditingApp(null); }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Applications List */}
      <div className="card overflow-hidden">
        {applications.length > 0 ? (
          <div className="divide-y divide-charcoal-200">
            {applications.map((app) => {
              const photoReq = Array.isArray(app.photo_requirement) ? app.photo_requirement[0] : app.photo_requirement;
              const sigReq = Array.isArray(app.signature_requirement) ? app.signature_requirement[0] : app.signature_requirement;

              return (
                <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-charcoal-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-charcoal-900">{app.name}</h4>
                      {app.is_current && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Current Cycle
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        app.status === 'active' ? 'bg-green-50 text-green-700' :
                        app.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                        app.status === 'closed' ? 'bg-charcoal-100 text-charcoal-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-500 font-mono">
                      Slug: /{app.slug} {app.effective_date && `• Effective: ${app.effective_date}`} {app.verified_at && `• Verified: ${app.verified_at.split('T')[0]}`}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-charcoal-600 pt-1">
                      {photoReq ? (
                        <span>
                          <strong>Photo:</strong> {photoReq.width}×{photoReq.height}px ({photoReq.min_kb}–{photoReq.max_kb}KB)
                          {photoReq.name_required && ' [Name]'}
                          {photoReq.date_required && ' [Date]'}
                        </span>
                      ) : (
                        <span className="text-amber-600">No photo spec</span>
                      )}
                      {sigReq ? (
                        <span>
                          <strong>Signature:</strong> {sigReq.width}×{sigReq.height}px ({sigReq.min_kb}–{sigReq.max_kb}KB)
                        </span>
                      ) : (
                        <span className="text-amber-600">No signature spec</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditForm(app)}
                    >
                      Configure
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(app.id, app.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-charcoal-500">
            No application cycles configured yet. Click "+ Add Application Cycle" to define requirements.
          </div>
        )}
      </div>
    </div>
  );
}
