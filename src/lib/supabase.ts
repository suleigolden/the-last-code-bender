import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined;

if (!supabaseUrl) {
  throw new Error('Missing env var: VITE_SUPABASE_URL');
}
if (!supabaseKey) {
  throw new Error('Missing env var: VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
