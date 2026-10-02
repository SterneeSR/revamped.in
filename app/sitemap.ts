import { MetadataRoute } from 'next';
import { getAllExamsForSitemap, getAllApplicationsForSitemap } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revamped.in';
  
  const [exams, applications] = await Promise.all([
    getAllExamsForSitemap(),
    getAllApplicationsForSitemap(),
  ]);

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  const examRoutes = exams.map((exam) => ({
    url: `${siteUrl}/${exam.slug}`,
    lastModified: new Date(exam.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const applicationRoutes = applications.map((app) => ({
    url: `${siteUrl}/${app.exam_slug}/${app.app_slug}`,
    lastModified: new Date(app.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...examRoutes, ...applicationRoutes];
}