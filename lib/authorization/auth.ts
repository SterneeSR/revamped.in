import { createServerClientInstance } from '@/lib/supabase/server';

export async function getUser() {
  const supabase = createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const supabase = createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single();
  
  return !error && !!data;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
}