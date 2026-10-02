export type ExamCategory = 'central' | 'state' | 'banking' | 'defence' | 'teaching' | 'engineering' | 'medical' | 'other';
export type ApplicationStatus = 'upcoming' | 'active' | 'closed' | 'archived';
export type RequirementType = 'photo' | 'signature';
export type AuditAction = 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'archive';

export interface Exam {
  id: string;
  name: string;
  organization: string;
  slug: string;
  category: ExamCategory;
  description: string | null;
  active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  official_website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  exam_id: string;
  name: string;
  slug: string;
  notification_cycle: string | null;
  effective_date: string | null;
  status: ApplicationStatus;
  official_source_url: string | null;
  verified_at: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhotoRequirement {
  id: string;
  application_id: string;
  enabled: boolean;
  width: number;
  height: number;
  min_kb: number;
  max_kb: number;
  allowed_formats: string[];
  name_required: boolean;
  date_required: boolean;
  name_position: NameDatePosition | null;
  date_position: NameDatePosition | null;
  background_instructions: string | null;
  additional_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignatureRequirement {
  id: string;
  application_id: string;
  enabled: boolean;
  width: number;
  height: number;
  min_kb: number;
  max_kb: number;
  allowed_formats: string[];
  additional_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface NameDatePosition {
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
  font_size: number;
  color: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'super_admin';
  mfa_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_user_id: string | null;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ExamWithApplications extends Exam {
  applications: Application[];
}

export interface ApplicationWithRequirements extends Application {
  photo_requirement: PhotoRequirement | null;
  signature_requirement: SignatureRequirement | null;
  exam: Exam;
}