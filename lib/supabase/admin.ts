import { createClient } from '@supabase/supabase-js';

/**
 * Privileged Supabase client using the SERVICE_ROLE_KEY.
 * NEVER import this into client components or expose to the browser.
 * Used exclusively by Route Handlers, background cron tasks, and seeding scripts.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('your-supabase-service-role-key')) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
