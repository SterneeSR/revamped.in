import { createServerClientInstance } from '@/lib/supabase/server';
import type { Exam, Application, PhotoRequirement, SignatureRequirement, ExamWithApplications, ApplicationWithRequirements } from '@/types/database';

export async function getActiveExams(): Promise<Exam[]> {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('active', true)
    .order('organization', { ascending: true })
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getExamBySlug(slug: string): Promise<Exam | null> {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  
  if (error) return null;
  return data;
}

export async function getExamWithApplications(slug: string): Promise<ExamWithApplications | null> {
  const supabase = createServerClientInstance();
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  
  if (examError || !exam) return null;
  
  const { data: applications, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('exam_id', exam.id)
    .order('effective_date', { ascending: false });
  
  if (appError) throw appError;
  
  return { ...exam, applications: applications || [] };
}

export async function getApplicationBySlugs(examSlug: string, applicationSlug: string): Promise<ApplicationWithRequirements | null> {
  const supabase = createServerClientInstance();
  
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', examSlug)
    .eq('active', true)
    .single();
  
  if (examError || !exam) return null;
  
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('exam_id', exam.id)
    .eq('slug', applicationSlug)
    .in('status', ['active', 'closed'])
    .single();
  
  if (appError || !application) return null;
  
  const [{ data: photoReq }, { data: sigReq }] = await Promise.all([
    supabase
      .from('photo_requirements')
      .select('*')
      .eq('application_id', application.id)
      .eq('enabled', true)
      .single(),
    supabase
      .from('signature_requirements')
      .select('*')
      .eq('application_id', application.id)
      .eq('enabled', true)
      .single(),
  ]);
  
  return {
    ...application,
    exam,
    photo_requirement: photoReq,
    signature_requirement: sigReq,
  };
}

export async function getCurrentApplicationForExam(examId: string): Promise<ApplicationWithRequirements | null> {
  const supabase = createServerClientInstance();
  
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*, exam:exams(*)')
    .eq('exam_id', examId)
    .eq('is_current', true)
    .single();
  
  if (appError || !application) return null;
  
  const [{ data: photoReq }, { data: sigReq }] = await Promise.all([
    supabase
      .from('photo_requirements')
      .select('*')
      .eq('application_id', application.id)
      .eq('enabled', true)
      .single(),
    supabase
      .from('signature_requirements')
      .select('*')
      .eq('application_id', application.id)
      .eq('enabled', true)
      .single(),
  ]);
  
  return {
    ...application,
    photo_requirement: photoReq,
    signature_requirement: sigReq,
  };
}

export async function searchExams(query: string): Promise<Exam[]> {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('active', true)
    .or(`name.ilike.%${query}%,organization.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(20);
  
  if (error) throw error;
  return data || [];
}

export async function getAllExamsForSitemap(): Promise<Pick<Exam, 'slug' | 'updated_at'>[]> {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase
    .from('exams')
    .select('slug, updated_at')
    .eq('active', true);
  
  if (error) throw error;
  return data || [];
}

export async function getAllApplicationsForSitemap(): Promise<{ exam_slug: string; app_slug: string; updated_at: string }[]> {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase
    .from('applications')
    .select(`
      slug,
      updated_at,
      exam:exams!inner(slug)
    `)
    .in('status', ['active', 'closed']);
  
  if (error) throw error;
  return (data || []).map(item => ({
    exam_slug: (item.exam as any)?.[0]?.slug || '',
    app_slug: item.slug,
    updated_at: item.updated_at,
  }));
}