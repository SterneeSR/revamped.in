import { createServerClientInstance } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = createServerClientInstance();

    const { data: exam, error } = await supabase
      .from('exams')
      .select(`
        *,
        applications:applications(
          *,
          photo_requirement:photo_requirements(*),
          signature_requirement:signature_requirements(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Fetch exam detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerClientInstance();

    // Fetch existing exam for audit log
    const { data: existing, error: fetchError } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Check slug collision if slug is being updated
    if (body.slug && body.slug !== existing.slug) {
      const { data: slugTaken } = await supabase
        .from('exams')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (slugTaken) {
        return NextResponse.json({ error: 'Slug is already in use by another exam' }, { status: 409 });
      }
    }

    const updatePayload: Record<string, unknown> = {};
    const allowedFields = [
      'name',
      'organization',
      'slug',
      'category',
      'description',
      'active',
      'seo_title',
      'seo_description',
      'official_website',
    ];

    for (const field of allowedFields) {
      if (field in body) {
        updatePayload[field] = body[field];
      }
    }

    const { data: updatedExam, error: updateError } = await supabase
      .from('exams')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update exam error:', updateError);
      return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
    }

    // Audit log
    await supabase.rpc('log_audit_event', {
      p_action: 'update',
      p_entity_type: 'exam',
      p_entity_id: id,
      p_old_value: existing,
      p_new_value: updatedExam,
    });

    return NextResponse.json({ exam: updatedExam });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update exam error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = createServerClientInstance();

    const { data: existing, error: fetchError } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete exam error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
    }

    await supabase.rpc('log_audit_event', {
      p_action: 'delete',
      p_entity_type: 'exam',
      p_entity_id: id,
      p_old_value: existing,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete exam error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
