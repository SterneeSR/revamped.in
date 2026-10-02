-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE exam_category AS ENUM ('central', 'state', 'banking', 'defence', 'teaching', 'engineering', 'medical', 'other');
CREATE TYPE application_status AS ENUM ('upcoming', 'active', 'closed', 'archived');
CREATE TYPE requirement_type AS ENUM ('photo', 'signature');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'activate', 'deactivate', 'archive');

-- Exams table
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category exam_category NOT NULL DEFAULT 'other',
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    official_website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Applications table (specific notification/cycle for an exam)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    notification_cycle TEXT,
    effective_date DATE,
    status application_status NOT NULL DEFAULT 'upcoming',
    official_source_url TEXT,
    verified_at TIMESTAMPTZ,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(exam_id, slug)
);

-- Photo requirements table
CREATE TABLE photo_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    min_kb INTEGER NOT NULL,
    max_kb INTEGER NOT NULL,
    allowed_formats TEXT[] NOT NULL DEFAULT ARRAY['jpg', 'jpeg'],
    name_required BOOLEAN NOT NULL DEFAULT false,
    date_required BOOLEAN NOT NULL DEFAULT false,
    name_position TEXT, -- JSON: {x, y, align, font_size, color}
    date_position TEXT, -- JSON: {x, y, align, font_size, color}
    background_instructions TEXT,
    additional_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Signature requirements table
CREATE TABLE signature_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    min_kb INTEGER NOT NULL,
    max_kb INTEGER NOT NULL,
    allowed_formats TEXT[] NOT NULL DEFAULT ARRAY['jpg', 'jpeg'],
    additional_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin users table (linked to Supabase Auth)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    entity_type TEXT NOT NULL, -- 'exam', 'application', 'photo_requirement', 'signature_requirement'
    entity_id UUID NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_exams_slug ON exams(slug);
CREATE INDEX idx_exams_active ON exams(active);
CREATE INDEX idx_exams_category ON exams(category);
CREATE INDEX idx_applications_exam_id ON applications(exam_id);
CREATE INDEX idx_applications_slug ON applications(slug);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_is_current ON applications(is_current) WHERE is_current = true;
CREATE INDEX idx_photo_requirements_application_id ON photo_requirements(application_id);
CREATE INDEX idx_signature_requirements_application_id ON signature_requirements(application_id);
CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photo_requirements_updated_at BEFORE UPDATE ON photo_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_signature_requirements_updated_at BEFORE UPDATE ON signature_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for published data
CREATE POLICY "Public can read active exams" ON exams
    FOR SELECT USING (active = true);

CREATE POLICY "Public can read active applications" ON applications
    FOR SELECT USING (status = 'active' OR status = 'closed');

CREATE POLICY "Public can read photo requirements for active applications" ON photo_requirements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = photo_requirements.application_id
            AND a.status IN ('active', 'closed')
        )
    );

CREATE POLICY "Public can read signature requirements for active applications" ON signature_requirements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = signature_requirements.application_id
            AND a.status IN ('active', 'closed')
        )
    );

-- Admin full access (enforced via Supabase Auth + admin_users table)
CREATE POLICY "Admins can manage exams" ON exams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage applications" ON applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage photo requirements" ON photo_requirements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage signature requirements" ON signature_requirements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

CREATE POLICY "Admins can read admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

CREATE POLICY "Admins can read audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid()
        )
    );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users au
        WHERE au.id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action audit_action,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_old_value JSONB DEFAULT NULL,
    p_new_value JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (admin_user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
    VALUES (
        auth.uid(),
        p_action,
        p_entity_type,
        p_entity_id,
        p_old_value,
        p_new_value,
        NULLIF(current_setting('request.headers.x-forwarded-for', true), '')::INET,
        current_setting('request.headers.user-agent', true)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;