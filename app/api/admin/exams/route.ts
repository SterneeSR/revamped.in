import { createServerClientInstance } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization/auth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const {
      name,
      organization,
      slug,
      category,
      description,
      active,
      seo_title,
      seo_description,
      official_website,
    } = body;

    // Validate required fields
    if (!name || !organization || !slug || !category) {
      return NextResponse.json(
        { error: 'Name, organization, slug, and category are required' },
        { status: 400 }
      );
    }

    const supabase = createServerClientInstance();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('exams')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An exam with this slug already exists' },
        { status: 409 }
      );
    }

    // Create exam
    const { data: exam, error } = await supabase
      .from('exams')
      .insert({
        name,
        organization,
        slug,
        category,
        description,
        active: active ?? true,
        seo_title,
        seo_description,
        official_website,
      })
      .select()
      .single();

    if (error) {
      console.error('Exam creation error:', error);
      return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_action: 'create',
      p_entity_type: 'exam',
      p_entity_id: exam.id,
      p_new_value: exam,
    });

    return NextResponse.json({ exam }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create exam error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    
    const supabase = createServerClientInstance();
    
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        applications:applications(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ exams: data || [] });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Fetch exams error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}