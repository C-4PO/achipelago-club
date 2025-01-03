// src/routes/+layout.ts
import {
  PUBLIC_SUPABASE_KEY,
  PUBLIC_SUPABASE_URL,
} from '$env/static/public';

import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export const load = async ({ fetch, data, depends, url }) => {
  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event: { fetch },
    serverSession: data.session
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return { supabase, session, pathname: url.pathname };
};
