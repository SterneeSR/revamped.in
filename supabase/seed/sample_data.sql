-- Sample data for development/testing
-- NOTE: This is SAMPLE DATA ONLY - must be verified before production use

-- Insert sample exams
INSERT INTO exams (name, organization, slug, category, description, seo_title, seo_description, official_website) VALUES
('TNPSC Group II', 'Tamil Nadu Public Service Commission', 'tnpsc-group-ii', 'state', 'Tamil Nadu Public Service Commission Group II Combined Civil Services Examination', 'TNPSC Group II Photo & Signature Resize | revamped.in', 'Resize your photograph and signature to meet TNPSC Group II 2026 requirements. 165×125px photo, 80×125px signature. Free, private, browser-based.', 'https://www.tnpsc.gov.in'),
('UPSC Civil Services', 'Union Public Service Commission', 'upsc-civil-services', 'central', 'Union Public Service Commission Civil Services Examination', 'UPSC Civil Services Photo & Signature Resize | revamped.in', 'Prepare your UPSC Civil Services application photo and signature. Free online tool with exact dimension and file size validation.', 'https://www.upsc.gov.in'),
('SSC CGL', 'Staff Selection Commission', 'ssc-cgl', 'central', 'Staff Selection Commission Combined Graduate Level Examination', 'SSC CGL Photo & Signature Resize | revamped.in', 'Resize photograph and signature for SSC CGL application. Browser-based tool with compression to meet exact requirements.', 'https://www.ssc.gov.in'),
('IBPS PO', 'Institute of Banking Personnel Selection', 'ibps-po', 'banking', 'IBPS Probationary Officer Common Recruitment Process', 'IBPS PO Photo & Signature Resize | revamped.in', 'Prepare your IBPS PO application photo and signature with exact specifications. Free, private, no upload required.', 'https://www.ibps.in'),
('RRB NTPC', 'Railway Recruitment Board', 'rrb-ntpc', 'central', 'Railway Recruitment Board Non-Technical Popular Categories', 'RRB NTPC Photo & Signature Resize | revamped.in', 'Resize your photo and signature for RRB NTPC application. Meets official dimension and file size requirements.', 'https://www.rrb.gov.in'),
('AFCAT', 'Indian Air Force', 'afcat', 'defence', 'Air Force Common Admission Test', 'AFCAT Photo & Signature Resize | revamped.in', 'Prepare AFCAT application photograph and signature. Browser-based processing with validation against official requirements.', 'https://afcat.cdac.in');

-- Get exam IDs for applications
DO $$
DECLARE
    tnpsc_id UUID;
    upsc_id UUID;
    ssc_id UUID;
    ibps_id UUID;
    rrb_id UUID;
    afcat_id UUID;
