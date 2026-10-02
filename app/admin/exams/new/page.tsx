'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogoWithText } from '@/components/branding/Logo';

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

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    slug: '',
    category: 'central' as typeof categories[number],
    description: '',
    active: true,
    seo_title: '',
    seo_description: '',
    official_website: '',
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

    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create exam');
      }

      router.push(`/admin/exams/${data.exam.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/admin/exams" className="btn-ghost text-sm mb-2 inline-flex">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Exams
          </Link>
          <h1 className="text-3xl font-bold text-charcoal-900">Create New Exam</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <fieldset>
          <legend className="text-lg font-semibold text-charcoal-900 mb-4">Basic Information</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-1">
                Exam Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., TNPSC Group II"
                required
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-charcoal-700 mb-1">
                Organization <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Tamil Nadu Public Service Commission"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-charcoal-700 mb-1">
                Slug <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., tnpsc-group-ii"
                required
                pattern="^[a-z0-9-]+$"
              />
              <p className="mt-1 text-xs text-charcoal-500">Lowercase letters, numbers, and hyphens only. Used in URLs.</p>
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
                placeholder="Brief description of the exam"
              />
            </div>
          </div>
        </fieldset>

        {/* SEO & Settings */}
        <fieldset>
          <legend className="text-lg font-semibold text-charcoal-900 mb-4">SEO & Settings</legend>
          <div className="space-y-4">
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
                placeholder="Custom page title (optional)"
                maxLength={60}
              />
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
                placeholder="Custom meta description (optional)"
                maxLength={160}
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
                placeholder="https://example.gov.in"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={formData.active}
                onChange={handleChange}
                className="w-4 h-4 rounded border-charcoal-300 text-charcoal-600 focus:ring-charcoal-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-charcoal-700 cursor-pointer">
                Active (visible on public site)
              </label>
            </div>
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-charcoal-200">
          <Button type="submit" loading={loading}>
            Create Exam
          </Button>
          <Link href="/admin/exams">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}