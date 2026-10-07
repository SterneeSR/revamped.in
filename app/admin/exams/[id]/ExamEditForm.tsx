'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import type { Exam } from '@/types/database';

const categories = [
  'central',
  'state',
  'banking',
  'defence',
  'teaching',
  'engineering',
  'medical',
  'other',
] as const;

export function ExamEditForm({ exam }: { exam: Exam }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: exam.name || '',
    organization: exam.organization || '',
    slug: exam.slug || '',
    category: exam.category || 'central',
    description: exam.description || '',
    active: exam.active ?? true,
    seo_title: exam.seo_title || '',
    seo_description: exam.seo_description || '',
    official_website: exam.official_website || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/exams/${exam.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update exam');
      }

      setSuccess('Exam settings updated successfully');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${exam.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/exams/${exam.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete exam');
      }

      router.push('/admin/exams');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exam');
      setDeleteLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm" role="status">
          {success}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-1">
            Exam Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-charcoal-700 mb-1">
            Organization <span className="text-red-500">*</span>
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            value={formData.organization}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-charcoal-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleChange}
            className="input-field"
            required
            pattern="^[a-z0-9-]+$"
          />
          <p className="mt-1 text-xs text-charcoal-500">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-charcoal-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-charcoal-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
          rows={3}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="seo_title" className="block text-sm font-medium text-charcoal-700 mb-1">
            SEO Title
          </label>
          <input
            id="seo_title"
            name="seo_title"
            type="text"
            value={formData.seo_title}
            onChange={handleChange}
            className="input-field"
            maxLength={60}
          />
        </div>

        <div>
          <label htmlFor="official_website" className="block text-sm font-medium text-charcoal-700 mb-1">
            Official Website
          </label>
          <input
            id="official_website"
            name="official_website"
            type="url"
            value={formData.official_website}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="seo_description" className="block text-sm font-medium text-charcoal-700 mb-1">
          SEO Description
        </label>
        <textarea
          id="seo_description"
          name="seo_description"
          value={formData.seo_description}
          onChange={handleChange}
          className="input-field"
          rows={2}
          maxLength={160}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={formData.active}
          onChange={handleChange}
          className="w-4 h-4 rounded border-charcoal-300 text-charcoal-900 focus:ring-charcoal-500"
        />
        <label htmlFor="active" className="text-sm font-medium text-charcoal-700 cursor-pointer">
          Active (publicly accessible on the site)
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-charcoal-200">
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleDelete}
          loading={deleteLoading}
        >
          Delete Exam
        </Button>
      </div>
    </form>
  );
}
