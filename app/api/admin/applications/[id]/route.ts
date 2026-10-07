import { createServerClientInstance } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerClientInstance();

    const { data: existingApp, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingApp) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (body.is_current && !existingApp.is_current) {
      await supabase
        .from('applications')
        .update({ is_current: false })
        .eq('exam_id', existingApp.exam_id);
    }

    const appFields = ['name', 'slug', 'notification_cycle', 'effective_date', 'status', 'official_source_url', 'verified_at', 'is_current'];
    const appUpdates: Record<string, unknown> = {};
    for (const f of appFields) {
      if (f in body) {
        appUpdates[f] = body[f];
      }
    }

    let updatedApp = existingApp;
    if (Object.keys(appUpdates).length > 0) {
      const { data, error } = await supabase
        .from('applications')
        .update(appUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update application error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update application' }, { status: 500 });
      }
      updatedApp = data;
    }

    // Photo Requirement update/upsert
    if (body.photo_requirement) {
      const photoReq = body.photo_requirement;
      const { data: existingPhoto } = await supabase
        .from('photo_requirements')
        .select('*')
        .eq('application_id', id)
        .maybeSingle();

      const photoPayload = {
        application_id: id,
        enabled: photoReq.enabled ?? true,
        width: photoReq.width,
        height: photoReq.height,
        min_kb: photoReq.min_kb,
        max_kb: photoReq.max_kb,
        allowed_formats: photoReq.allowed_formats || ['jpg', 'jpeg'],
        name_required: Boolean(photoReq.name_required),
        date_required: Boolean(photoReq.date_required),
        name_position: photoReq.name_position || null,
        date_position: photoReq.date_position || null,
        background_instructions: photoReq.background_instructions || null,
        additional_instructions: photoReq.additional_instructions || null,
      };

      if (existingPhoto) {
        await supabase
          .from('photo_requirements')
          .update(photoPayload)
          .eq('id', existingPhoto.id);
      } else {
        await supabase
          .from('photo_requirements')
          .insert(photoPayload);
      }
    }

    // Signature Requirement update/upsert
    if (body.signature_requirement) {
      const sigReq = body.signature_requirement;
      const { data: existingSig } = await supabase
        .from('signature_requirements')
        .select('*')
        .eq('application_id', id)
        .maybeSingle();

      const sigPayload = {
        application_id: id,
        enabled: sigReq.enabled ?? true,
        width: sigReq.width,
        height: sigReq.height,
        min_kb: sigReq.min_kb,
        max_kb: sigReq.max_kb,
        allowed_formats: sigReq.allowed_formats || ['jpg', 'jpeg'],
        additional_instructions: sigReq.additional_instructions || null,
      };

      if (existingSig) {
        await supabase
          .from('signature_requirements')
          .update(sigPayload)
          .eq('id', existingSig.id);
      } else {
        await supabase
          .from('signature_requirements')
          .insert(sigPayload);
      }
    }

    await supabase.rpc('log_audit_event', {
      p_action: 'update',
      p_entity_type: 'application',
      p_entity_id: id,
      p_old_value: existingApp,
      p_new_value: updatedApp,
    });

    return NextResponse.json({ application: updatedApp });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = createServerClientInstance();

    const { data: existingApp, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingApp) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete application error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }

    await supabase.rpc('log_audit_event', {
      p_action: 'delete',
      p_entity_type: 'application',
      p_entity_id: id,
      p_old_value: existingApp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