BEGIN
    SELECT id INTO tnpsc_id FROM exams WHERE slug = 'tnpsc-group-ii';
    SELECT id INTO upsc_id FROM exams WHERE slug = 'upsc-civil-services';
    SELECT id INTO ssc_id FROM exams WHERE slug = 'ssc-cgl';
    SELECT id INTO ibps_id FROM exams WHERE slug = 'ibps-po';
    SELECT id INTO rrb_id FROM exams WHERE slug = 'rrb-ntpc';
    SELECT id INTO afcat_id FROM exams WHERE slug = 'afcat';

    -- Insert applications for TNPSC Group II
    INSERT INTO applications (exam_id, name, slug, notification_cycle, effective_date, status, official_source_url, verified_at, is_current) VALUES
    (tnpsc_id, 'Group II 2026', 'group-ii-2026', '2026', '2026-01-01', 'active', 'https://www.tnpsc.gov.in/notification-group-ii-2026', NOW() - INTERVAL '30 days', true),
    (tnpsc_id, 'Group II 2025', 'group-ii-2025', '2025', '2025-01-01', 'archived', 'https://www.tnpsc.gov.in/notification-group-ii-2025', NOW() - INTERVAL '400 days', false);

    -- Insert applications for UPSC
    INSERT INTO applications (exam_id, name, slug, notification_cycle, effective_date, status, official_source_url, verified_at, is_current) VALUES
    (upsc_id, 'Civil Services 2025', 'civil-services-2025', '2025', '2025-02-01', 'active', 'https://www.upsc.gov.in/civil-services-2025', NOW() - INTERVAL '15 days', true),
    (upsc_id, 'Civil Services 2024', 'civil-services-2024', '2024', '2024-02-01', 'archived', 'https://www.upsc.gov.in/civil-services-2024', NOW() - INTERVAL '380 days', false);

    -- Insert applications for SSC CGL
    INSERT INTO applications (exam_id, name, slug, notification_cycle, effective_date, status, official_source_url, verified_at, is_current) VALUES
    (ssc_id, 'CGL 2025', 'cgl-2025', '2025', '2025-04-01', 'upcoming', 'https://www.ssc.gov.in/cgl-2025', NULL, false),
    (ssc_id, 'CGL 2024', 'cgl-2024', '2024', '2024-04-01', 'closed', 'https://www.ssc.gov.in/cgl-2024', NOW() - INTERVAL '200 days', false);

    -- Insert applications for IBPS PO
    INSERT INTO applications (exam_id, name, slug, notification_cycle, effective_date, status, official_source_url, verified_at, is_current) VALUES
    (ibps_id, 'PO 2025', 'po-2025', '2025', '2025-08-01', 'upcoming', 'https://www.ibps.in/po-2025', NULL, false),
    (ibps_id, 'PO 2024', 'po-2024', '2024', '2024-08-01', 'active', 'https://www.ibps.in/po-2024', NOW() - INTERVAL '60 days', true);

    -- Insert applications for RRB NTPC
    INSERT INTO applications (exam_id, name, slug, notification_cycle, effective_date, status, official_source_url, verified_at, is_current) VALUES
    (rrb_id, 'NTPC 2025', 'ntpc-2025', '2025', '2025-03-01', 'upcoming', 'https://www.rrb.gov.in/ntpc-2025', NULL, false),
    (rrb_id, 'NTPC 2024', 'ntpc-2024', '2024', '2024-03-01', 'closed', 'https://www.rrb.gov.in/ntpc-2024', NOW() - INTERVAL '250 days', false);

    -- Insert applications for AFCAT
    INSERT INTO applications (exam_id, name, slug, notification_cycle, effective_date, status, official_source_url, verified_at, is_current) VALUES
    (afcat_id, 'AFCAT 01/2025', 'afcat-01-2025', '2025-01', '2025-06-01', 'upcoming', 'https://afcat.cdac.in/2025-01', NULL, false),
    (afcat_id, 'AFCAT 02/2024', 'afcat-02-2024', '2024-02', '2024-12-01', 'active', 'https://afcat.cdac.in/2024-02', NOW() - INTERVAL '30 days', true);

    -- Insert photo requirements
    -- TNPSC Group II 2026
    INSERT INTO photo_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, name_required, date_required, name_position, date_position, background_instructions, additional_instructions)
    SELECT id, 165, 125, 30, 40, ARRAY['jpg', 'jpeg'], true, true,
        '{"x": 50, "y": 110, "align": "center", "font_size": 12, "color": "#000000"}'::jsonb,
        '{"x": 50, "y": 120, "align": "center", "font_size": 10, "color": "#000000"}'::jsonb,
        'White or light colored background. No shadows.',
        'Photo must be recent (not older than 3 months). Name and date in black ink.'
    FROM applications WHERE slug = 'group-ii-2026' AND exam_id = tnpsc_id;

    -- UPSC Civil Services 2025
    INSERT INTO photo_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, name_required, date_required, background_instructions, additional_instructions)
    SELECT id, 300, 300, 20, 50, ARRAY['jpg', 'jpeg'], false, false,
        'White background. Face should cover 70-80% of frame.',
        'Recent color photograph. No spectacles with colored glasses.'
    FROM applications WHERE slug = 'civil-services-2025' AND exam_id = upsc_id;

    -- SSC CGL 2024
    INSERT INTO photo_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, name_required, date_required, background_instructions, additional_instructions)
    SELECT id, 300, 300, 20, 50, ARRAY['jpg', 'jpeg'], true, true,
        'White background preferred.',
        'Name and date on the photograph.'
    FROM applications WHERE slug = 'cgl-2024' AND exam_id = ssc_id;

    -- IBPS PO 2024
    INSERT INTO photo_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, name_required, date_required, background_instructions, additional_instructions)
    SELECT id, 200, 230, 20, 50, ARRAY['jpg', 'jpeg'], false, false,
        'White background. Front pose with clear face.',
        'Recent passport size color photograph.'
    FROM applications WHERE slug = 'po-2024' AND exam_id = ibps_id;

    -- RRB NTPC 2024
    INSERT INTO photo_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, name_required, date_required, background_instructions, additional_instructions)
    SELECT id, 150, 200, 15, 40, ARRAY['jpg', 'jpeg'], true, false,
        'Light colored background.',
        'Name on the photograph.'
    FROM applications WHERE slug = 'ntpc-2024' AND exam_id = rrb_id;

    -- AFCAT 02/2024
    INSERT INTO photo_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, name_required, date_required, background_instructions, additional_instructions)
    SELECT id, 150, 200, 20, 50, ARRAY['jpg', 'jpeg'], true, true,
        'White/light background. No cap/hat.',
        'Name and date on photo. Recent photograph.'
    FROM applications WHERE slug = 'afcat-02-2024' AND exam_id = afcat_id;

    -- Insert signature requirements
    -- TNPSC Group II 2026
    INSERT INTO signature_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, additional_instructions)
    SELECT id, 80, 125, 20, 30, ARRAY['jpg', 'jpeg'],
        'Black ink on white paper. Signature should be clear and legible.'
    FROM applications WHERE slug = 'group-ii-2026' AND exam_id = tnpsc_id;

    -- UPSC Civil Services 2025
    INSERT INTO signature_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, additional_instructions)
    SELECT id, 300, 300, 10, 20, ARRAY['jpg', 'jpeg'],
        'Black ink on white paper. Signature in running hand.'
    FROM applications WHERE slug = 'civil-services-2025' AND exam_id = upsc_id;

    -- SSC CGL 2024
    INSERT INTO signature_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, additional_instructions)
    SELECT id, 300, 300, 10, 20, ARRAY['jpg', 'jpeg'],
        'Black ink on white paper.'
    FROM applications WHERE slug = 'cgl-2024' AND exam_id = ssc_id;

    -- IBPS PO 2024
    INSERT INTO signature_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, additional_instructions)
    SELECT id, 140, 60, 10, 20, ARRAY['jpg', 'jpeg'],
        'Black ink on white paper. Signature should not be in capital letters.'
    FROM applications WHERE slug = 'po-2024' AND exam_id = ibps_id;

    -- RRB NTPC 2024
    INSERT INTO signature_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, additional_instructions)
    SELECT id, 150, 200, 10, 30, ARRAY['jpg', 'jpeg'],
        'Black ink on white paper.'
    FROM applications WHERE slug = 'ntpc-2024' AND exam_id = rrb_id;

    -- AFCAT 02/2024
    INSERT INTO signature_requirements (application_id, width, height, min_kb, max_kb, allowed_formats, additional_instructions)
    SELECT id, 150, 200, 10, 30, ARRAY['jpg', 'jpeg'],
        'Black ink on white paper. Clear signature.'
    FROM applications WHERE slug = 'afcat-02-2024' AND exam_id = afcat_id;
END $$;