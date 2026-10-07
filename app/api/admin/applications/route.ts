import { createServerClientInstance } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization/auth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      exam_id,
      name,
      slug,
      notification_cycle,
      effective_date,
      status,
      official_source_url,
      verified_at,
      is_current,
      photo_requirement,
      signature_requirement,
    } = body;

    if (!exam_id || !name || !slug) {
      return NextResponse.json({ error: 'Exam ID, name, and slug are required' }, { status: 400 });
    }

    const supabase = createServerClientInstance();

    // If setting as current, un-set other current applications for this exam
    if (is_current) {
      await supabase
        .from('applications')
        .update({ is_current: false })
        .eq('exam_id', exam_id);
    }

    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        exam_id,
        name,
        slug,
        notification_cycle,
        effective_date: effective_date || null,
        status: status || 'upcoming',
        official_source_url: official_source_url || null,
        verified_at: verified_at || null,
        is_current: Boolean(is_current),
      })
      .select()
      .single();

    if (appError) {
      console.error('Create application error:', appError);
      return NextResponse.json({ error: appError.message || 'Failed to create application' }, { status: 500 });
    }

    // Insert photo requirements if provided
    if (photo_requirement && photo_requirement.enabled !== false) {
      await supabase.from('photo_requirements').insert({
        application_id: application.id,
        enabled: true,
        width: photo_requirement.width || 300,
        height: photo_requirement.height || 300,
        min_kb: photo_requirement.min_kb || 20,
        max_kb: photo_requirement.max_kb || 50,
        allowed_formats: photo_requirement.allowed_formats || ['jpg', 'jpeg'],
        name_required: Boolean(photo_requirement.name_required),
        date_required: Boolean(photo_requirement.date_required),
        name_position: photo_requirement.name_position || null,
        date_position: photo_requirement.date_position || null,
        background_instructions: photo_requirement.background_instructions || null,
        additional_instructions: photo_requirement.additional_instructions || null,
      });
    }

    // Insert signature requirements if provided
    if (signature_requirement && signature_requirement.enabled !== false) {
      await supabase.from('signature_requirements').insert({
        application_id: application.id,
        enabled: true,
        width: signature_requirement.width || 140,
        height: signature_requirement.height || 60,
        min_kb: signature_requirement.min_kb || 10,
        max_kb: signature_requirement.max_kb || 20,
        allowed_formats: signature_requirement.allowed_formats || ['jpg', 'jpeg'],
        additional_instructions: signature_requirement.additional_instructions || null,
      });
    }

    await supabase.rpc('log_audit_event', {
      p_action: 'create',
      p_entity_type: 'application',
      p_entity_id: application.id,
      p_new_value: application,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
